const Session = require("../models/Session");
const Question = require("../models/Question");
const InterviewAssessment = require("../models/InterviewAssessment");
const User = require("../models/User");

// Get platform statistics
const getPlatformStats = async (req, res) => {
  try {
    // Count total questions generated
    const totalQuestions = await Question.countDocuments();

    // Count completed assessments
    const completedAssessments = await InterviewAssessment.countDocuments({
      status: "completed",
    });

    // Calculate success rate (assessments completed vs total)
    const totalAssessments = await InterviewAssessment.countDocuments();
    const successRate =
      totalAssessments > 0
        ? Math.round((completedAssessments / totalAssessments) * 100)
        : 0;

    // Count active users (students and teachers)
    const activeUsers = await User.countDocuments();

    res.json({
      success: true,
      stats: {
        totalQuestions,
        completedAssessments,
        successRate,
        activeUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch platform statistics",
      error: error.message,
    });
  }
};

// Get user-specific statistics (for logged-in users)
const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count user's sessions
    const totalSessions = await Session.countDocuments({ user: userId });

    // Count user's questions
    const userSessions = await Session.find({ user: userId }).select("_id");
    const sessionIds = userSessions.map((s) => s._id);
    const totalQuestions = await Question.countDocuments({
      session: { $in: sessionIds },
    });

    // Count user's assessments
    const totalAssessments = await InterviewAssessment.countDocuments({
      student: userId,
    });

    const completedAssessments = await InterviewAssessment.countDocuments({
      student: userId,
      status: "completed",
    });

    // Get average score from completed assessments with evaluations
    const assessmentsWithScores = await InterviewAssessment.find({
      student: userId,
      status: "completed",
      evaluation: { $exists: true },
    }).populate("evaluation");

    let averageScore = 0;
    if (assessmentsWithScores.length > 0) {
      const totalScore = assessmentsWithScores.reduce((sum, assessment) => {
        return sum + (assessment.evaluation?.overallScore || 0);
      }, 0);
      averageScore = Math.round(totalScore / assessmentsWithScores.length);
    }

    res.json({
      success: true,
      stats: {
        totalSessions,
        totalQuestions,
        totalAssessments,
        completedAssessments,
        averageScore,
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getPlatformStats,
  getUserStats,
};
