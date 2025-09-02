const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/database.js");
const error = require("./middlewares/error");
const serverless = require("serverless-http");

dotenv.config({ quiet: true });

const adminRoute = require("./routes/adminRoute.js");
const commentsRoute = require("./routes/commentsRoute.js");
const blogRoute = require("./routes/blogRoute.js");
const subscribeRoutes = require("./routes/subscribeRoute.js");
const aiRoute = require("./routes/aiRoute");
const userRoute = require("./routes/userRoute.js");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

connectDB();

app.use("/api/admin", adminRoute);

app.use("/api/blog", blogRoute);

app.use("/api/comments", commentsRoute);

app.use("/api/subscribe", subscribeRoutes);

app.use("/api/ai", aiRoute);

app.use("/api/user", userRoute);

app.get("/api/test", (req, res) => {
  res.send("Api is working fine");
});

app.use(error);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}

module.exports = app;
module.exports.handler = serverless(app);
