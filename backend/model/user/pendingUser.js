const mongoose = require("mongoose");

const PendingUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  otp: String,
  otpExpiresAt: Date, 
});

module.exports = mongoose.model("PendingUser", PendingUserSchema);