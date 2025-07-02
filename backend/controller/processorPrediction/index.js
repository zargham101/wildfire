const fireService = require("../../services/processorPrediction/index");
const axios = require("axios");
const {fetchFireCSV, parseFireCSV, processFireData} = require("./fireServices");
const FireData = require('../../model/classifierModel/index');
const { parse } = require('csv-parse/sync');


exports.predictFire = async (req, res) => {
  try {
    const userId = req.user._id; 
    const result = await fireService.processAndPredict(req.body, userId);
    
    res.status(200).json({
        message:"Prediction successful",
        data:result
    });
  } catch (err) {
    res.status(500).json({ message: "Prediction failed", error: err.message });
  }
};

exports.fetchAll = async (req,res) => {
  try {
    const userId = req.user._id; 

    const result = await fireService.getAllPredictions(userId);


    res.status(200).json({
      message:"Prediction successfully found",
      data:result
  });

  } catch (error) {
    return res.status(402).json({
      message: "Prediciton not found",
      error: error.message
    })
  }
}

exports.handleFirePrediction = async (req, res) => {
  try {
    const userId = req.user?._id;
    const prediction = await fireService.predictImage(req.file, userId);
    res.status(200).json({ message: "Prediction successful", data: prediction });
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Prediction failed.";
    res.status(status).json({ message });
  }
};

