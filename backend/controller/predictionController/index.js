const axios = require("axios");
const WildfirePrediction = require("../../model/prediction/index");

exports.getFireWeatherIndex = async (req, res) => {
    try {
      const inputData = req.body;
      const userId = req.user._id;
  
      const response = await axios.post(
        "http://127.0.0.1:5001/wildfire/predict",
        inputData
      );
  
      const fwi = response.data.fwi;
  
      const savedRecord = await WildfirePrediction.create({
        userId,
        input: inputData,
        fwi,
      });
  
      res.json({ userId,inputData,fwi, predictionId: savedRecord._id });
    } catch (err) {
      res.status(500).json({ error: "Prediction failed" });
    }
  };

exports.getPredictionCount = async (req, res) => {
  try {
    const count = await WildfirePrediction.countDocuments();
    res.json({ totalPredictions: count });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

exports.getMyPredictions = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const predictions = await WildfirePrediction.find({ userId }).sort({ createdAt: -1 });
  
      res.json({ predictions });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch user predictions" });
    }
  };
