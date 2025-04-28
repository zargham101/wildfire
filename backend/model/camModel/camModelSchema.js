const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
},
  imageUrl: { 
    type: String, 
    required: true 
},
  predictionResult: {
     type: String, 
     required: true 
    },
  createdAt: { 
    type: Date, 
    default: Date.now 
},
});

module.exports = mongoose.model("Prediction", predictionSchema);
