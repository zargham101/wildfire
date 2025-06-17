const fireService = require("../../services/processorPrediction/index");
const axios = require("axios");
const {fetchFireCSV, parseFireCSV, processFireData} = require("./fireServices");


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