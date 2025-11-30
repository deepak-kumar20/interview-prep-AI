const InterviewAssessment = require("../models/InterviewAssessment");
const AssessmentQuestion = require("../models/AssessmentQuestion");
const Evaluation = require("../models/Evaluation");
const { GoogleGenAI } = require("@google/genai");
const {
  assessmentInterviewPrompt,
  assessmentEvaluationPrompt,
} = require("../utils/prompts");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Start a new interview assessment
// @route   POST /api/assessments/start
// @access  Private (Student)
const startAssessment = async (req, res) => {
  try {
    const { role, experience, topicsToFocus } = req.body;

    if (!role || !experience || !topicsToFocus) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate experience level
    if (!["Junior", "Mid", "Senior"].includes(experience)) {
      return res.status(400).json({ message: "Invalid experience level" });
    }

    // Create new assessment
    const assessment = await InterviewAssessment.create({
      student: req.user.id,
      role,
      experience,
      topicsToFocus,
      status: "in-progress",
      startedAt: new Date(),
    });

    // Generate first question using AI
    const prompt = assessmentInterviewPrompt(
      role,
      experience,
      topicsToFocus,
      1,
      8
    );

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    let rawText =
      response.text ??
      response.candidates?.[0]?.content?.parts?.[0]?.text ??
      "";

    const cleanedText = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(cleanedText);

    // Create first question in database
    const question = await AssessmentQuestion.create({
      assessment: assessment._id,
      questionText: data.question,
      expectedAnswer: data.expectedAnswer || "",
      order: 1,
    });

    // Update assessment with question
    assessment.questions.push(question._id);
    await assessment.save();

    res.status(201).json({
      assessment: {
        _id: assessment._id,
        role: assessment.role,
        experience: assessment.experience,
        topicsToFocus: assessment.topicsToFocus,
        status: assessment.status,
        startedAt: assessment.startedAt,
      },
      currentQuestion: {
        _id: question._id,
        questionText: question.questionText,
        order: question.order,
      },
      totalQuestions: 8,
    });
  } catch (error) {
    console.error("Error starting assessment:", error);
    res.status(500).json({
      message: "Failed to start assessment",
      error: error.message,
    });
  }
};

