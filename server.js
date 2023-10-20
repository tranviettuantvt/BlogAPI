const express = require("express");
const cors = require("cors");
const app = express();

const mongoose = require("mongoose");
const dbConfig = require("./app/config/db.config");

const initAuthRoute = require("./app/routes/auth.routes");
const initBlogRoute = require("./app/routes/blog.routes");
const initCommentRoute = require("./app/routes/comment.routes");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect server to database
async function connect() {
  try {
    await mongoose.connect(dbConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected success");
  } catch (e) {
    console.error(e);
  }
}
connect();

// Define routes
initAuthRoute(app);
initBlogRoute(app);
initCommentRoute(app);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
