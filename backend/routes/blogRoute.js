const express = require("express");
const { catchAsyncErrors } = require("../utils/catchAsyncErrors");
const router = express.Router();
const {
  addBlog,
  getAllBlogs,
  deleteBlog,
  getBlogById,
  togglePublish,
  searchBlogs,
  getSearchSuggestions,
  getPopularSearches,
} = require("../controllers/blogController");
const upload = require("../middlewares/multer");
const { auth } = require("../middlewares/auth");

router.get("/all", catchAsyncErrors(getAllBlogs));
router.get("/search", catchAsyncErrors(searchBlogs));
router.get("/suggestions", catchAsyncErrors(getSearchSuggestions));
router.get("/popular-searches", catchAsyncErrors(getPopularSearches));
router.get("/:id", catchAsyncErrors(getBlogById));
router.post("/add", auth, upload.single("image"), catchAsyncErrors(addBlog));
router.delete("/delete", auth, catchAsyncErrors(deleteBlog));
router.post("/toggle-publish", auth, catchAsyncErrors(togglePublish));

module.exports = router;
