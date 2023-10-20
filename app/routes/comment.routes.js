module.exports = (app) => {
  const comment = require("../controller/comment.controller");
  var router = require("express").Router();
  const { verifyToken } = require("../middleware/auth.middleware");

  router.get("/:blogId/comment", verifyToken, comment.findAllCommentsByBlogId);
  router.get("/:blogId/comment/:commentId", verifyToken, comment.findCommentbyCommentId);

  router.post("/:blogId/comment/", verifyToken, comment.createCommentInBlog);
  router.put("/:blogId/comment/:commentId", verifyToken, comment.updateCommentInBlogbyCommentId);
  
  router.delete(
    "/:blogId/comment/:commentId",
    verifyToken,
    comment.deleteCommentInBlogByCommentId
  );

  app.use("/api/blog", router);
};
