const InterviewAssessment = require("../models/InterviewAssessment");
const Evaluation = require("../models/Evaluation");
const User = require("../models/User");

// @desc    Get all student assessments
// @route   GET /api/teacher/students
// @access  Private (Teacher/Admin)
const getAllStudentAssessments = async (req, res) => {
  try {
    const { status, role, experience, minScore, maxScore, startDate, endDate } =
      req.query;

    // Build filter
    let filter = { status: "completed" };

    if (status) filter.status = status;
    if (role) filter.role = role;
    if (experience) filter.experience = experience;
    if (startDate || endDate) {
      filter.completedAt = {};
      if (startDate) filter.completedAt.$gte = new Date(startDate);
      if (endDate) filter.completedAt.$lte = new Date(endDate);
    }

    let assessments = await InterviewAssessment.find(filter)
      .populate("student", "name email profileImageUrl")
      .populate("evaluation")
      .sort({ completedAt: -1 });

    // Filter by score if provided
    if (minScore || maxScore) {
      assessments = assessments.filter((assessment) => {
        if (!assessment.evaluation) return false;
        const score = assessment.evaluation.overallScore;
        if (minScore && score < parseInt(minScore)) return false;
        if (maxScore && score > parseInt(maxScore)) return false;
        return true;
      });
    }

    res.json(assessments);
  } catch (error) {
    console.error("Error fetching student assessments:", error);
    res.status(500).json({
      message: "Failed to fetch student assessments",
      error: error.message,
    });
  }
};

// @desc    Get specific student's assessment details
// @route   GET /api/teacher/assessment/:id
// @access  Private (Teacher/Admin)
const getAssessmentDetails = async (req, res) => {
  try {
    const assessment = await InterviewAssessment.findById(req.params.id)
      .populate("student", "name email profileImageUrl")
      .populate("questions")
      .populate("evaluation");

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.json(assessment);
  } catch (error) {
    console.error("Error fetching assessment details:", error);
    res.status(500).json({
      message: "Failed to fetch assessment details",
      error: error.message,
    });
  }
};

// @desc    Get specific student's all assessments
// @route   GET /api/teacher/student/:studentId
// @access  Private (Teacher/Admin)
const getStudentAllAssessments = async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId).select(
      "-password"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const assessments = await InterviewAssessment.find({
      student: req.params.studentId,
      status: "completed",
    })
      .populate("evaluation")
      .sort({ completedAt: -1 });

    res.json({
      student,
      assessments,
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({
      message: "Failed to fetch student data",
      error: error.message,
    });
  }
};

// @desc    Add teacher review/notes to assessment
// @route   POST /api/teacher/review
// @access  Private (Teacher/Admin)
const addTeacherReview = async (req, res) => {
  try {
    const { assessmentId, teacherNotes, teacherRating, status } = req.body;

    if (!assessmentId) {
      return res.status(400).json({ message: "Assessment ID required" });
    }

    const assessment = await InterviewAssessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const evaluation = await Evaluation.findById(assessment.evaluation);
    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    // Update evaluation with teacher feedback
    if (teacherNotes) evaluation.teacherNotes = teacherNotes;
    if (teacherRating) evaluation.teacherRating = teacherRating;
    if (status) evaluation.status = status;
    evaluation.reviewedBy = req.user.id;
    evaluation.reviewedAt = new Date();

    await evaluation.save();

    res.json({
      message: "Review added successfully",
      evaluation,
    });
  } catch (error) {
    console.error("Error adding teacher review:", error);
    res.status(500).json({
      message: "Failed to add review",
      error: error.message,
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/teacher/analytics
// @access  Private (Teacher/Admin)
const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.completedAt = {};
      if (startDate) dateFilter.completedAt.$gte = new Date(startDate);
      if (endDate) dateFilter.completedAt.$lte = new Date(endDate);
    }

    // Get all completed assessments
    const assessments = await InterviewAssessment.find({
      status: "completed",
      ...dateFilter,
    }).populate("evaluation");

    // Calculate statistics
    const totalAssessments = assessments.length;
    const averageScore =
      assessments.reduce(
        (sum, a) => sum + (a.evaluation?.overallScore || 0),
        0
      ) / totalAssessments || 0;

    // Group by role
    const byRole = assessments.reduce((acc, a) => {
      if (!acc[a.role]) {
        acc[a.role] = { count: 0, totalScore: 0 };
      }
      acc[a.role].count++;
      acc[a.role].totalScore += a.evaluation?.overallScore || 0;
      return acc;
    }, {});

    // Group by experience
    const byExperience = assessments.reduce((acc, a) => {
      if (!acc[a.experience]) {
        acc[a.experience] = { count: 0, totalScore: 0 };
      }
      acc[a.experience].count++;
      acc[a.experience].totalScore += a.evaluation?.overallScore || 0;
      return acc;
    }, {});

    // Score distribution
    const scoreRanges = {
      "0-20": 0,
      "21-40": 0,
      "41-60": 0,
      "61-80": 0,
      "81-100": 0,
    };

    assessments.forEach((a) => {
      const score = a.evaluation?.overallScore || 0;
      if (score <= 20) scoreRanges["0-20"]++;
      else if (score <= 40) scoreRanges["21-40"]++;
      else if (score <= 60) scoreRanges["41-60"]++;
      else if (score <= 80) scoreRanges["61-80"]++;
      else scoreRanges["81-100"]++;
    });

    res.json({
      totalAssessments,
      averageScore: Math.round(averageScore * 100) / 100,
      byRole: Object.entries(byRole).map(([role, data]) => ({
        role,
        count: data.count,
        averageScore: Math.round((data.totalScore / data.count) * 100) / 100,
      })),
      byExperience: Object.entries(byExperience).map(([experience, data]) => ({
        experience,
        count: data.count,
        averageScore: Math.round((data.totalScore / data.count) * 100) / 100,
      })),
      scoreDistribution: scoreRanges,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getAllStudentAssessments,
  getAssessmentDetails,
  getStudentAllAssessments,
  addTeacherReview,
  getAnalytics,
};
