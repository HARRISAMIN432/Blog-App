const Blog = require("../models/blog");
const ErrorHandler = require("../utils/errorHandler");
const fs = require("fs");
const imagekit = require("../config/imagekit");
const { format } = require("path");

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
  const optimizedImageUrl = imagekitResponse.url;
  const imageUrl = optimizedImageUrl;
  const blog = await Blog.create({
    title,
    subtitle,
    description,
    category,
    image: imageUrl,
    isPublished: isPublished === "true",
  });
  if (!blog) return next(new ErrorHandler("Blog creation failed", 500));
  res.status(201).json({
    success: true,
    message: "Blog added successfully",
  });
};
