const express = require("express");
const controller = require("../../controller/predictionController/index");
const verifyToken = require("../../middleware/verifyToken");
const prepocessorController = require("../../controller/processorPrediction/index")
const {upload} = require("../../config/multerConfig")


const router = express.Router();

router.post('/predict-fwi',verifyToken, controller.getFireWeatherIndex);
router.get('/prediction-count', controller.getPredictionCount);
router.get("/user/me/predictions",verifyToken, controller.getMyPredictions);
router.post("/predict-fire", verifyToken, prepocessorController.predictFire);
router.get("/my/fire/prediction", verifyToken, prepocessorController.fetchAll);
router.post("/predict/cam/result", upload, verifyToken,prepocessorController.handleFirePrediction);
router.post("/process-data", prepocessorController.handleFireSize);
router.get("/fire-data", prepocessorController.getAllFireData);
router.get("/fire-data-byId", prepocessorController.getFireDataById);


module.exports = router;