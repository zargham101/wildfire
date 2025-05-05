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
  noWildfireConfidence: { 
    type: Number, 
    required: true 
  },
  wildfireConfidence: { 
    type: Number, 
    required: true 
  },
  camImageUrl: { 
    type: String, 
    required: true 
  },
  colorScale: {
    scaleImageUrl: { 
      type: String, 
      required: true 
    },
    ranges: {
      type: [{
        min: Number,
        max: Number,
        color: String,
        label: String
      }],
      default: [
        {min: 1.0, max: 0.8, color: "red", label: "Very High"},
        {min: 0.8, max: 0.6, color: "orange", label: "High"},
        {min: 0.6, max: 0.4, color: "yellow", label: "Medium"},
        {min: 0.4, max: 0.2, color: "lightblue", label: "Low"},
        {min: 0.2, max: 0.0, color: "blue", label: "Very Low"}
      ]
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Prediction", predictionSchema);
