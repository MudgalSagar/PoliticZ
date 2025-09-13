require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Database Connection
connectDB();

// 2. Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 3. File Upload Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "memes",
    allowed_formats: ["jpg", "png"],
  },
});
const upload = multer({ storage });

// 4. Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // Added methods
  })
);
app.use(express.json({ limit: "10mb" })); // Increased payload limit

// 5. Enhanced Request Logging
app.use((req, res, next) => {
  console.log(
    `📩 ${req.method} ${req.url} ${
      req.headers["authorization"] ? "[AUTH]" : "[PUBLIC]"
    }`
  );
  next();
});

// 6. Routes (Order Matters!)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/trending", require("./routes/trendingRoutes"));
app.use("/api/likes", require("./routes/likesRoutes")); // Likes routes

// 7. Route Health Check (New)
app.get("/health", (req, res) => {
  console.log("✅ /health route was hit");
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ status: "ok" }));
});

// 8. Error Handling
app.use((err, req, res, next) => {
  console.error("🔥 Error:", {
    path: req.path,
    method: req.method,
    error: err.message,
  });
  res.status(500).json({
    error: "Internal Server Error",
    request: `${req.method} ${req.url}`, // Helps debugging
  });
});

// 9. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Available routes:`);
  console.log(`- http://localhost:${PORT}/api/health`);
  console.log(`- http://localhost:${PORT}/api/likes/:postId`);
});
