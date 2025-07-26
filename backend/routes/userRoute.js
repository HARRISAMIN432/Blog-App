const express = require("express");
const router = express.Router();
const { catchAsyncErrors } = require("../utils/catchAsyncErrors.js");
const { login, logout, signup } = require("../controllers/userController.js");

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);

module.exports = router;
