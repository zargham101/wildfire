// 🔹 Module 1: Fire Data Fetching Only
const axios = require("axios");
const dayjs = require("dayjs");
const { parse } = require("csv-parse/sync");
const fs = require("fs");
const API_KEY = "30e39f96762a84fb21c34018427dd7fa";
const SOURCE = "VIIRS_SNPP_NRT";
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
// const { getWeatherData } = require("./weatherFetcher");

const AREA_COORDINATES = "-125.0,25.0,-66.9,49.0"; // USA bounding box: minLon, minLat, maxLon, maxLat

async function fetchFireCSV(daysBack = 10, startDate = null) {
  let url;
  if (startDate) {
    if (!/\d{4}-\d{2}-\d{2}/.test(startDate)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD.");
    }
    url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${API_KEY}/${SOURCE}/${AREA_COORDINATES}/${daysBack}/${startDate}`;
  } else {
    url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${API_KEY}/${SOURCE}/${AREA_COORDINATES}/${daysBack}`;
  }

  console.log("🔋 [Step 1] Requesting Fire CSV from:", url);

  try {
    const res = await axios.get(url);
    console.log("✅ [Step 1] Fetched fire data (length):", res.data.length);
    return res.data;
  } catch (err) {
    console.error("❌ [Step 1] Fetching error:", err.message);
    return null;
  }
}
async function fetchWeatherAndComputeVPD(lat, lon) {
  const API_KEY = "42fb097c42d73c4d4ac6572daf0d9690";
  const timestamps = [
    Math.floor(Date.now() / 1000), // now
    Math.floor((Date.now() - 86400000) / 1000), // 1 day ago
    Math.floor((Date.now() - 2 * 86400000) / 1000), // 2 days ago
  ];

  const results = {};

  for (let ts of timestamps) {
    const url = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${ts}&appid=${API_KEY}&units=metric`;
    try {
      const response = await axios.get(url);
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

  return results; // { "2025-06-16": { temp, rh, wind, vpd }, ... }
}

function parseFireCSV(csvText) {
  try {
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    });
    console.log("✅ [Step 2] Parsed records:", records.length);
    return records;
  } catch (err) {
    console.error("❌ [Step 2] CSV parse error:", err.message);
    return [];
  }
}

async function trackFires(records) {
  const grouped = {};
  const allSeries = {}; // 🔹 To store results for saving

  for (const rec of records) {
    const lat = parseFloat(rec.latitude).toFixed(2);
    const lon = parseFloat(rec.longitude).toFixed(2);
    const key = `${lat},${lon}`;
    const dateTime = `${rec.acq_date}T${rec.acq_time}`;
    const frp = parseFloat(rec.frp);

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({ dateTime, frp });
  }

  for (const key in grouped) {
    const [lat, lon] = key.split(",");
    const weatherMap = await fetchWeatherAndComputeVPD(lat, lon);
    console.log(`🌦️ WeatherMap for [${key}]:`, weatherMap);

    const series = grouped[key]
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
      .map((d, i, arr) => {
        const prev = i > 0 ? arr[i - 1] : null;
        const firearea = d.frp * 0.5;
        const prevgrow = prev ? prev.frp * 0.5 : 0;
        const pctgrowth =
          prevgrow > 0
            ? Math.max(0, ((firearea - prevgrow) / prevgrow) * 100)
            : 0;
        const day_frac = i / Math.max(1, arr.length - 1);
        const date = d.dateTime.split("T")[0];
        console.log(`📅 Checking weather for date: ${date} for fire at ${key}`);

        let weather = weatherMap[date];
        if (!weather) {
          const availableDates = Object.keys(weatherMap);
          if (availableDates.length > 0) {
            const fallbackDate = availableDates[availableDates.length - 1];
            weather = weatherMap[fallbackDate];
            console.warn(
              `⚠️ Weather missing for ${date}, using fallback ${fallbackDate} for fire at ${key}`,
            );
          } else {
            weather = {};
          }
        }

        return {
          key,
          date,
          firearea: firearea.toFixed(2),
          prevgrow: prevgrow.toFixed(2),
          pctgrowth: pctgrowth.toFixed(2),
          day_frac: day_frac.toFixed(2),
          ...weather, // adds temp, rh, wind, vpd if available
        };
      });

    allSeries[key] = series;

    console.log(`\nFire at [${key}]:`);
    for (const entry of series) {
      console.log(
        `Date: ${entry.date} | Fire Area: ${entry.firearea} ha | Prev Area: ${entry.prevgrow} ha | Growth: ${entry.pctgrowth}% | Day Fraction: ${entry.day_frac}`,
      );
    }
  }

  const path = require("path");
  const outputPath = path.join(__dirname, "fire_tracks.json");
  try {
    fs.writeFileSync(outputPath, JSON.stringify(allSeries, null, 2));
    console.log("✅ fire_tracks.json saved successfully.");
  } catch (err) {
    console.error("❌ Failed to save fire_tracks.json:", err.message);
  }
}

// 🔹 Test Step 1 + 2 + 3
(async () => {
  const csvData = await fetchFireCSV(2, "2025-06-15");
  if (csvData) {
    console.log("📓 First 300 chars of CSV:\n", csvData.slice(0, 300));
    const fireRecords = parseFireCSV(csvData);
    console.log("\n🔥 Raw Parsed Fire Records:");
    fireRecords.forEach((rec, i) => {
      if (i < 10) {
        // print only first 10 to avoid flooding console
        console.log(
          `${i + 1}. Date: ${rec.acq_date}, Time: ${rec.acq_time}, Lat: ${rec.latitude}, Lon: ${rec.longitude}, FRP: ${rec.frp}`,
        );
      }
    });
    console.log(`\n🧾 Total Fire Records: ${fireRecords.length}\n`);

    await trackFires(fireRecords);
  }
})();

app.use(cors());

app.get("/api/fire-tracks", (req, res) => {
  const dataPath = path.join(__dirname, "fire_tracks.json");
  if (fs.existsSync(dataPath)) {
    const jsonData = fs.readFileSync(dataPath);
    res.json(JSON.parse(jsonData));
  } else {
    res.status(404).json({ error: "Data not found" });
  }
});
app.get("/", (req, res) => {
  res.send("🔥 Wildfire API is live. Use /api/fire-tracks to get data.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API Server running at http://localhost:${PORT}`);
});