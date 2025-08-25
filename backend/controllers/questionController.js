// controllers/questionController.js
const Question = require("../models/Question");
const Session = require("../models/Session");

// @desc    Add additional questions to an existing session
// @route   POST /api/questions/add
// @access  Private
const addQuestionsToSession = async (req, res) => {
  try {
    const { questions, sessionId } = req.body;
    if (!questions || !sessionId || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found!" });
    }

    const createdQuestions = await Question.create(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
      }))
    );

    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();

    return res.status(201).json(createdQuestions);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// @desc    Pin or unpin a question
// @route   POST /api/questions/:id/pin
// @access  Private
const togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found!" });
    }
    question.isPinned = !question.isPinned;
    await question.save();
    return res.status(200).json(question);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error in togglePinQues api", error: error.message });
  }
};

// @desc    Update a note for a question
// @route   POST /api/questions/:id/note
// @access  Private
const updateQuestionNote = async (req, res) => {
  try {
    const { note } = req.body
    const question = await Question.findById(req.params.id)
    if (!question) {
      return res.status(404).json({ message: "Question not found" })
      
    }
    //add note
    question.note = note || ""
    question.save()

    return res.status(200).json({success:true,question})
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Server Error in updateQuestionNote api",
        error: error.message,
      });
  }
};

module.exports = {
  togglePinQuestion,
  updateQuestionNote,
  addQuestionsToSession,
};
