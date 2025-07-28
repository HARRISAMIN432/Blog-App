const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const Blog = require("../models/blog.js");
const Comment = require("../models/Comment.js");
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
    message: "User logged out successfully",
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

exports.getUserBlogs = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const blogs = await Blog.find({ user: userId })
      .sort({ createdAt: -1 })
      .select(
        "title subtitle description category image createdAt isPublished"
      );

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to fetch user blogs", 500));
  }
};

exports.getUserComments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const comments = await Comment.find({ userId })
      .populate("blog", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to fetch user comments", 500));
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;

    if (!name || !email) {
      return next(new ErrorHandler("Please provide name and email", 400));
    }

    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingUser || email === process.env.ADMIN_EMAIL) {
      return next(new ErrorHandler("Email already exists", 409));
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("name email");

    if (!updatedUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to update profile", 500));
  }
};

exports.deleteUserBlog = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.body;

    const blog = await Blog.findOne({ _id: id, user: userId });

    if (!blog) {
      return next(
        new ErrorHandler(
          "Blog not found or you don't have permission to delete it",
          404
        )
      );
    }

    await Blog.findByIdAndDelete(id);

    await Comment.deleteMany({ blog: id });

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to delete blog", 500));
  }
};

exports.deleteUserComment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const comment = await Comment.findOne({ _id: id, userId });

    if (!comment) {
      return next(
        new ErrorHandler(
          "Comment not found or you don't have permission to delete it",
          404
        )
      );
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to delete comment", 500));
  }
};
