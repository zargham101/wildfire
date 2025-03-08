// Importing OpenAI correctly for version v3.x
const { OpenAI } = require("openai"); // Note the new import style for OpenAI SDK v3.x

// Initialize OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.CHAT_API_KEY, // Your OpenAI API key
});

// Chat service to interact with GPT-3
const chatService = async (message) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // Use the correct model, GPT-3.5 turbo is recommended for chatbot tasks
      messages: [{ role: "user", content: message }],
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error(error);
    throw new Error("Error with GPT interaction.");
  }
};

module.exports = { chatService };
