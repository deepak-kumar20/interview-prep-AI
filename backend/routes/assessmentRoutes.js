const express = require("express");
const {
  startAssessment,
  submitAnswer,
  completeAssessment,
  getMyResults,
  getAssessmentById,
} = require("../controllers/assessmentController");
const { protect } = require("../middlewares/authMiddleware");
const { isStudent } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Student assessment routes
router.post("/start", protect, isStudent, startAssessment);
router.post("/submit-answer", protect, isStudent, submitAnswer);
router.post("/complete", protect, isStudent, completeAssessment);
router.get("/my-results", protect, isStudent, getMyResults);
router.get("/:id", protect, isStudent, getAssessmentById);

module.exports = router;
