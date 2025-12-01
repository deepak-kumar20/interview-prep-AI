const express = require("express");
const {
  getAllStudentAssessments,
  getAssessmentDetails,
  getStudentAllAssessments,
  addTeacherReview,
  getAnalytics,
  createCustomAssessment,
  getCustomAssessments,
  updateCustomAssessment,
  deleteCustomAssessment,
  getAssessmentResults,
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

// Custom Assessment routes
router.post(
  "/assessment/create",
  protect,
  isTeacherOrAdmin,
  createCustomAssessment
);
router.get(
  "/assessments/custom",
  protect,
  isTeacherOrAdmin,
  getCustomAssessments
);
router.put(
  "/assessment/:id",
  protect,
  isTeacherOrAdmin,
  updateCustomAssessment
);
router.delete(
  "/assessment/:id",
  protect,
  isTeacherOrAdmin,
  deleteCustomAssessment
);
router.get(
  "/assessment/:id/results",
  protect,
  isTeacherOrAdmin,
  getAssessmentResults
);

module.exports = router;
