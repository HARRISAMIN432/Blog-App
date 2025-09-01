const ErrorHandler = require("../utils/errorHandler");
const Blog = require("../models/Blog.js");
const Subscriber = require("../models/subscribe.js");
const Comment = require("../models/Comment.js");

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
    .populate("userId", "name")
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

exports.getSubscribers = async (req, res, next) => {
  const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
  res.status(200).json({ success: true, subscribers });
};
