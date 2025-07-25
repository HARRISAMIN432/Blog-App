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

exports.searchBlogs = async (req, res, next) => {
  try {
    const {
      q, // search query
      category, // filter by category
      limit = 20, // limit results (default 20)
      page = 1, // pagination
      sort = "-createdAt", // sort order
    } = req.query;

    // Build search query
    let searchQuery = {};

    // Only show published blogs in search results
    searchQuery.isPublished = true;

    // Text search across multiple fields
    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), "i"); // case-insensitive regex
      searchQuery.$or = [
        { title: searchRegex },
        { subtitle: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== "All") {
      searchQuery.category = category;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search query
    const blogs = await Blog.find(searchQuery)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .select(
        "title subtitle description category image createdAt isPublished"
      );

    // Get total count for pagination
    const totalBlogs = await Blog.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalBlogs / parseInt(limit));

    // If no blogs found
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