exports.handleFireSize = async (req, res) => {
  try {
    const { daysBack = 7, startDate = null } = req.body; // Get params from the request body
    
    // Fetch fire data from the FIRMS API
    const csvData = await fetchFireCSV(daysBack, startDate); 

    if (!csvData) {
      return res.status(500).json({ error: "Error fetching fire data from FIRMS API" });
    }

    // Parse the fire CSV data
    const fireRecords = parseFireCSV(csvData); 

    if (fireRecords.length === 0) {
      return res.status(400).json({ error: "No valid fire records found" });
    }

    // Process the fire data and integrate weather data for each fire location
    await processFireData(fireRecords, daysBack); // Save the processed data to a JSON file

    // Return a success message with a status of 200
    res.status(200).json({ message: "Fire and weather data processed and saved successfully." });
  } catch (error) {
    console.error("Error processing fire and weather data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// exports.getAllFireData = async (req, res) => {
//   try {
//     const fires = await getActiveFires();
//     const fireData = [];

//     for (const fire of fires.slice(0, 5)) {
//       try {
//         const weather = await getCurrentWeather(fire.latitude, fire.longitude);
//         const elevation = await getElevationData(fire.latitude, fire.longitude);
//         const soil = await getSoilData(fire.latitude, fire.longitude);
//         const vegetation = await getVegetationData(fire.latitude, fire.longitude);

//         const vpd = calculateVPD(weather.temperature, weather.humidity);
//         const { fwi, isi, bui } = calculateFWI({
//           temperature: weather.temperature,
//           humidity: weather.humidity,
//           windSpeed: weather.windSpeed,
//           rain: weather.rain || 0
//         });

//         const now = new Date();
//         const dayFrac = (now.getUTCHours() * 60 + now.getUTCMinutes()) / 1440;

//         const structured = {
//           tmax: weather.temperature,
//           rh: weather.humidity,
//           ws: weather.windSpeed,
//           vpd,
//           fwi,
//           isi,
//           bui,
//           closure: soil.moisture,
//           biomass: vegetation.biomass,
//           slope: elevation.slope,
//           fire_intensity_ratio: fire.frp > 0 ? vegetation.ndvi / fire.frp : 0,
//           pctgrowth_capped: 0,
//           day_frac: dayFrac,
//           firearea: fire.frp * 0.01,
//           fwi_prev1: 0,
//           fwi_prev2: 0,
//           rh_prev1: 0,
//           rh_prev2: 0,
//           prevGrowth: 0
//         };

//         // Save or update fire data in DB
//         let record = await FireData.findOne({ location: `${fire.latitude},${fire.longitude}` });

//         if (!record) {
//           record = await FireData.create({
//             location: `${fire.latitude},${fire.longitude}`,
//             data: [structured]
//           });
//         } else {
//           record.data.push(structured);
//           await record.save();
//         }

//         fireData.push(record);
//       } catch (err) {
//         console.error(`Skipping fire at ${fire.latitude},${fire.longitude}:`, err.message);
//       }
//     }

//     const validFireData = fireData.filter(f => f.location && f.data.length > 0);
//     res.status(200).json(validFireData);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Error fetching fire data: ' + err.message });
//   }
// };


//Helpers

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Fetch FIRMS data for a specific date
const getFirmsDataForDate = async (date) => {
  const FIRMS_API_KEY = process.env.FIRMS_API_KEY || "30e39f96762a84fb21c34018427dd7fa";
  const dateStr = date.toISOString().split('T')[0];
  const url = `https://firms.modaps.eosdis.nasa.gov/api/country/csv/${FIRMS_API_KEY}/VIIRS_SNPP_NRT/USA/1?date=${dateStr}`;
  
  try {
    const response = await axios.get(url, {
      responseType: 'text',
      httpsAgent: new (require('https').Agent)({ family: 4 }),
    });
    
    const records = parse(response.data, {
      columns: true,
      skip_empty_lines: true
    });
    
    return records.map(record => ({
      ...record,
      latitude: parseFloat(record.latitude),
      longitude: parseFloat(record.longitude),
      frp: parseFloat(record.frp),
      date: dateStr
    }));
  } catch (error) {
    console.error(`Error fetching FIRMS data for ${dateStr}:`, error.message);
    return [];
  }
};

// Cluster fires using Haversine distance
const clusterFires = (allFires, maxDistance = 1.0) => {
  const clusters = [];
  const processed = new Set();
  
  for (let i = 0; i < allFires.length; i++) {
    if (processed.has(i)) continue;
    
    const cluster = [allFires[i]];
    processed.add(i);
    
    for (let j = i + 1; j < allFires.length; j++) {
      if (processed.has(j)) continue;
      
      const distance = haversineDistance(
        allFires[i].latitude, allFires[i].longitude,
        allFires[j].latitude, allFires[j].longitude
      );
      
      if (distance <= maxDistance) {
        cluster.push(allFires[j]);
        processed.add(j);
      }
    }
    
    clusters.push(cluster);
  }
  
  return clusters;
};

// Get weather data for specific date and location
const getWeatherForDate = async (lat, lon, date) => {
  try {
    const dateStr = date.toISOString().split('T')[0];
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast`,
      {
        params: {
          latitude: lat,
          longitude: lon,
          daily: 'temperature_2m_max,wind_speed_10m_max,precipitation_sum',
          hourly: 'relative_humidity_2m',
          start_date: dateStr,
          end_date: dateStr,
          timezone: 'UTC'
        }
      }
    );

    const daily = response.data.daily;
    const hourly = response.data.hourly;

    const avgHumidity = hourly.relative_humidity_2m
      ? hourly.relative_humidity_2m.reduce((a, b) => a + b, 0) / hourly.relative_humidity_2m.length
      : 50;

    return {
      temperature: daily.temperature_2m_max[0] || 20,
      humidity: avgHumidity || 50,
      windSpeed: daily.wind_speed_10m_max[0] || 5,
      rain: daily.precipitation_sum[0] || 0
    };
  } catch (error) {
    console.log('Weather API error:', error);
    return { temperature: 20, humidity: 50, windSpeed: 5, rain: 0 };
  }
};


// Calculate VPD
const calculateVPD = (temp, rh) => {
  const svp = 0.61078 * Math.exp(17.2694 * temp / (temp + 238.3));
  return (1 - rh/100) * svp;
};

// Calculate FWI components
const calculateFWI = ({ temperature, humidity, windSpeed, rain }) => {
  const moisture = Math.max(0, 10 - (rain || 0));
  const ffmc = 85 - 0.7 * humidity + 0.2 * temperature;
  const dmc = 6 + 0.25 * temperature;
  const dc = 15 + 0.5 * temperature;
  
  const isi = 0.208 * windSpeed * Math.exp(0.05039 * ffmc);
  const bui = 0.8 * dc * dmc / (dmc + 0.4 * dc);
  const fwi = isi * bui / 100;
  
  return {
    fwi: Math.min(fwi, 50),
    isi: Math.min(isi, 20),
    bui: Math.min(bui, 100)
  };
};

// Get elevation and slope data
const getElevationData = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.open-elevation.com/api/v1/lookup`,
      { params: { locations: `${lat},${lon}` } }
    );
    
    const points = [
      { lat: parseFloat(lat) + 0.01, lon: parseFloat(lon) },
      { lat: parseFloat(lat) - 0.01, lon: parseFloat(lon) },
      { lat: parseFloat(lat), lon: parseFloat(lon) + 0.01 },
      { lat: parseFloat(lat), lon: parseFloat(lon) - 0.01 }
    ];
    
    const elevations = await Promise.all(
      points.map(async point => {
        try {
          const res = await axios.get(
            `https://api.open-elevation.com/api/v1/lookup`,
            { params: { locations: `${point.lat},${point.lon}` } }
          );
          return res.data.results[0].elevation;
        } catch {
          return 0;
        }
      })
    );
    
    const maxDiff = Math.max(...elevations) - Math.min(...elevations);
    const slope = Math.min(maxDiff / 2000, 45);
    
    return {
      elevation: response.data.results[0].elevation,
      slope: slope
    };
  } catch (error) {
    console.error('Elevation API error:', error.message);
    return { elevation: 0, slope: 5 };
  }
};

// Get soil data
const getSoilData = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://rest.isric.org/soilgrids/v2.0/properties/query`,
      {
        params: {
          lon,
          lat,
          property: 'wv0010',
          depth: '0-5cm',
          value: 'mean'
        }
      }
    );
    
    return {
      moisture: response.data.properties.layers[0].depths[0].values.mean / 100
    };
  } catch (error) {
    console.error('Soil API error:', error.message);
    return { moisture: 0.3 };
  }
};

