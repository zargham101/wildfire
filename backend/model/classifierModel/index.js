const mongoose = require("mongoose");
const { Schema } = mongoose;

const fireDataSchema = new Schema(
  {
    location: {
      type: String,
      required: true,
      unique: true, 
    },
    data: [
      {
        
        date: { type: String, required: true }, 
        firearea: { type: String, required: true }, 
        prevgrow: { type: String, required: true }, 
        pctgrowth: { type: String, required: true },
        day_frac: { type: String, required: true },
        temp: { type: String, required: true },
        rh: { type: String, required: true }, 
        wind: { type: String, required: true },
        vpd: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true, 
  }
);
const FireData = mongoose.model("FireData", fireDataSchema);

module.exports = FireData;
