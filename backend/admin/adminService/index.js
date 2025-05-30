const User = require("../../model/user/index");
const Review = require("../../model/reviews/index");
const Prediction = require("../../model/camModel/camModelSchema");
const AllFeaturesPrediction = require("../../model/allFeaturePrediction/index");

// ---------------------- ADMIN CREATION ------------------------
async function createAdmin(data) {
  const newAdmin = new User({ ...data, role: "admin" });
  await newAdmin.save();
  return newAdmin;
}

// ---------------------- USER CRUD ------------------------
async function getAllUsers() {
  return await User.find({ role: "user" });
}

async function getUserById(id) {
  return await User.findById(id);
}

async function updateUser(id, data) {
  const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
  
  return updatedUser
}

async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

// ---------------------- REVIEW ------------------------
async function getAllReviews() {
  return await Review.find();
}

async function deleteReview(id) {
  return await Review.findByIdAndDelete(id);
}

// ---------------------- IMAGE PREDICTIONS ------------------------
async function getAllImagePredictions() {
  return await Prediction.find().populate("userId", "name email");
}

async function getImagePredictionById(id) {
  return await Prediction.findById(id).populate("userId", "name email");
}

async function deleteImagePrediction(id) {
  return await Prediction.findByIdAndDelete(id);
}

// ---------------------- FEATURE PREDICTIONS ------------------------
async function getAllFeaturePredictions() {
  return await AllFeaturesPrediction.find().populate("userId", "name email");
}

async function getFeaturePredictionById(id) {
  return await AllFeaturesPrediction.findById(id).populate("userId", "name email");
}

async function deleteFeaturePrediction(id) {
  return await AllFeaturesPrediction.findByIdAndDelete(id);
}

module.exports = {
  createAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllReviews,
  deleteReview,
  getAllImagePredictions,
  getImagePredictionById,
  deleteImagePrediction,
  getAllFeaturePredictions,
  getFeaturePredictionById,
  deleteFeaturePrediction
};
