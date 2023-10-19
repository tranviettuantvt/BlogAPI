const Blog = require("../model/blog.model");

exports.findAllBlog = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate("author")
      .populate("comments")
      .exec();
    res.status(200).json(blogs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.findBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author")
      .populate("comments")
      .exec();
    if (!blog) {
      res.status(404).send({
        message: `Cannot Find Blog with id=${id}`,
      });
    } else res.status(200).json(blog);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createBlog = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId;
  const blog = new Blog({
    title,
    content,
    author: userId,
  });

  blog
    .save(blog)
    .then((data) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        error: err.message || "Some error occurred while creating the Blog.",
      });
    });
};

exports.updateBlogById = async (req, res) => {
  try {
    const newBlog = await Blog.findByIdAndUpdate(req.params.id, req.body);
    if (!newBlog) {
      res.status(404).send({
        message: `Cannot update Blog with id=${req.params.id}`,
      });
    } else res.send({ message: "Blog was updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndRemove(req.params.id, {
      useFindAndModify: false,
    });
    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
    } else {
      res.status(200).json("Delete Blog successfully");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
