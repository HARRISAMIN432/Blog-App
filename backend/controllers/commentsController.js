const Comment = require("../models/Comment");

exports.addComment = async (req, res, next) => {
  try {
    const { blog, content } = req.body;
    let userId;
    let name;
    if (req.user.role === "admin") {
      userId = null;
      name = "Admin";
    } else {
      userId = req.user._id;
      name = req.user.name || "User";
    }
    const comment = await Comment.create({
      blog,
      content,
      userId,
      name,
    });
    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding comment.",
    });
  }
};

exports.getBlogComments = async (req, res, next) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({ blog: blogId, isApproved: true })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};
