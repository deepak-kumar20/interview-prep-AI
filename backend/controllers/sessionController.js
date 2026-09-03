const Session = require("../models/Session");
const Question = require("../models/Question");

// @desc    Create a new session and linked questions
// @route   POST /api/sessions/create
// @access  Private
exports.createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } =
      req.body;

    const userId = req.user._id; //assuming you have the middleware setting req.user

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      })
    );
    session.questions = questionDocs;
    await session.save();
    res.status(201).json({ success: true, session });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error in createSession api" });
  }
};

// @desc    Get all sessions for the logged-in user
// @route   GET /api/sessions/my-sessions
// @access  Private
exports.getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("questions");
    res.status(200).json(sessions);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error getmySessions api" });
  }
};

// @desc    Get a session by ID with populated questions
// @route   GET /api/sessions/:id
// @access  Private
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: 1 } },
      })
      .exec();

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to view this session" });
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error in getSession by Id api",
    });
  }
};

// @desc    Delete a session and its questions
// @route   DELETE /api/sessions/:id
// @access  Private
exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
                    return res
                      .status(404)
                      .json({ success: false, message: "Session not found" });

        }
        //check if logged in user own this session or not
        if (session.user.toString() !== req.user.id) {
            res.status(401), json({
                success: false,
                message:"Not authorized to delete the session"
            })
        }

        //first delete questions
        await Question.deleteMany({ session: session._id })
        
        //delete the session 
        await session.deleteOne()

        res.status(200).json({
            success: true,
            message:"Session deleted successfully"
        })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error in deleteSession api" });
  }
};
