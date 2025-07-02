const mongoose = require("mongoose");
const prediction = require("../prediction");

const NewPreditionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fireData: {
    type: Object,
    required: true
  },
  prediction: {
    type: Array,
    required: true
  },
  fireDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FireData",
    required: true
  },
},{
  timestamps: true
})

module.exports = mongoose.model("NewPrediction", NewPreditionSchema);