const express = require("express");
const router  = express.Router();
const { body, validationResult } = require("express-validator");
const Post    = require("../models/Post");
const { protect } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

// GET /api/posts  — paginated public feed
router.get("/", async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;
    const total = await Post.countDocuments();
    const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json({ posts, currentPage: page, totalPages: Math.ceil(total / limit), totalPosts: total, hasMore: skip + posts.length < total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// POST /api/posts  — create post (text or image, at least one)
router.post("/", protect, upload.single("image"), async (req, res) => {
  const { text } = req.body;
  const imageUrl = req.file ? req.file.path : "";
  if (!text?.trim() && !imageUrl)
    return res.status(400).json({ message: "Post needs text or an image" });

  try {
    const post = await Post.create({
      userId: req.user._id, username: req.user.username,
      text: text?.trim() || "", imageUrl,
    });
    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// DELETE /api/posts/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

// PUT /api/posts/:id/like  — toggle like
router.put("/:id/like", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const username = req.user.username;
    if (post.likes.includes(username)) {
      post.likes = post.likes.filter((u) => u !== username);
    } else {
      post.likes.push(username);
    }
    await post.save();
    res.json({ likes: post.likes, likesCount: post.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update like" });
  }
});

// POST /api/posts/:id/comment  — add comment
router.post(
  "/:id/comment",
  protect,
  [body("text").trim().notEmpty().withMessage("Comment text required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      post.comments.push({ userId: req.user._id, username: req.user.username, text: req.body.text });
      await post.save();
      const added = post.comments[post.comments.length - 1];
      res.status(201).json({ comment: added, commentsCount: post.comments.length });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to add comment" });
    }
  }
);

// DELETE /api/posts/:postId/comment/:commentId
router.delete("/:postId/comment/:commentId", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    post.comments.pull({ _id: req.params.commentId });
    await post.save();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

module.exports = router;
