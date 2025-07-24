const express = require("express");
const {
  adminLogin,
  getAllComments,
  deleteCommentById,
  approveCommentByID,
  getDashboard,
} = require("../controllers/adminController");
const { catchAsyncErrors } = require("../utils/catchAsyncErrors");
const { getAllBlogs } = require("../controllers/blogController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/login", catchAsyncErrors(adminLogin));
router.get("/comments", auth, catchAsyncErrors(getAllComments));
router.get("/blogs", auth, catchAsyncErrors(getAllBlogs));
router.post("/delete-comment", auth, catchAsyncErrors(deleteCommentById));
router.get("/approve-comment", auth, catchAsyncErrors(approveCommentByID));
router.get("/dashboard", auth, catchAsyncErrors(getDashboard));

module.exports = router;
