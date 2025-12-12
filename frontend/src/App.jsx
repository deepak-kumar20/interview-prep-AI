import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardRouter from "./pages/Home/DashboardRouter";
import PracticeMode from "./pages/Home/PracticeMode";
import LandingPage from "./pages/LandingPage";
import { Toaster } from "react-hot-toast";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import UserProvider from "./context/userContext";
import StartAssessment from "./pages/Assessment/StartAssessment";
import RoadmapGenerator from "./pages/Home/RoadmapGenerator";
import AssessmentMode from "./pages/Assessment/AssessmentMode";
import AssignedAssessments from "./pages/Assessment/AssignedAssessments";
import LiveInterview from "./pages/Assessment/LiveInterview";
import AssessmentResult from "./pages/Assessment/AssessmentResult";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import StudentDetail from "./pages/Teacher/StudentDetail";
import AssessmentDetail from "./pages/Teacher/AssessmentDetail";
import StudentsPage from "./pages/Teacher/StudentsPage";
import AnalyticsPage from "./pages/Teacher/AnalyticsPage";
import CreateAssessment from "./pages/Teacher/CreateAssessment";
import AssessmentsManagement from "./pages/Teacher/AssessmentsManagement";
import AssessmentResults from "./pages/Teacher/AssessmentResults";
import Profile from "./pages/Profile/Profile";

const App = () => {
  return (
    <UserProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Main Dashboard - Role-based routing */}
            <Route path="/dashboard" element={<DashboardRouter />} />

            {/* Profile Route */}
            <Route path="/profile" element={<Profile />} />

            {/* Practice Mode Routes (Student) */}
            <Route path="/practice" element={<PracticeMode />} />
            <Route
              path="/interview-prep/:sessionId"
              element={<InterviewPrep />}
            />

            {/* Roadmap Generator Route (Student) */}
            <Route path="/roadmap" element={<RoadmapGenerator />} />

            {/* Assessment Mode Routes (Student) */}
            <Route path="/assessment" element={<AssessmentMode />} />
            <Route
              path="/assessment/assigned"
              element={<AssignedAssessments />}
            />
            <Route path="/assessment/start" element={<StartAssessment />} />
            <Route
              path="/assessment/interview/:assessmentId"
              element={<LiveInterview />}
            />
            <Route
              path="/assessment/result/:assessmentId"
              element={<AssessmentResult />}
            />

            {/* Teacher/Recruiter Routes */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/create-assessment" element={<CreateAssessment />} />
            <Route
              path="/assessments-management"
              element={<AssessmentsManagement />}
            />
            <Route
              path="/assessment/:assessmentId/results"
              element={<AssessmentResults />}
            />
            <Route
              path="/teacher/student/:studentId"
              element={<StudentDetail />}
            />
            <Route
              path="/teacher/assessment/:assessmentId"
              element={<AssessmentDetail />}
            />
          </Routes>
        </BrowserRouter>
        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    </UserProvider>
  );
};

export default App;
