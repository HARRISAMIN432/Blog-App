const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog.js");
const Comment = require("../models/Comment.js");

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

exports.getAllBlogsAdmin = async (req, res, next) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    blogs,
  });
};

exports.getAllComments = async (req, res, next) => {
  const comments = await Comment.find({})
    .populate("blog")
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    comments,
  });
};

exports.getDashboard = async (req, res, next) => {
  const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
  const blogs = await Blog.countDocuments();
  const comments = await Comment.countDocuments();
  const drafts = await Blog.countDocuments({ isPublished: false });
  const dashboardData = {
    blogs,
    comments,
    drafts,
    recentBlogs,
  };
  res.status(200).json({
    success: true,
    dashboardData,
  });
};

exports.deleteCommentById = async (req, res, next) => {
  const { id } = req.body;
  const c = await Comment.findByIdAndDelete(id);
  if (!c) return next(new ErrorHandler("Comment not found", 403));
  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
};

exports.approveCommentByID = async (req, res, next) => {
  const { id } = req.body;
  const c = await Comment.findByIdAndUpdate(id, {
    isApproved: true,
  });
  if (!c) return next(new ErrorHandler("Comment not found", 403));
  res.status(200).json({
    message: "Comment Approved",
    success: true,
  });
};
