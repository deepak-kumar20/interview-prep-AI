import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { getAvatarUrl } from "../../utils/constants";
import moment from "moment";
import {
  LuUsers,
  LuTrendingUp,
  LuClipboardCheck,
  LuPlus,
} from "react-icons/lu";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assessmentsRes, analyticsRes] = await Promise.all([
        axiosInstance.get(API_PATHS.TEACHER.GET_STUDENTS),
        axiosInstance.get(API_PATHS.TEACHER.GET_ANALYTICS),
      ]);
      setAssessments(assessmentsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-8 pb-4 px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor student assessments and performance
          </p>
        </div>

        {/* Quick Action Card */}
        <div
          onClick={() => navigate("/create-assessment")}
          className="bg-[#1e3a5f] rounded-xl shadow-lg p-6 mb-8 cursor-pointer hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Create Custom Assessment
              </h2>
              <p className="text-white/90">
                Design personalized assessments for your students
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
              <LuPlus className="text-4xl" />
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <LuUsers className="text-2xl text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Assessments</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {analytics.totalAssessments}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <LuTrendingUp className="text-2xl text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {analytics.averageScore}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#1e3a5f]/10 p-3 rounded-full">
                  <LuClipboardCheck className="text-2xl text-[#1e3a5f]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {
                      assessments.filter(
                        (a) => a.evaluation?.status === "pending_review"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Assessments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Student Assessments
            </h2>
          </div>

          {assessments.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No assessments found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assessments.map((assessment) => (
                    <tr
                      key={assessment._id}
                      onClick={() =>
                        navigate(`/teacher/assessment/${assessment._id}`)
                      }
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full bg-[#1e3a5f]"
                              src={getAvatarUrl(assessment.student?.profileImageUrl, assessment.student?.name)}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {assessment.student?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {assessment.student?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assessment.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assessment.experience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getScoreBg(
                            assessment.evaluation?.overallScore || 0
                          )} ${getScoreColor(
                            assessment.evaluation?.overallScore || 0
                          )}`}
                        >
                          {assessment.evaluation?.overallScore || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {moment(assessment.completedAt).format("MMM DD, YYYY")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            assessment.evaluation?.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : assessment.evaluation?.status === "reviewed"
                              ? "bg-blue-100 text-blue-800"
                              : assessment.evaluation?.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {assessment.evaluation?.status === "approved"
                            ? "Approved"
                            : assessment.evaluation?.status === "reviewed"
                            ? "Reviewed"
                            : assessment.evaluation?.status === "rejected"
                            ? "Rejected"
                            : "Pending Review"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
