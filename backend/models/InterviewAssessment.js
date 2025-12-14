const mongoose = require("mongoose");

const interviewAssessmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
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
      default: "",
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
    questionCount: {
      type: Number,
      default: 10,
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
    // Custom assessment fields
    isCustom: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Shareable assessment code
    accessCode: {
      type: String,
      unique: true,
      sparse: true, // Only custom assessments have codes
    },
    accessType: {
      type: String,
      enum: ["assigned", "open"], // assigned = specific students, open = anyone with code
      default: "assigned",
    },
    // Template fields for custom assessments
    isTemplate: {
      type: Boolean,
      default: false, // true for teacher-created templates, false for student instances
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewAssessment", // Reference to the template this instance was created from
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "InterviewAssessment",
  interviewAssessmentSchema
);
