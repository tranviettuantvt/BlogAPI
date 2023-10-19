const Comment = require("../model/comment.model");
const Blog = require("../model/blog.model");

exports.findAllCommentsByBlogId = async (req, res) => {
  const { blogId } = req.params;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).send({
        message: `Cannot Find comments with blogId=${blogId}`,
      });
    } else res.status(200).json(blog.comments);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createCommentInBlog = async (req, res) => {
  const { blogId } = req.params;
  const { content } = req.body;
  const userId = req.userId;

  try {
    const newComment = new Comment({
      content,
      blog: blogId,
      author: userId,
    });

    await newComment.save();
    console.log(blogId);

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json("Blog not found");
    }
    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCommentInBlogbyCommentId = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.userId;
  const {content}=req.body
  try {
    const newComment = await Comment.findById(commentId);
    if (!newComment) {
      return res.status(404).send({
        message: `Cannot found Comment with id=${commentId}`,
      });
    }

    if (newComment.author.toString() !== userId) {
      return res.status(403).json({
        message: "Access denied. You can only update your own comments.",
      });
    }

    newComment.content = content;

    await newComment.save();

    res.send({ message: "Comment was updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCommentInBlogByCommentId = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.userId;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== userId) {
      return res
        .status(403)
        .json({
          message: "Access denied. You can only delete your own comments.",
        });
    }

    const blogId = comment.blog;
    const blog = await Blog.findById(blogId);
    if (blog) {
      blog.comments.pull(commentId);
      await blog.save();
    }

    await Comment.findByIdAndRemove(commentId);

    res.status(204).send("Delete Successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findCommentbyCommentId = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId)
      .populate("author")
      .populate("blog")
      .exec();
    if (!comment) {
      res.status(404).send({
        message: `Cannot Find Comment with id=${commentId}`,
      });
    } else res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ error: e.message });
  }
};
