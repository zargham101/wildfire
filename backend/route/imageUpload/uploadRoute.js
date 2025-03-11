const express = require("express");
const controller = require("../../controller/imageUpload/uploadImageController");
const upload = require("../../config/multerConfig");

const router = express.Router();

router.post("/image", upload.upload, controller.uploadUserImage);

module.exports = router;