// Get vegetation data
const getVegetationData = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://appeears.earthdatacloud.nasa.gov/api/point`,
      {
        params: {
          lat,
          lon,
          products: 'MCD43A4.006',
          start: new Date().toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        }
      }
    );
    
    const ndvi = response.data.data[0]?.NDVI || 0.5;
    const biomass = Math.min(ndvi * 5, 3);
    
    return { ndvi, biomass };
  } catch (error) {
    console.error('Vegetation API error:', error.message);
    return { ndvi: 0.5, biomass: 1.5 };
  }
};
// Process cluster into time series with environmental data
const processClusterTimeSeries = async (cluster) => {
  const centerLat = cluster.reduce((sum, fire) => sum + fire.latitude, 0) / cluster.length;
  const centerLon = cluster.reduce((sum, fire) => sum + fire.longitude, 0) / cluster.length;
  
  const elevation = await getElevationData(centerLat, centerLon);
  const soil = await getSoilData(centerLat, centerLon);
  const vegetation = { ndvi: 0.5, biomass: 1.5 } || await getVegetationData(centerLat, centerLon);
  
  const firesByDate = cluster.reduce((acc, fire) => {
    if (!acc[fire.date]) acc[fire.date] = [];
    acc[fire.date].push(fire);
    return acc;
  }, {});
  
  const timeSeries = [];
  const dates = Object.keys(firesByDate).sort();
  
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const dayFires = firesByDate[date];
    const avgFire = {
      latitude: dayFires.reduce((sum, f) => sum + f.latitude, 0) / dayFires.length,
      longitude: dayFires.reduce((sum, f) => sum + f.longitude, 0) / dayFires.length,
      frp: dayFires.reduce((sum, f) => sum + f.frp, 0) / dayFires.length
    };
    
    const weather = await getWeatherForDate(avgFire.latitude, avgFire.longitude, new Date(date));
    const vpd = calculateVPD(weather.temperature, weather.humidity);
    const { fwi, isi, bui } = calculateFWI(weather);
    
    const firearea = avgFire.frp * 0.01;
    const prevFirearea = i > 0 ? timeSeries[i-1].firearea : 0;
    const prevGrowth = firearea - prevFirearea;
    const pctgrowth_capped = prevFirearea > 0 ? 
      Math.min(prevGrowth / (prevFirearea + 0.001), 1) : 0;
    const fire_intensity_ratio = prevGrowth / (firearea + 0.001);
    
    const dayFrac = i / Math.max(1, dates.length - 1);
    
    const dayData = {
      tmax: weather.temperature,
      rh: weather.humidity,
      ws: weather.windSpeed,
      vpd,
      fwi,
      isi,
      bui,
      closure: soil.moisture,
      biomass: vegetation.biomass,
      slope: elevation.slope,
      fire_intensity_ratio,
      pctgrowth_capped,
      day_frac: dayFrac,
      firearea,
      fwi_prev1: i > 0 ? timeSeries[i-1].fwi : 0,
      fwi_prev2: i > 1 ? timeSeries[i-2].fwi : 0,
      rh_prev1: i > 0 ? timeSeries[i-1].rh : weather.humidity,
      rh_prev2: i > 1 ? timeSeries[i-2].rh : weather.humidity,
      prevGrowth
    };
    
    timeSeries.push(dayData);
  }
  
  while (timeSeries.length < 7) {
    const lastDay = timeSeries[timeSeries.length - 1] || {
      tmax: 20, rh: 50, ws: 5, vpd: 1, fwi: 5, isi: 5, bui: 20,
      closure: soil.moisture, biomass: vegetation.biomass, slope: elevation.slope,
      fire_intensity_ratio: 0, pctgrowth_capped: 0, day_frac: 0,
      firearea: 0, fwi_prev1: 0, fwi_prev2: 0, rh_prev1: 50, rh_prev2: 50, prevGrowth: 0
    };
    
    timeSeries.push({ ...lastDay, firearea: 0, prevGrowth: 0, pctgrowth_capped: 0, fire_intensity_ratio: 0 });
  }
  
  return {
    location: `${centerLat.toFixed(4)},${centerLon.toFixed(4)}`,
    clusterStart: dates[0],
    data: timeSeries.slice(0, 7) 
  };
};

