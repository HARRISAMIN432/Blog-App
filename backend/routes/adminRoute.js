const express = require("express");
const { adminLogin } = require("../controllers/adminController");
const { catchAsyncErrors } = require("../utils/catchAsyncErrors");

const router = express.Router();

router.post("/login", catchAsyncErrors(adminLogin));

module.exports = router;
