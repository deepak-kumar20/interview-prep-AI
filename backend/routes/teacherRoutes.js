const express = require("express");
const {
  getAllStudentAssessments,
  getAssessmentDetails,
  getStudentAllAssessments,
  addTeacherReview,
  getAnalytics,
} = require("../controllers/teacherController");
const { protect } = require("../middlewares/authMiddleware");
const { isTeacherOrAdmin } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Teacher/Recruiter routes
router.get("/students", protect, isTeacherOrAdmin, getAllStudentAssessments);
router.get("/assessment/:id", protect, isTeacherOrAdmin, getAssessmentDetails);
router.get(
  "/student/:studentId",
  protect,
  isTeacherOrAdmin,
  getStudentAllAssessments
);
router.post("/review", protect, isTeacherOrAdmin, addTeacherReview);
router.get("/analytics", protect, isTeacherOrAdmin, getAnalytics);

module.exports = router;
