const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  contactNumber: {
    type: Number,
  },
  role: {
    type: String,
    enum: ["user", "admin","agency"],
    default: "user",
  },
  hasMadeRequest: { 
    type: Boolean,
    default: false,
  },
  completedPrediction: {
    type: Boolean,
    default: false,
  },
  agencyInfo: { 
    agencyName: {
      type: String,
      trim: true,
    },
    agencyContact: {
      type: String,
      trim: true,
    },
    agencyLocation: {
      type: String,
      trim: true,
    },
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
