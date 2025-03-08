const chatService = require("../../services/chat/chat")
const chatController = async (req, res) => {
    const { message } = req.body;
  
    try {
      const response = await chatService(message);
      res.json({ response });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = {chatController}