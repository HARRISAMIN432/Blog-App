const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database.js");
const error = require("./middlewares/error");
const adminRoute = require("./routes/adminRoute");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.use("/api/admin", adminRoute);
app.use("/api/blog", require("./routes/blogRoute"));
app.use(error);
