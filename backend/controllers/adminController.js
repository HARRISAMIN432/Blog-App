const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  )
    return next(new ErrorHandler("Invalid email or password", 401));
  const token = jwt.sign({ id: process.env.ADMIN_ID }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.status(200).json({
    success: true,
    token,
  });
};
