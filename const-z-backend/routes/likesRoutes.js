const express = require("express");
const Post = require("../models/Post");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// POST /api/likes/:postId
router.post("/:postId", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;
    const likeIndex = post.likes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    // Toggle like
    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    // ✅ Re-populate the userId with username after saving
    await post.populate("userId", "username");

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
