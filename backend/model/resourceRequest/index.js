const mongoose = require("mongoose");

const ResourceRequestSchema = new mongoose.Schema({
  predictionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AllFeaturesPredictionSchema",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  requiredResources: {
    firefighters: Number,
    firetrucks: Number,
    helicopters: Number,
    commanders: Number,
    heavyEquipment: [String]
  },
  status: {
    type: String,
    enum: ["pending", "assigned", "accepted", "rejected", "completed"],
    default: "pending"
  },
  userMessage: String,
  adminMessage: String,
  agencyMessage: String,
  assignedAgency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  requestHistory: [{
    status: {
      type: String,
      enum: ["pending", "assigned", "accepted", "rejected", "completed"]
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model("ResourceRequest", ResourceRequestSchema);
