const express = require("express");
const router = express.Router();
const { catchAsyncErrors } = require("../utils/catchAsyncErrors.js");
const {
  login,
  logout,
  signup,
  getUserBlogs,
  getUserComments,
  updateProfile,
  deleteUserBlog,
  deleteUserComment,
} = require("../controllers/userController.js");
const { auth } = require("../middlewares/auth.js");

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.get("/my-blogs", auth, catchAsyncErrors(getUserBlogs));
router.get("/my-comments", auth, catchAsyncErrors(getUserComments));
router.put("/update-profile", auth, catchAsyncErrors(updateProfile));
router.delete("/delete-blog", auth, catchAsyncErrors(deleteUserBlog));
router.delete("/delete-comment/:id", auth, catchAsyncErrors(deleteUserComment));

module.exports = router;
