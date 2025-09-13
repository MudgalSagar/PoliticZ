const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Function to calculate trending topics
const getTrendingTopics = async () => {
  try {
    // Fetch posts and only retrieve the content field
    const posts = await Post.find({}, "content");

    const wordCount = {};

    posts.forEach((post) => {
      if (!post.content) return; // Skip if content is empty

      const words = post.content.split(/\s+/); // Split content into words

      words.forEach((word) => {
        word = word.trim().toLowerCase(); // Normalize case
        if (word.startsWith("#")) {
          word = word.replace(/[^\w#]/g, ""); // Remove special characters
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });
    });

    // Convert object to array and sort by frequency
    const trending = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1]) // Sort in descending order
      .slice(0, 5) // Get top 5 trending hashtags
      .map(([tag, posts]) => ({ tag, posts }));

    return trending;
  } catch (error) {
    console.error("❌ Error calculating trending topics:", error);
    return [];
  }
};

// GET /api/trending
router.get("/", async (req, res) => {
  try {
    const trendingTopics = await getTrendingTopics();
    res.json(trendingTopics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trending topics" });
  }
});

module.exports = router;
