const Blog = require("../models/blog");
const ErrorHandler = require("../utils/errorHandler");
const fs = require("fs");
const imagekit = require("../config/imagekit");
const Comment = require("../models/Comment");

exports.addBlog = async (req, res, next) => {
  const { title, subtitle, description, category, isPublished } = JSON.parse(
    req.body.blog
  );
  const imageFile = req.file;
  if (!title || !description || !category || !imageFile)
    return next(new ErrorHandler("Please fill all fields", 400));
  const fileBuffer = fs.readFileSync(imageFile.path);
  const imagekitResponse = await imagekit.upload({
    file: fileBuffer,
    fileName: imageFile.originalname,
    folder: "/blogs",
  });
  const image = imagekitResponse.url;
  const blog = await Blog.create({
    title,
    subtitle,
    description,
    category,
    image,
    isPublished: isPublished === true,
  });
  if (!blog) return next(new ErrorHandler("Blog creation failed", 500));
  res.status(201).json({
    success: true,
    message: "Blog added successfully",
  });
};

exports.getAllBlogs = async (req, res, next) => {
  const blogs = await Blog.find();
  if (!blogs) return next(new ErrorHandler("No blogs found", 404));
  res.status(200).json({
    success: true,
    blogs,
  });
};

exports.deleteBlog = async (req, res, next) => {
  const { id } = req.body;
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) return next(new ErrorHandler("Blog not found", 404));
  await Comment.deleteMany({ blog: id });
  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
};

exports.getBlogById = async (req, res, next) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) return next(new ErrorHandler("Blog not found", 404));
  res.status(200).json({
    success: true,
    blog,
  });
};

exports.togglePublish = async (req, res, next) => {
  const { id } = req.body;
  const blog = await Blog.findById(id);
  if (!blog) return next(new ErrorHandler("Blog not found", 404));
  blog.isPublished = !blog.isPublished;
  await blog.save();
  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
  });
};
