import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import moment from "moment";
import {
  LuCalendar,
  LuClock,
  LuTarget,
  LuBriefcase,
  LuPlay,
  LuCircleCheck,
  LuKey,
  LuSearch,
} from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

const AssignedAssessments = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessCode, setAccessCode] = useState("");
  const [joiningWithCode, setJoiningWithCode] = useState(false);

  useEffect(() => {
    fetchAssignedAssessments();
  }, []);

  const fetchAssignedAssessments = async () => {
    try {
      const response = await axiosInstance.get("/api/assessments/assigned");
      setAssessments(response.data.assessments || []);
    } catch (error) {
      console.error("Error fetching assigned assessments:", error);
      toast.error("Failed to load assessments");
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = async (assessmentId) => {
    try {
      // Start the assessment
      const response = await axiosInstance.post(
        "/api/assessments/start-custom",
        {
          assessmentId,
        }
      );

      toast.success("Assessment started!");
      navigate(`/assessment/interview/${response.data.assessment._id}`, {
        state: { assessmentData: response.data },
      });
    } catch (error) {
      console.error("Error starting assessment:", error);
      toast.error(
        error.response?.data?.message || "Failed to start assessment"
      );
    }
  };

  const handleJoinWithCode = async (e) => {
    e.preventDefault();

    if (!accessCode || accessCode.trim().length !== 6) {
      toast.error("Please enter a valid 6-character access code");
      return;
    }

    setJoiningWithCode(true);
    try {
      const response = await axiosInstance.post(
        "/api/assessments/start-custom",
        {
          accessCode: accessCode.toUpperCase(),
        }
      );

      toast.success("Joined assessment successfully!");
      navigate(`/assessment/interview/${response.data.assessment._id}`, {
        state: { assessmentData: response.data },
      });
    } catch (error) {
      console.error("Error joining with code:", error);
      toast.error(
        error.response?.data?.message ||
          "Invalid access code or assessment not available"
      );
    } finally {
      setJoiningWithCode(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        label: "Scheduled",
        icon: LuCalendar,
      },
      "in-progress": {
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        label: "In Progress",
        icon: LuPlay,
      },
      completed: {
        color: "bg-green-100 text-green-700 border-green-200",
        label: "Completed",
        icon: LuCircleCheck,
      },
    };

    const config = statusConfig[status] || statusConfig.scheduled;
    const Icon = config.icon;

    return (
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.color}`}
      >
        <Icon className="text-sm" />
        {config.label}
      </div>
    );
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

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-8 pb-4 px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            My Assigned Assessments
          </h1>
          <p className="text-gray-600">
            Complete assessments assigned by your instructors or join with an
            access code
          </p>
        </div>

        {/* Access Code Entry Section */}
        <div className="bg-[#1e3a5f]/5 rounded-xl shadow-md p-6 mb-8 border border-[#1e3a5f]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <LuKey className="text-2xl text-[#1e3a5f]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Join with Access Code
              </h2>
              <p className="text-sm text-gray-600">
                Enter the 6-character code provided by your instructor
              </p>
            </div>
          </div>

          <form onSubmit={handleJoinWithCode} className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="Enter access code (e.g., A3X9F2)"
                maxLength={6}
                className="w-full px-4 py-3 rounded-lg border border-[#1e3a5f]/30 focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-lg font-mono tracking-wider uppercase placeholder:normal-case placeholder:tracking-normal"
              />
            </div>
            <button
              type="submit"
              disabled={joiningWithCode || accessCode.length !== 6}
              className="bg-[#1e3a5f] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#152d4a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
            >
              {joiningWithCode ? (
                <>
                  <SpinnerLoader />
                  Joining...
                </>
              ) : (
                <>
                  <LuSearch />
                  Join Assessment
                </>
              )}
            </button>
          </form>
        </div>

        {/* Assessments Grid */}
        {assessments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <LuTarget className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Assessments Assigned
            </h3>
            <p className="text-gray-500 mb-6">
              You don't have any assessments assigned yet. Check back later!
            </p>
            <button
              onClick={() => navigate("/assessment")}
              className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#152d4a] transition-all duration-300"
            >
              Try Practice Mode Instead
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <div
                key={assessment._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="h-32 bg-[#1e3a5f] relative p-6">
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(assessment.status)}
                  </div>
                  <h3 className="text-xl font-bold text-white mt-8 line-clamp-2">
                    {assessment.title}
                  </h3>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {assessment.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {assessment.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <LuBriefcase className="text-[#1e3a5f]" />
                      <span className="font-medium">{assessment.role}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">
                        {assessment.experience}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <LuClock className="text-[#1e3a5f]" />
                      <span>{assessment.duration / 60} minutes</span>
                      <span className="text-gray-400">•</span>
                      <span>{assessment.questionCount} questions</span>
                    </div>

                    {assessment.scheduledAt && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <LuCalendar className="text-[#1e3a5f]" />
                        <span>
                          Due:{" "}
                          {moment(assessment.scheduledAt).format(
                            "MMM DD, YYYY"
                          )}
                        </span>
                      </div>
                    )}

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 font-semibold mb-1">
                        Topics:
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {assessment.topicsToFocus}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  {assessment.status === "completed" ? (
                    <button
                      onClick={() =>
                        navigate(`/assessment/result/${assessment._id}`)
                      }
                      className="w-full bg-green-50 text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-100 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <LuCircleCheck />
                      View Results
                    </button>
                  ) : assessment.status === "in-progress" ? (
                    <button
                      onClick={() =>
                        navigate(`/assessment/interview/${assessment._id}`)
                      }
                      className="w-full bg-yellow-50 text-yellow-700 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <LuPlayCircle />
                      Continue Assessment
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartAssessment(assessment._id)}
                      className="w-full bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#152d4a] transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                    >
                      <LuPlayCircle />
                      Start Assessment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AssignedAssessments;
