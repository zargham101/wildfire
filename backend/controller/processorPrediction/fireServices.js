const axios = require("axios");
const fs = require("fs");
const { parse } = require("csv-parse/sync");

const API_KEY = "30e39f96762a84fb21c34018427dd7fa"; // FIRMS API Key
const SOURCE = "VIIRS_SNPP_NRT"; // Satellite source for MODIS
const AREA = "-141.00,41.68,-52.62,83.11"; // Area code for Canada

/**
 * Fetch fire data from FIRMS API for the past N days.
 */

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

function groupByProximity(records, maxDistance = 1.1) {
  const clusters = [];

  for (const rec of records) {
    const lat = parseFloat(rec.latitude);
    const lon = parseFloat(rec.longitude);
    let addedToCluster = false;

    for (const cluster of clusters) {
      const [clusterLat, clusterLon] = cluster[0]; 
      const distance = haversine(lat, lon, clusterLat, clusterLon);

      if (distance <= maxDistance) {
        cluster.push([lat, lon, rec]); 
        addedToCluster = true;
        break;
      }
    }
    if (!addedToCluster) {
      clusters.push([[lat, lon], [lat, lon, rec]]); 
    }
  }

  return clusters;
}

function calculateCenter(cluster) {
  const latSum = cluster.reduce((sum, record) => sum + parseFloat(record[0]), 0);
  const lonSum = cluster.reduce((sum, record) => sum + parseFloat(record[1]), 0);

  const centerLat = latSum / cluster.length;
  const centerLon = lonSum / cluster.length;
  
  return { lat: centerLat.toFixed(2), lon: centerLon.toFixed(2) };
}


async function fetchWeatherAndComputeVPD(lat, lon) {
  const API_KEY = "42fb097c42d73c4d4ac6572daf0d9690";
  const timestamps = [
    Math.floor(Date.now() / 1000), // now
    Math.floor((Date.now() - 86400000) / 1000), 
    Math.floor((Date.now() - 2 * 86400000) / 1000),
  ];

  const results = {};

  for (let ts of timestamps) {
    const url = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${ts}&appid=${API_KEY}&units=metric`;
    try {
      const response = await axios.get(url);
      console.log("response with 1 data ::",response.data);
      console.log("response::",response.data.data);
      const hourData = response.data.data[0]; // pick first hour

      const temp = hourData.temp;
      const rh = hourData.humidity;
      const wind = hourData.wind_speed;

      const svp = 6.1078 * Math.pow(10, (7.5 * temp) / (237.3 + temp));
      const avp = (rh / 100) * svp;
      const vpd = svp - avp;

      const date = new Date(hourData.dt * 1000).toISOString().split("T")[0];
      results[date] = {
        temp: temp.toFixed(2),
        rh: rh.toFixed(2),
        wind: wind.toFixed(2),
        vpd: vpd.toFixed(2),
      };
    } catch (err) {
      console.error(
        `❌ OpenWeather error for ${lat},${lon} at ${ts}:`,
        err.message,
      );
    }
  }

  return results; 
}

async function fetchFireCSV(daysBack = 1, startDate = null) {
  let url;
  if (startDate) {
    if (!/\d{4}-\d{2}-\d{2}/.test(startDate)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD.");
    }
    url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${API_KEY}/${SOURCE}/${AREA}/${daysBack}/${startDate}`;
  } else {
    url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${API_KEY}/${SOURCE}/${AREA}/${daysBack}`;
  }

  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error("Error fetching fire data:", err.message);
    return null;
  }
}

/**
 * Parse the fire CSV data.
 */
function parseFireCSV(csvText) {
  try {
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    });
    return records;
  } catch (err) {
    console.error("Error parsing CSV:", err.message);
    return [];
  }
}

/**
 * Process the fire data and add weather data for each unique lat/lon location, ensuring time series consistency.
 */
async function processFireData(records, daysBack = 1) {
  const allSeries = {};
  console.log("records",records.length);

  const clusters = groupByProximity(records);
  console.log("clusters",clusters.length);


  console.time("fetching weather");
  const weatherRequests = clusters.map(async (cluster) => {
    const { lat, lon } = calculateCenter(cluster);
    const weatherData = await fetchWeatherAndComputeVPD(lat, lon);
    return { cluster, weatherData };
  });

  const weatherResults = await Promise.all(weatherRequests);
  console.timeEnd("fetching weather");

  console.time("processing groups");
  weatherResults.forEach(({ cluster, weatherData }) => {
    const series = cluster
      .sort((a, b) => new Date(a[2].dateTime) - new Date(b[2].dateTime))
      .map((d, i, arr) => {
        const prev = i > 0 ? arr[i - 1] : null;
        const firearea = d[2].frp * 0.5; 
        const prevgrow = prev ? prev[2].frp * 0.5 : 0;
        const pctgrowth = prevgrow > 0 ? Math.max(0, ((firearea - prevgrow) / prevgrow) * 100) : 0;
        const day_frac = i / Math.max(1, arr.length - 1); 

        const weatherForDate = weatherData.daily.time.find(time => time === date);
        const weather = weatherForDate ? weatherData.daily : {}; // Use empty object if no matching weather data is found

        return {
          key: `${d[0]},${d[1]}`,
          date,
          firearea: firearea.toFixed(2),
          prevgrow: prevgrow.toFixed(2),
          pctgrowth: pctgrowth.toFixed(2),
          day_frac: day_frac.toFixed(2),
          weather: weather || {}, 
        };
      });

    allSeries[`${cluster[0][0]},${cluster[0][1]}`] = series;
  });
  console.timeEnd("processing groups");

  fs.writeFileSync("fire_weather_data.json", JSON.stringify(allSeries, null, 2));
  console.log("Data saved to fire_weather_data.json");
}

module.exports = { fetchFireCSV, parseFireCSV, processFireData };
