const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler.js");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }
  if (email === process.env.ADMIN_EMAIL) {
    const isMatch = password === process.env.ADMIN_PASSWORD;
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const token = jwt.sign(
      { id: process.env.ADMIN_ID, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      success: true,
      token,
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: "user",
        username: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      success: true,
      token,
      username: user.name,
    });
  } catch (err) {
    return next(new ErrorHandler("Login failed. Try again later.", 500));
  }
};

exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
};

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser || email === process.env.ADMIN_EMAIL) {
      return next(new ErrorHandler("Email already exists", 409));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(201).json({
      success: true,
      token,
      username: user.name,
    });
  } catch (error) {
    return next(new ErrorHandler("Signup failed. Please try again.", 500));
  }
};
