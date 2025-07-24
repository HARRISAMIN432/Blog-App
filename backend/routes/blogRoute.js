const express = require("express");
const { catchAsyncErrors } = require("../utils/catchAsyncErrors");
const router = express.Router();
const { addBlog } = require("../controllers/blogController");
const upload = require("../middlewares/multer");
const auth = require("../middlewares/auth");

router.post("/add", upload.single("image"), auth, catchAsyncErrors(addBlog));

module.exports = router;
