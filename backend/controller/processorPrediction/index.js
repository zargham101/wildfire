const fireService = require("../../services/processorPrediction/index");

exports.predictFire = async (req, res) => {
  try {
    console.log("user",req.user)
    const userId = req.user._id; 
    console.log("USer ID::",userId);
    const result = await fireService.processAndPredict(req.body, userId);
    console.log("result:::",result)
    res.status(200).json({
        message:"Prediction successful",
        data:result
    });
  } catch (err) {
    res.status(500).json({ message: "Prediction failed", error: err.message });
  }
};
