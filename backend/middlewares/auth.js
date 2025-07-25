const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "admin") {
      req.user = {
        _id: decoded.id,
        name: "Admin",
        role: "admin",
      };
    } else {
      const user = await User.findById(decoded.id).select("_id name");
      if (!user) return res.status(401).json({ message: "User not found" });
      req.user = {
        _id: user._id,
        name: decoded.username,
        role: "user",
      };
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }
    next();
  };
};
