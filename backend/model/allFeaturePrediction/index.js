const mongoose = require("mongoose");

const PreprocessedInputSchema = new mongoose.Schema({
  fire_location_latitude: Number,
  fire_location_longitude: Number,
  fire_start_date: String,
  fire_type: String,
  fire_position_on_slope: String,
  weather_conditions_over_fire: String,
  temperature: Number,
  relative_humidity: Number,
  wind_direction: String,
  wind_speed: Number,
  fuel_type: String,
});

const AllFeaturesPredictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  input: PreprocessedInputSchema,
  prediction: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.AllFeaturesPredictionSchema ||
  mongoose.model("AllFeaturesPredictionSchema", AllFeaturesPredictionSchema);
