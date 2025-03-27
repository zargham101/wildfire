const mongoose = require("mongoose");

const WildfirePredictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  input: {
    "Temp.": Number,
    RH: Number,
    "Wind Dir.": Number,
    "Adj. Wind Speed": Number,
    "24hr. Rain": Number,
    FFMC: Number,
    DMC: Number,
    DC: Number,
    ISI: Number,
  },
  fwi: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("WildfirePrediction", WildfirePredictionSchema);
