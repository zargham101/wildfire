const mongoose = require("mongoose");

const AgencyResourcesSchema = new mongoose.Schema({
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  maxResources: {
    firefighters: Number,
    firetrucks: Number,
    helicopters: Number,
    commanders: Number
  },
  currentResources: {
    firefighters: Number,
    firetrucks: Number,
    helicopters: Number,
    commanders: Number
  },
  heavyEquipment: [String],
  resourceHistory: [{
    resourcesUsed: {
      firefighters: Number,
      firetrucks: Number,
      helicopters: Number,
      commanders: Number
    },
    dateUsed: {
      type: Date,
      default: Date.now
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResourceRequest"
    },
    action: { 
      type: String,
      enum: ['deduct'],
      default: 'deduct'
    }
  }],
  locked: {
    type: Boolean,
    default: false
  },
  lockReason: {
    type : String
  }
}, { timestamps: true });

module.exports = mongoose.model("AgencyResources", AgencyResourcesSchema);
