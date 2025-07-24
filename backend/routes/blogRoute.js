const express = require("express");
const { catchAsyncErrors } = require("../utils/catchAsyncErrors");
const router = express.Router();
const {
  addBlog,
  getAllBlogs,
  deleteBlog,
  getBlogById,
  togglePublish,
} = require("../controllers/blogController");
const upload = require("../middlewares/multer");
const auth = require("../middlewares/auth");

router.post("/add", upload.single("image"), auth, catchAsyncErrors(addBlog));
router.get("/all", catchAsyncErrors(getAllBlogs));
router.get("/:id", catchAsyncErrors(getBlogById));
router.delete("/delete", auth, catchAsyncErrors(deleteBlog));
router.post("/toggle-publish", auth, catchAsyncErrors(togglePublish));

module.exports = router;
