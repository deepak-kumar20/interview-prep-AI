import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { LuBookOpen, LuClipboardList, LuMap } from "react-icons/lu";

const StudentDashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-8 pb-4 px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Choose how you want to prepare for your interviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Practice Mode Card */}
          <div
            onClick={() => navigate("/practice")}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 group"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <LuBookOpen className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Practice Mode
            </h2>
            <p className="text-gray-600 mb-6">
              Self-paced learning with AI-generated questions. Save sessions,
              add notes, and review anytime.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                Unlimited time to practice
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                Save and review sessions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                Add personal notes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                Pin important questions
              </li>
            </ul>
          </div>

          {/* Assessment Mode Card */}
          <div
            onClick={() => navigate("/assessment")}
            className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-orange-200 hover:border-orange-400 group"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <LuClipboardList className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Assessment Mode
            </h2>
            <p className="text-gray-600 mb-6">
              Take a timed AI interview test. Get scored and evaluated by AI
              with detailed feedback.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span>
                5-10 minute timed interview
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span>
                AI-conducted with follow-ups
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span>
                Instant scoring & evaluation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span>
                Detailed performance report
              </li>
            </ul>
          </div>

          {/* Roadmap Generator Card */}
          <div
            onClick={() => navigate("/roadmap")}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 group"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <LuMap className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Roadmap Generator
            </h2>
            <p className="text-gray-600 mb-6">
              Generate a personalized learning roadmap based on your role and syllabus. Download as PDF.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                AI-powered roadmap
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                Customized to your role
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                Based on syllabus & experience
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                Download as PDF
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
