const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema(
  {
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewAssessment",
      required: true,
    },
    overallScore: {
      type: Number, // 0-100
      default: 0,
    },
    technicalScore: {
      type: Number, // 0-100
      default: 0,
    },
    communicationScore: {
      type: Number, // 0-100
      default: 0,
    },
    problemSolvingScore: {
      type: Number, // 0-100
      default: 0,
    },
    strengths: [
      {
        type: String,
      },
    ],
    weaknesses: [
      {
        type: String,
      },
    ],
    recommendations: [
      {
        type: String,
      },
    ],
    aiSummary: {
      type: String, // Overall AI evaluation
    },
    teacherNotes: {
      type: String, // Teacher can add comments
    },
    teacherRating: {
      type: Number, // Teacher can override/adjust
    },
    status: {
      type: String,
      enum: ["pending_review", "reviewed", "approved", "rejected"],
      default: "pending_review",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Teacher who reviewed
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Evaluation", evaluationSchema);
