const jwt = require("jsonwebtoken");
const User = require('../model/user/index');

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = user; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};


const singleAdminCreation = async (req, res, next) => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin already exists. Delete existing to create new." });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {isAdmin,singleAdminCreation};
