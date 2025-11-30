const mongoose = require("mongoose");

const assessmentQuestionSchema = new mongoose.Schema(
  {
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewAssessment",
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    studentAnswer: {
      type: String,
      default: "",
    },
    expectedAnswer: {
      type: String, // AI-generated ideal answer
    },
    aiFollowUp: {
      type: String, // Follow-up question if needed
    },
    followUpAnswer: {
      type: String,
    },
    timeSpent: {
      type: Number, // seconds
      default: 0,
    },
    score: {
      type: Number, // 0-10
      default: 0,
    },
    feedback: {
      type: String, // AI feedback on this specific answer
    },
    order: {
      type: Number, // question sequence
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssessmentQuestion", assessmentQuestionSchema);
