const adminService = require("../adminService/index");

// ----------------- ADMIN CREATE -----------------
exports.createAdmin = async (req, res) => {
  try {
    const admin = await adminService.createAdmin(req.body);
    res.status(201).json({ message: "Admin created", admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------- USER HANDLERS -----------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await adminService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------- REVIEWS -----------------
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await adminService.getAllReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await adminService.deleteReview(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------- IMAGE PREDICTIONS -----------------
exports.getAllImagePredictions = async (req, res) => {
  try {
    const predictions = await adminService.getAllImagePredictions();
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getImagePredictionById = async (req, res) => {
  try {
    const prediction = await adminService.getImagePredictionById(req.params.id);
    if (!prediction) return res.status(404).json({ message: "Prediction not found" });
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteImagePrediction = async (req, res) => {
  try {
    await adminService.deleteImagePrediction(req.params.id);
    res.json({ message: "Prediction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------- FEATURE PREDICTIONS -----------------
exports.getAllFeaturePredictions = async (req, res) => {
  try {
    const predictions = await adminService.getAllFeaturePredictions();
    
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeaturePredictionById = async (req, res) => {
  try {
    const prediction = await adminService.getFeaturePredictionById(req.params.id);
    if (!prediction) return res.status(404).json({ message: "Prediction not found" });
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteFeaturePrediction = async (req, res) => {
  try {
    await adminService.deleteFeaturePrediction(req.params.id);
    res.json({ message: "Prediction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
