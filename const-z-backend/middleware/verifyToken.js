// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔐 Auth Header Received:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log(
      "🚫 Authorization header missing or does not start with Bearer"
    );
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🪪 Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token successfully verified. Decoded payload:", decoded);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;