exports.getAllFireData = async (req,res) => {
  try {
    const today = new Date();
    const promises = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      promises.push(getFirmsDataForDate(date));
    }
    
    const dailyFireData = await Promise.all(promises);
    const allFires = dailyFireData.flat();
    
    if (allFires.length === 0) {
      return [];
    }
    
    const clusters = clusterFires(allFires);
    
    const fireData = [];
    const processedClusters = clusters.slice(0, 2); 
    
    for (const cluster of processedClusters) {
      try {
        const clusterData = await processClusterTimeSeries(cluster);
        let record = await FireData.findOne({ location: clusterData.location });
        if (!record) {
          record = await FireData.create(clusterData);
        } else {
          record.data = clusterData.data;
          record.clusterStart = clusterData.clusterStart;
          await record.save();
        }
        
        fireData.push(record);
      } catch (err) {
        console.error(`Error processing cluster:`, err.message);
      }
    }
    
    const validFireData = fireData.filter(f => f.location && f.data.length > 0);
    res.status(200).json(validFireData);
  } catch (err) {
    throw new Error('Error fetching fire data: ' + err.message);
  }
};

exports.getFireDataById = async (req,res) => {
  try{
    const {id} = req.query;
    
  const result = await fireService.getFireDataById(id);
  if(!result){
    return res.status(401).json({
      message: "No fire data found"
    })
  }
  const userId = req.user?.id;
  const savedPrediction = await fireService.savePredictionData(
    userId,
    result,
    id
  );

  return res.status(200).json({
    message:"Fire data response",
    response: result,
    savedPrediction: savedPrediction
  })
  }catch(error){
    console.error("error in controller::",error.message);
    return res.status(400).json(error.message)
  }
}
