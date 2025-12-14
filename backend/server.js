require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const statsRoutes = require("./routes/statsRoutes");
const {
  generateInterviewQuestions,
  generateConceptExplanation,
  generateRoadmap,
} = require("./controllers/aiController");

const { protect } = require("./middlewares/authMiddleware");

const app = express();

//Middleware to handle cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB();

//Middleware
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/stats", statsRoutes);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);
app.use("/api/ai/generate-roadmap", protect, generateRoadmap);

//Serve upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

//Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
