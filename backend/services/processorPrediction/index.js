const axios = require("axios");
const FirePrediction = require("../../model/allFeaturePrediction/index");
const { s3 } = require("../../config/multerConfig");
const Prediction = require("../../model/camModel/camModelSchema");

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
      colormap: "PLASMA"
    });

    const savedPrediction = await Prediction.create({
      userId,
      imageUrl,
      predictionResult: response.data.prediction,
      noWildfireConfidence: response.data.noWildfireConfidence,
      wildfireConfidence: response.data.wildfireConfidence,
      camImageUrl: response.data.camImageUrl,
      colorScale: response.data.colorScale
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



