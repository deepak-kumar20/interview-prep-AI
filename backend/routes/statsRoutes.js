const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getPlatformStats,
  getUserStats,
} = require("../controllers/statsController");

// Public route - get platform statistics
router.get("/platform", getPlatformStats);

// Protected route - get user-specific statistics
router.get("/user", protect, getUserStats);

module.exports = router;
