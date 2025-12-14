import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import {
  LuTrophy,
  LuClock,
  LuCircleCheck,
  LuCircleX,
  LuArrowLeft,
} from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import moment from "moment";

const AssessmentResult = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessmentResult();
  }, [assessmentId]);

  const fetchAssessmentResult = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.ASSESSMENT.GET_ONE(assessmentId)
      );
      setAssessment(response.data);
    } catch (error) {
      console.error("Error fetching result:", error);
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-gray-600">Loading results...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!assessment || !assessment.evaluation) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-lg text-red-600">Results not found</div>
        </div>
      </DashboardLayout>
    );
  }

  const { evaluation } = assessment;

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-8 pb-4 px-8 max-w-6xl">
        <button
          onClick={() => navigate("/assessment")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <LuArrowLeft />
          Back to Assessments
        </button>

        {/* Overall Score Card */}
        <div className="bg-[#1e3a5f] rounded-lg shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{assessment.role}</h1>
              <p className="text-white/80">
                {assessment.experience} Level Assessment
              </p>
              <p className="text-sm text-white/80 mt-2">
                Completed on{" "}
                {moment(assessment.completedAt).format(
                  "MMM DD, YYYY · hh:mm A"
                )}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center">
                <div>
                  <div
                    className={`text-4xl font-bold ${getScoreColor(
                      evaluation.overallScore
                    )}`}
                  >
                    {evaluation.overallScore}
                  </div>
                  <div className="text-xs text-gray-500">Overall Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-2">Technical Skills</h3>
            <div
              className={`text-3xl font-bold ${getScoreColor(
                evaluation.technicalScore
              )}`}
            >
              {evaluation.technicalScore}
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${evaluation.technicalScore}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-2">Communication</h3>
            <div
              className={`text-3xl font-bold ${getScoreColor(
                evaluation.communicationScore
              )}`}
            >
              {evaluation.communicationScore}
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${evaluation.communicationScore}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-2">Problem Solving</h3>
            <div
              className={`text-3xl font-bold ${getScoreColor(
                evaluation.problemSolvingScore
              )}`}
            >
              {evaluation.problemSolvingScore}
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#1e3a5f] h-2 rounded-full"
                style={{ width: `${evaluation.problemSolvingScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            AI Evaluation Summary
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {evaluation.aiSummary}
          </p>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <LuCircleCheck className="text-2xl text-green-500" />
              <h2 className="text-xl font-bold text-gray-800">Strengths</h2>
            </div>
            <ul className="space-y-2">
              {evaluation.strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-700"
                >
                  <span className="text-green-500 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <LuCircleX className="text-2xl text-red-500" />
              <h2 className="text-xl font-bold text-gray-800">
                Areas to Improve
              </h2>
            </div>
            <ul className="space-y-2">
              {evaluation.weaknesses.map((weakness, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-700"
                >
                  <span className="text-red-500 mt-1">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recommendations
          </h2>
          <ul className="space-y-3">
            {evaluation.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <span className="text-[#1e3a5f] font-bold">{index + 1}.</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Question-wise Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Question-wise Performance
          </h2>
          <div className="space-y-4">
            {assessment.questions.map((question, index) => (
              <div
                key={question._id}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">
                    Q{index + 1}: {question.questionText}
                  </h3>
                  <span
                    className={`${getScoreBg(
                      question.score * 10
                    )} ${getScoreColor(
                      question.score * 10
                    )} px-3 py-1 rounded-full text-sm font-semibold`}
                  >
                    {question.score}/10
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Your Answer:</strong>{" "}
                  {question.studentAnswer || "No answer provided"}
                </p>
                {question.feedback && (
                  <p className="text-sm text-blue-600">
                    <strong>Feedback:</strong> {question.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate("/assessment/start")}
            className="flex-1 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg hover:bg-[#152d4a]"
          >
            Take Another Assessment
          </button>
          <button
            onClick={() => navigate("/practice")}
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200"
          >
            Practice More
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssessmentResult;
