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
const auth = require("../middlewares/auth");

router.get("/all", getAllBlogs);
router.get("/search", searchBlogs);
router.get("/suggestions", getSearchSuggestions);
router.get("/popular-searches", getPopularSearches);
router.get("/:id", getBlogById);
router.post("/add", auth, upload.single("image"), addBlog);
router.delete("/delete", auth, deleteBlog);
router.post("/toggle-publish", auth, togglePublish);

module.exports = router;