// @desc    Submit answer and get next question
// @route   POST /api/assessments/submit-answer
// @access  Private (Student)
const submitAnswer = async (req, res) => {
  try {
    const { assessmentId, questionId, answer, timeSpent } = req.body;

    if (!assessmentId || !questionId || !answer) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find assessment and verify ownership
    const assessment = await InterviewAssessment.findOne({
      _id: assessmentId,
      student: req.user.id,
    }).populate("questions");

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    if (assessment.status !== "in-progress") {
      return res.status(400).json({ message: "Assessment is not in progress" });
    }

    // Update current question with answer
    const question = await AssessmentQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.studentAnswer = answer;
    question.timeSpent = timeSpent || 0;
    await question.save();

    const currentQuestionNumber = question.order;
    const totalQuestions = 8;

    // Check if this is the last question
    if (currentQuestionNumber >= totalQuestions) {
      return res.json({
        completed: true,
        message: "Assessment completed. Generating evaluation...",
      });
    }

    // Generate next question using AI with context
    const prompt = assessmentInterviewPrompt(
      assessment.role,
      assessment.experience,
      assessment.topicsToFocus,
      currentQuestionNumber + 1,
      totalQuestions,
      question.questionText,
      answer
    );

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    let rawText =
      response.text ??
      response.candidates?.[0]?.content?.parts?.[0]?.text ??
      "";

    const cleanedText = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(cleanedText);

    // Create next question
    const nextQuestion = await AssessmentQuestion.create({
      assessment: assessment._id,
      questionText: data.question,
      expectedAnswer: data.expectedAnswer || "",
      aiFollowUp: data.isFollowUp ? question.questionText : null,
      order: currentQuestionNumber + 1,
    });

    // Update assessment
    assessment.questions.push(nextQuestion._id);
    await assessment.save();

    res.json({
      completed: false,
      currentQuestion: {
        _id: nextQuestion._id,
        questionText: nextQuestion.questionText,
        order: nextQuestion.order,
      },
      progress: {
        current: currentQuestionNumber + 1,
        total: totalQuestions,
      },
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({
      message: "Failed to submit answer",
      error: error.message,
    });
  }
};

// @desc    Complete assessment and generate evaluation
// @route   POST /api/assessments/complete
// @access  Private (Student)
const completeAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.body;

    if (!assessmentId) {
      return res.status(400).json({ message: "Assessment ID required" });
    }

    // Find assessment with all questions
    const assessment = await InterviewAssessment.findOne({
      _id: assessmentId,
      student: req.user.id,
    }).populate("questions");

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    if (assessment.status !== "in-progress") {
      return res.status(400).json({ message: "Assessment is not in progress" });
    }

    // Calculate duration
    const duration = Math.floor(
      (new Date() - new Date(assessment.startedAt)) / 1000
    );
    assessment.duration = duration;
    assessment.completedAt = new Date();
    assessment.status = "completed";

    // Prepare data for AI evaluation
    const questionsData = assessment.questions.map((q) => ({
      question: q.questionText,
      studentAnswer: q.studentAnswer,
      expectedAnswer: q.expectedAnswer,
      timeSpent: q.timeSpent,
    }));

    // Generate evaluation using AI
    const evaluationPrompt = assessmentEvaluationPrompt(
      assessment.role,
      assessment.experience,
      questionsData
    );

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: evaluationPrompt,
    });

    let rawText =
      response.text ??
      response.candidates?.[0]?.content?.parts?.[0]?.text ??
      "";

    const cleanedText = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const evaluationData = JSON.parse(cleanedText);

    // Score individual questions
    for (let i = 0; i < assessment.questions.length; i++) {
      const question = assessment.questions[i];
      const questionEval = evaluationData.questions?.[i] || {};

      question.score = questionEval.score || 0;
      question.feedback = questionEval.feedback || "";
      await question.save();
    }

    // Create evaluation document
    const evaluation = await Evaluation.create({
      assessment: assessment._id,
      overallScore: evaluationData.overallScore || 0,
      technicalScore: evaluationData.technicalScore || 0,
      communicationScore: evaluationData.communicationScore || 0,
      problemSolvingScore: evaluationData.problemSolvingScore || 0,
      strengths: evaluationData.strengths || [],
      weaknesses: evaluationData.weaknesses || [],
      recommendations: evaluationData.recommendations || [],
      aiSummary: evaluationData.summary || "",
      status: "pending_review",
    });

    assessment.evaluation = evaluation._id;
    await assessment.save();

    res.json({
      message: "Assessment completed successfully",
      assessment: {
        _id: assessment._id,
        status: assessment.status,
        duration: assessment.duration,
      },
      evaluation: {
        _id: evaluation._id,
        overallScore: evaluation.overallScore,
        technicalScore: evaluation.technicalScore,
        communicationScore: evaluation.communicationScore,
        problemSolvingScore: evaluation.problemSolvingScore,
      },
    });
  } catch (error) {
    console.error("Error completing assessment:", error);
    res.status(500).json({
      message: "Failed to complete assessment",
      error: error.message,
    });
  }
};

// @desc    Get student's assessment results
// @route   GET /api/assessments/my-results
// @access  Private (Student)
const getMyResults = async (req, res) => {
  try {
    const assessments = await InterviewAssessment.find({
      student: req.user.id,
      status: "completed",
    })
      .populate("evaluation")
      .sort({ completedAt: -1 });

    res.json(assessments);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({
      message: "Failed to fetch results",
      error: error.message,
    });
  }
};

// @desc    Get specific assessment details
// @route   GET /api/assessments/:id
// @access  Private (Student)
const getAssessmentById = async (req, res) => {
  try {
    const assessment = await InterviewAssessment.findOne({
      _id: req.params.id,
      student: req.user.id,
    })
      .populate("questions")
      .populate("evaluation");

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.json(assessment);
  } catch (error) {
    console.error("Error fetching assessment:", error);
    res.status(500).json({
      message: "Failed to fetch assessment",
      error: error.message,
    });
  }
};

module.exports = {
  startAssessment,
  submitAnswer,
  completeAssessment,
  getMyResults,
  getAssessmentById,
};
