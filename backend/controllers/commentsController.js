const Comment = require("../models/Comment");
const ErrorHandler = require("../utils/errorHandler");

exports.addComment = async (req, res, next) => {
  const { blog, name, content } = req.body;
  const comment = await Comment.create({ blog, name, content });
  if (!comment) return next(new ErrorHandler("Failed to create comment", 500));
  res.status(201).json({
    success: true,
    message: "Comment added for review",
  });
};

exports.getBlogComments = async (req, res, next) => {
  const { blogId } = req.body;
  const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({
    createdAt: -1,
  });
  res.status(200).json({
    success: true,
    comments,
  });
};
