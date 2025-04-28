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
    console.log("useris:::" ,req.user._id)
    const userId = req.user._id; 

    const result = await fireService.getAllPredictions(userId);

    console.log("result::", result);

    res.status(200).json({
      message:"Prediction successfully found",
      data:result
  });

  } catch (error) {
    console.log("error message::",error.message)
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
    res.status(500).json({ message: "Prediction failed", error: error.message });
  }
};

