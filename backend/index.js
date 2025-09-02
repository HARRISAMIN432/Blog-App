const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/database.js");
const error = require("./middlewares/error");
const serverless = require("serverless-http");

dotenv.config({ quiet: true });

console.log("Starting backend...");

const adminRoute = require("./routes/adminRoute.js");
const commentsRoute = require("./routes/commentsRoute.js");
const blogRoute = require("./routes/blogRoute.js");
const subscribeRoutes = require("./routes/subscribeRoute.js");
const aiRoute = require("./routes/aiRoute");
const userRoute = require("./routes/userRoute.js");

const app = express();
app.use(cors());
app.use(express.json());

console.log("Connecting to database...");
connectDB();
console.log("Database connected");

console.log("Registering routes...");
app.use("/api/admin", adminRoute);
console.log("Admin route loaded");

app.use("/api/blog", blogRoute);
console.log("Blog route loaded");

app.use("/api/comments", commentsRoute);
console.log("Comments route loaded");

app.use("/api/subscribe", subscribeRoutes);
console.log("Subscribe route loaded");

app.use("/api/ai", aiRoute);
console.log("AI route loaded");

app.use("/api/user", userRoute);
console.log("User route loaded");

app.get("/api/test", (req, res) => {
  console.log("/api/test called");
  res.send("Api is working fine");
});

app.use(error);
console.log("Error middleware loaded");

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}

module.exports = app;
module.exports.handler = serverless(app);

console.log("Backend setup complete, ready for Vercel deployment");
