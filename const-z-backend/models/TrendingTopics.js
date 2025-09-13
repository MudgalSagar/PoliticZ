const mongoose = require("mongoose");

const TrendingTopicSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    unique: true,
  },
  postCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("TrendingTopic", TrendingTopicSchema);
