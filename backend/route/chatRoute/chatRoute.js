const express = require("express")
const controller = require("../../controller/chatController/chatController")
const router = express.Router();

router.post("/send-message", controller.chatController);

module.exports = router;