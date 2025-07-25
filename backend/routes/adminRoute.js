const express = require("express");
const {
  adminLogin,
  getAllComments,
  deleteCommentById,
  approveCommentByID,
  getDashboard,
  getSubscribers,
} = require("../controllers/adminController");
const { catchAsyncErrors } = require("../utils/catchAsyncErrors");
const { getAllBlogs } = require("../controllers/blogController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/login", catchAsyncErrors(adminLogin));
router.get("/comments", auth, catchAsyncErrors(getAllComments));
router.get("/blogs", auth, catchAsyncErrors(getAllBlogs));
router.post("/delete-comment", auth, catchAsyncErrors(deleteCommentById));
router.post("/approve-comment", auth, catchAsyncErrors(approveCommentByID));
router.get("/dashboard", auth, catchAsyncErrors(getDashboard));
router.get("/subscribers", auth, catchAsyncErrors(getSubscribers));

module.exports = router;
