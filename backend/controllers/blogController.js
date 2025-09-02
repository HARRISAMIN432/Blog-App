const Blog = require("../models/Blog");
const ErrorHandler = require("../utils/errorHandler");
const fs = require("fs");
const imagekit = require("../config/imagekit");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");

exports.addBlog = async (req, res, next) => {
  console.log("Sun be");
  try {
    const { title, subtitle, description, category, isPublished, user } =
      JSON.parse(req.body.blog);
    console.log(req.blog);
    const imageFile = req.file;
    if (!title || !description || !category || !imageFile) {
      return next(new ErrorHandler("Please fill all fields", 400));
    }
    const imagekitResponse = await imagekit.upload({
      file: fs.createReadStream(imageFile.path),
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    const image = imagekitResponse.url;
    let blog = await Blog.create({
      title,
      subtitle,
      description,
      category,
      image,
      user: user,
      isPublished: isPublished === true || isPublished === "true",
    });
    if (!blog) {
      return next(new ErrorHandler("Blog creation failed", 500));
    }
    fs.unlinkSync(imageFile.path);
    res.status(201).json({
      success: true,
      message: "Blog added successfully",
      blog,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  const blogs = await Blog.find();
  if (!blogs) return next(new ErrorHandler("No blogs found", 404));
  res.status(200).json({
    success: true,
    blogs,
  });
};

exports.searchBlogs = async (req, res, next) => {
  try {
    const {
      q,
      category,
      limit = 20,
      page = 1,
      sort = "-createdAt",
    } = req.query;

    let searchQuery = {};

    searchQuery.isPublished = true;

    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), "i");
      searchQuery.$or = [
        { title: searchRegex },
        { subtitle: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    if (category && category !== "All") {
      searchQuery.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const blogs = await Blog.find(searchQuery)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .select(
        "title subtitle description category image createdAt isPublished"
      );

    const totalBlogs = await Blog.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalBlogs / parseInt(limit));

    if (!blogs || blogs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No blogs found matching your search criteria",
        blogs: [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: 0,
          totalBlogs: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: `Found ${blogs.length} blog(s)`,
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBlogs,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit),
      },
      searchQuery: {
        query: q || "",
        category: category || "All",
        sort,
      },
    });
  } catch (error) {
    return next(new ErrorHandler("Search failed", 500));
  }
};

exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Query must be at least 2 characters long",
      });
    }

    const searchRegex = new RegExp(q.trim(), "i");

    const titleSuggestions = await Blog.distinct("title", {
      title: searchRegex,
      isPublished: true,
    });

    const categorySuggestions = await Blog.distinct("category", {
      category: searchRegex,
      isPublished: true,
    });

    const suggestions = [
      ...titleSuggestions.slice(0, 6),
      ...categorySuggestions.slice(0, 4),
    ].slice(0, 10);

    res.status(200).json({
      success: true,
      suggestions,
      query: q.trim(),
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to get suggestions", 500));
  }
};

exports.getPopularSearches = async (req, res, next) => {
  try {
    const popularCategories = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { category: "$_id", count: 1, _id: 0 } },
    ]);

    const popularTitles = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title");

    const popularSearches = [
      ...popularCategories.map((item) => item.category),
      ...popularTitles.map((item) => item.title),
    ];

    res.status(200).json({
      success: true,
      popularSearches: popularSearches.slice(0, 8),
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to get popular searches", 500));
  }
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
  if (blog.user)
    await blog.populate({
      path: "user",
      select: "name",
    });
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
