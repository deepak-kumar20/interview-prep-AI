// Get base URL from environment variable
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://interview-prep-ai-oikk.onrender.com";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Signup
    LOGIN: "/api/auth/login", // Authenticate user & return JWT token
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details
    UPDATE_PROFILE: "/api/auth/profile", // Update user profile
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image", // Upload profile picture
  },

  AI: {
    GENERATE_QUESTIONS: "/api/ai/generate-questions", // Generate interview questions and answers using Gemini
    GENERATE_EXPLANATION: "/api/ai/generate-explanation", // Generate concept explanation using Gemini
    GENERATE_ROADMAP: "/api/ai/generate-roadmap", // Generate learning roadmap
  },

  SESSION: {
    CREATE: "/api/sessions/create", // Create a new interview session with questions
    GET_ALL: "/api/sessions/my-sessions", // Get all user sessions
    GET_ONE: (id) => `/api/sessions/${id}`, // Get session details with questions
    DELETE: (id) => `/api/sessions/${id}`, // Delete a session
  },

  QUESTION: {
    ADD_TO_SESSION: "/api/questions/add", // Add more questions to a session
    PIN: (id) => `/api/questions/${id}/pin`, // Pin or Unpin a question
    UPDATE_NOTE: (id) => `/api/questions/${id}/note`, // Update/Add a note to a question
  },

  ASSESSMENT: {
    START: "/api/assessments/start", // Start new interview assessment
    SUBMIT_ANSWER: "/api/assessments/submit-answer", // Submit answer during interview
    COMPLETE: "/api/assessments/complete", // Complete assessment and get evaluation
    MY_RESULTS: "/api/assessments/my-results", // Get student's results
    GET_ONE: (id) => `/api/assessments/${id}`, // Get specific assessment
  },

  TEACHER: {
    GET_STUDENTS: "/api/teacher/students", // Get all student assessments
    GET_ASSESSMENT: (id) => `/api/teacher/assessment/${id}`, // Get assessment details
    GET_STUDENT: (id) => `/api/teacher/student/${id}`, // Get student's all assessments
    ADD_REVIEW: "/api/teacher/review", // Add teacher review
    GET_ANALYTICS: "/api/teacher/analytics", // Get analytics data
    CREATE_ASSESSMENT: "/api/teacher/assessment/create", // Create custom assessment
    GET_CUSTOM_ASSESSMENTS: "/api/teacher/assessments/custom", // Get custom assessments
    UPDATE_ASSESSMENT: (id) => `/api/teacher/assessment/${id}`, // Update assessment
    DELETE_ASSESSMENT: (id) => `/api/teacher/assessment/${id}`, // Delete assessment
  },
};
