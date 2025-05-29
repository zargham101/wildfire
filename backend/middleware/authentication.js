const jwt = require("jsonwebtoken");
const User = require('../model/user/index');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = user; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    // If the user has one of the roles, grant access
    if (roles.includes(req.user.role)) {
      return next();
    } 
    return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
  };
};

module.exports = { authenticate, authorize };
