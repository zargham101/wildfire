const axios = require('axios');
const FirePrediction = require("../../model/allFeaturePrediction/index");
const { s3 } = require("../../config/multerConfig");
const Prediction = require("../../model/camModel/camModelSchema");
const FireData = require("../../model/classifierModel/index");
const fs = require("fs");
const path = require("path");
const {parse} = require("csv-parse/sync")
const {fetchWeatherApi} = require("openmeteo");
const {Buffer} = require("buffer")

exports.processAndPredict = async (inputData, userId) => {
  try {
    const response = await axios.post(
      "http://localhost:5002/predict",
      inputData
    );

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Model prediction failed");
    }

    const saved = await FirePrediction.create({
      userId,
      input: inputData,
      prediction: response.data.prediction,
    });

    return saved;
  } catch (err) {
    throw err;
  }
};

exports.getAllFireData = async () => {
  try {
    const fireData = await FireData.find();  // This will fetch all documents
    return fireData;
  } catch (err) {
    throw new Error('Error fetching fire data: ' + err.message);
  }
};

exports.getFireDataById = async (id) => {
  try {
    console.log("id::",id);
    const response = await FireData.findById(id);
    if(!response){
      throw new Error("No fire data found");
    }
    console.log("response::",response);
    const flaskServiceUrl = 'http://localhost:5002/predict'; 
    const fireData = {
      data: response.data,  // Make sure the structure is what Flask expects
    };
    const flaskResponse = await axios.post(flaskServiceUrl, fireData);
    console.log("Response from Flask service:", flaskResponse.data);

    return flaskResponse.data;
  } catch (error) {
    console.log("error::", error.message)
    console.error("error::", error.message)
    throw new Error("unable to find any data", error.message)
  }
}

exports.getAllPredictions = async (userId) => {
  try {
    const predictions = await FirePrediction.find({ userId }).sort({
      createdAt: -1,
    });
    return predictions;
  } catch (error) {
    throw error;
  }
};
const uploadImageToS3 = async (file) => {
  if (!file) return null;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `fire_images/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location;
};

exports.predictImage = async (file, userId) => {
  
  const imageUrl = await uploadImageToS3(file);
  
  try {
    const response = await axios.post("http://localhost:5003/predict", {
      imageUrl,
      colormap: "PLASMA",
    });
    const imageBuffer = await axios({
      url: response.data.camImageUrl,
      responseType: "arraybuffer",
    });
  
    const resultUpload = await uploadImageToS3({
      buffer: imageBuffer.data,
      originalname: "camImage.jpg", 
      mimetype: "image/jpeg", 
    });
  
    const savedPrediction = await Prediction.create({
      userId,
      imageUrl,
      predictionResult: response.data.prediction,
      noWildfireConfidence: response.data.noWildfireConfidence,
      wildfireConfidence: response.data.wildfireConfidence,
      camImageUrl: resultUpload,
      colorScale: response.data.colorScale,
    });
  
    return savedPrediction;
  } catch (err) {
    const message = err.response?.data?.message || "Prediction failed.";
    const status = err.response?.status || 500;
    const error = new Error(message);
    error.statusCode = status;
    throw error;
  }
};

exports.trackFires = async (records) => {
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
    const weatherData = await fetchWeatherData(lat, lon); // Fetch weather data for the location
    
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

        // Add weather data to the fire tracking
        return {
          key,
          date,
          firearea: firearea.toFixed(2),
          prevgrow: prevgrow.toFixed(2),
          pctgrowth: pctgrowth.toFixed(2),
          day_frac: day_frac.toFixed(2),
          weather: weatherData.daily // Adding weather data here
        };
      });

    allSeries[key] = series;

    console.log(`\nFire at [${key}]:`);
    for (const entry of series) {
      console.log(
        `Date: ${entry.date} | Fire Area: ${entry.firearea} ha | Prev Area: ${entry.prevgrow} ha | Growth: ${entry.pctgrowth}% | Day Fraction: ${entry.day_frac}`
      );
    }
  }

  // 🔹 Save output to JSON file
  fs.writeFileSync("fire_tracks_with_weather.json", JSON.stringify(allSeries, null, 2));
}