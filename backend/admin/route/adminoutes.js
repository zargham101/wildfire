const express = require('express');
const controller = require('../adminController/index');
const middleware = require('../../middleware/isAdmin');
const {upload} = require("../../config/multerConfig")

const router = express.Router();

router.post('/admin/create-admin', middleware.singleAdminCreation, controller.createAdmin);
router.use(middleware.isAdmin);

router.get("/users", controller.getAllUsers);
router.get("/users/:id", controller.getUserById);
router.put("/users/:id", upload, controller.updateUser);
router.delete("/users/:id", controller.deleteUser);

router.get("/reviews", controller.getAllReviews);
router.delete("/reviews/:id", controller.deleteReview);

router.get("/image-predictions", controller.getAllImagePredictions);
router.get("/image-predictions/:id", controller.getImagePredictionById);
router.delete("/image-predictions/:id", controller.deleteImagePrediction);

router.get("/feature-predictions", controller.getAllFeaturePredictions);
router.get("/feature-predictions/:id", controller.getFeaturePredictionById);
router.delete("/feature-predictions/:id", controller.deleteFeaturePrediction);

module.exports = router;