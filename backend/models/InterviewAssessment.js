const mongoose = require("mongoose");

const interviewAssessmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
      enum: ["Junior", "Mid", "Senior"],
    },
    topicsToFocus: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed", "cancelled"],
      default: "scheduled",
    },
    scheduledAt: {
      type: Date,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AssessmentQuestion",
      },
    ],
    evaluation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evaluation",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "InterviewAssessment",
  interviewAssessmentSchema
);
