const fireService = require("../../services/processorPrediction/index");

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

