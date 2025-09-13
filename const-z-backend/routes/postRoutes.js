const express = require("express");
const router = express.Router();
const multer = require("multer");
const { cloudinary } = require("../config/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User"); // Import User model
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure this exists

// Set up Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "memes",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// Create a new post with image upload
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id; // Set by authMiddleware

    if (!title || !req.file) {
      return res.status(400).json({ error: "Title and image are required." });
    }

    // Cloudinary URL from multer storage
    const imageUrl = req.file.path;

    // Save post to database
    const newPost = new Post({ title, imageUrl, userId });
    await newPost.save();

    res.status(201).json({ message: "Meme uploaded successfully", newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all posts with user info
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "username");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await post.deleteOne(); // Delete the post from the database
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
});

module.exports = router;
