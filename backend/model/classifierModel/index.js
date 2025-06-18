const mongoose = require("mongoose");

const fireDataSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      unique: true,
    },
    data: [
      {
        tmax: {
          type: Number,
          required: true,
        },
        rh: {
          type: Number,
          required: true,
        },
        ws: {
          type: Number,
          required: true,
        },
        vpd: {
          type: Number,
          required: true,
        },
        fwi: {
          type: Number,
          required: true,
        },
        isi: {
          type: Number,
          required: true,
        },
        bui: {
          type: Number,
          required: true,
        },
        closure: {
          type: Number,
          required: true,
        },
        biomass: {
          type: Number,
          required: true,
        },
        slope: {
          type: Number,
          required: true,
        },
        fire_intensity_ratio: {
          type: Number,
          required: true,
        },
        pctgrowth_capped: {
          type: Number,
          required: true,
        },
        day_frac: {
          type: Number,
          required: true,
        },
        firearea: {
          type: Number,
          required: true,
        },
        fwi_prev1: {
          type: Number,
          required: true,
        },
        fwi_prev2: {
          type: Number,
          required: true,
        },
        rh_prev1: {
          type: Number,
          required: true,
        },
        rh_prev2: {
          type: Number,
          required: true,
        },
        prevGrowth: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const FireData = mongoose.model("FireData", fireDataSchema);

module.exports = FireData;
