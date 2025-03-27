const express = require("express");
const controller = require("../../controller/predictionController/index");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.post('/predict-fwi',verifyToken, controller.getFireWeatherIndex);
router.get('/prediction-count', controller.getPredictionCount);
router.get("/user/me/predictions",verifyToken, controller.getMyPredictions);

module.exports = router;