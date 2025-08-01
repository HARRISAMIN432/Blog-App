const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/database.js");
const error = require("./middlewares/error");

dotenv.config({ quiet: true });

const adminRoute = require("./routes/adminRoute.js");
const commentsRoute = require("./routes/commentsRoute.js");
const blogRoute = require("./routes/blogRoute.js");
const subscribeRoutes = require("./routes/subscribeRoute.js");
const aiRoute = require("./routes/aiRoute");
const userRoute = require("./routes/userRoute.js");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.use("/api/admin", adminRoute);
app.use("/api/blog", blogRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/ai", aiRoute);
app.use("/api/user", userRoute);
app.use(error);
