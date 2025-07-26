const express = require("express");
const { catchAsyncErrors } = require("../utils/catchAsyncErrors.js");
const {
  addComment,
  getBlogComments,
} = require("../controllers/commentsController.js");
const { auth } = require("../middlewares/auth.js");

const router = express.Router();

router.post("/add-comment", auth, catchAsyncErrors(addComment));
router.post("/", catchAsyncErrors(getBlogComments));

module.exports = router;
