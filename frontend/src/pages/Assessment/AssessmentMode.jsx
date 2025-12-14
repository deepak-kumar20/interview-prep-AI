import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { LuPlay, LuClock, LuTrophy, LuClipboardList } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import moment from "moment";

const AssessmentMode = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyResults();
  }, []);

  const fetchMyResults = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ASSESSMENT.MY_RESULTS);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-blue-100";
    if (score >= 40) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-8 pb-4 px-8">
        <div className="mb-8 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 bg-[#1e3a5f] rounded-xl shadow-lg flex items-center justify-center">
              <LuClipboardList className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a5f]">
                Assessment Mode
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                Take AI-conducted interviews and track your progress
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/assessment/start")}
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg hover:bg-[#152d4a] transition-colors flex-shrink-0"
          >
            <LuPlay className="text-xl" />
            Start New Assessment
          </button>
        </div>

        {/* Results Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            My Assessment Results
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">Loading results...</div>
            </div>
          ) : results.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <LuTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No assessments yet
              </h3>
              <p className="text-gray-500 mb-6">
                Take your first assessment to get started
              </p>
              <button
                onClick={() => navigate("/assessment/start")}
                className="bg-[#1e3a5f] text-white px-6 py-2 rounded-lg hover:bg-[#152d4a]"
              >
                Start Assessment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((assessment) => (
                <div
                  key={assessment._id}
                  onClick={() =>
                    navigate(`/assessment/result/${assessment._id}`)
                  }
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-shadow border-2 border-gray-100 hover:border-[#1e3a5f]/40"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {assessment.role}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {assessment.experience} Level
                      </p>
                    </div>
                    <div
                      className={`${getScoreBg(
                        assessment.evaluation?.overallScore || 0
                      )} px-3 py-1 rounded-full`}
                    >
                      <span
                        className={`text-lg font-bold ${getScoreColor(
                          assessment.evaluation?.overallScore || 0
                        )}`}
                      >
                        {assessment.evaluation?.overallScore || 0}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <LuClock className="text-gray-400" />
                      <span>
                        {Math.floor(assessment.duration / 60)} min{" "}
                        {assessment.duration % 60} sec
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {moment(assessment.completedAt).format(
                        "MMM DD, YYYY · hh:mm A"
                      )}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="text-gray-500">Technical</p>
                        <p className="font-semibold text-gray-800">
                          {assessment.evaluation?.technicalScore || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Communication</p>
                        <p className="font-semibold text-gray-800">
                          {assessment.evaluation?.communicationScore || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Problem Solving</p>
                        <p className="font-semibold text-gray-800">
                          {assessment.evaluation?.problemSolvingScore || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssessmentMode;
