module.exports = (app) => {
  const blogs = require("../controller/blog.controller");
  var router = require("express").Router();
  const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

  router.get("/", [verifyToken, isAdmin], blogs.findAllBlog);
  router.get("/:id", [verifyToken, isAdmin], blogs.findBlogById);
  router.post("/", [verifyToken, isAdmin], blogs.createBlog);
  router.put("/:id", [verifyToken, isAdmin], blogs.updateBlogById);
  router.delete("/:id", [verifyToken, isAdmin], blogs.deleteBlogById);

  app.use("/api/blog", router);
};
