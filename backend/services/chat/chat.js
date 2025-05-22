const OpenAI = require('openai');
require("dotenv").config();

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1'
});

const chatService = async (message) => {
  try {
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat", 
      messages: [
        {
            role: 'system',
            content: 'You are an AI assistant.'
        },
        {
            role: 'user',
            content: message
        }
    ],
    temperature: 0.7,
    max_tokens: 150
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error with DeepSeek interaction:", error);
    throw new Error("Error with DeepSeek interaction.");
  }
};

module.exports = { chatService };