const express = require("express");
const controller = require("../../controller/predictionController/index");
const verifyToken = require("../../middleware/verifyToken");
const prepocessorController = require("../../controller/processorPrediction/index")


const router = express.Router();

router.post('/predict-fwi',verifyToken, controller.getFireWeatherIndex);
router.get('/prediction-count', controller.getPredictionCount);
router.get("/user/me/predictions",verifyToken, controller.getMyPredictions);
router.post("/predict-fire", verifyToken, prepocessorController.predictFire);

module.exports = router;