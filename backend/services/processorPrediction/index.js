const axios = require("axios");
const FirePrediction = require("../../model/allFeaturePrediction/index");

exports.processAndPredict = async (inputData, userId) => {
  try {
    const response = await axios.post("http://localhost:5002/predict", inputData);
    console.log("python script result::", response);

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
