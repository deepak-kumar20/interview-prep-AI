import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { getAvatarUrl } from "../../utils/constants";
import moment from "moment";
import {
  LuArrowLeft,
  LuUsers,
  LuTrophy,
  LuClock,
  LuTarget,
  LuEye,
} from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

const AssessmentResults = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [assessmentId]);

  const fetchResults = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/teacher/assessment/${assessmentId}/results`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-blue-600 bg-blue-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <SpinnerLoader />
        </div>
      </DashboardLayout>
    );
  }

  if (!data || !data.assessment) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-lg text-red-600">Assessment not found</div>
        </div>
      </DashboardLayout>
    );
  }

  const { assessment, results, totalSubmissions } = data;

  // Calculate average score
  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (sum, r) => sum + (r.evaluation?.overallScore || 0),
            0
          ) / results.length
        )
      : 0;

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-8 pb-4 px-8">
        <button
          onClick={() => navigate("/assessments-management")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <LuArrowLeft />
          Back to Assessments
        </button>

        {/* Assessment Header */}
        <div className="bg-[#1e3a5f] rounded-xl shadow-lg p-8 mb-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{assessment.title}</h1>
          <p className="text-white/80 mb-4">{assessment.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <LuTarget />
              <span>
                {assessment.role} - {assessment.experience}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LuClock />
              <span>{assessment.duration / 60} minutes</span>
            </div>
            {assessment.accessCode && (
              <div className="flex items-center gap-2">
                <span className="font-mono bg-white/20 px-3 py-1 rounded">
                  Code: {assessment.accessCode}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <LuUsers className="text-2xl text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalSubmissions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <LuTrophy className="text-2xl text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-800">
                  {averageScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#1e3a5f]/10 rounded-lg">
                <LuTarget className="text-2xl text-[#1e3a5f]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-800">
                  {assessment.assignedStudents?.length > 0
                    ? Math.round(
                        (totalSubmissions /
                          assessment.assignedStudents.length) *
                          100
                      )
                    : 100}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Results */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Student Submissions
            </h2>
          </div>

          {results.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No submissions yet
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
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Taken
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full bg-[#1e3a5f]"
                            src={getAvatarUrl(result.student?.profileImageUrl, result.student?.name)}
                            alt=""
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {result.student?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {result.student?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getScoreColor(
                            result.evaluation?.overallScore || 0
                          )}`}
                        >
                          {result.evaluation?.overallScore || 0}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {moment(result.completedAt).format("MMM DD, YYYY")}
                        <br />
                        <span className="text-xs">
                          {moment(result.completedAt).format("hh:mm A")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.evaluation?.totalTimeSpent
                          ? `${Math.floor(
                              result.evaluation.totalTimeSpent / 60
                            )}m ${result.evaluation.totalTimeSpent % 60}s`
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() =>
                            navigate(`/teacher/assessment/${result._id}`)
                          }
                          className="inline-flex items-center gap-2 text-[#1e3a5f] hover:text-[#152d4a] font-medium"
                        >
                          <LuEye />
                          View Details
                        </button>
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

export default AssessmentResults;
