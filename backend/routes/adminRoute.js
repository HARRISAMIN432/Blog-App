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
const { auth } = require("../middlewares/auth");
const { authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.post("/login", catchAsyncErrors(adminLogin));
router.get(
  "/comments",
  auth,
  authorizeRoles("admin"),
  catchAsyncErrors(getAllComments)
);
router.get(
  "/blogs",
  auth,
  authorizeRoles("admin"),
  catchAsyncErrors(getAllBlogs)
);
router.post(
  "/delete-comment",
  auth,
  authorizeRoles("admin"),
  catchAsyncErrors(deleteCommentById)
);
router.post(
  "/approve-comment",
  auth,
  authorizeRoles("admin"),
  catchAsyncErrors(approveCommentByID)
);
router.get(
  "/dashboard",
  auth,
  authorizeRoles("admin"),
  catchAsyncErrors(getDashboard)
);
router.get(
  "/subscribers",
  auth,
  authorizeRoles("admin"),
  catchAsyncErrors(getSubscribers)
);

module.exports = router;
