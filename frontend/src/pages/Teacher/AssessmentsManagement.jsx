import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import moment from "moment";
import {
  LuPlus,
  LuCalendar,
  LuClock,
  LuUsers,
  LuTrash2,
  LuTarget,
  LuBriefcase,
  LuCopy,
  LuCheck,
  LuPencil,
  LuEye,
} from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import Modal from "../../components/Modal";
import DeleteAlertContent from "../../components/DeleteAlertContent";

const AssessmentsManagement = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/teacher/assessments/custom"
      );
      setAssessments(response.data.assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      toast.error("Failed to load assessments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `/api/teacher/assessment/${selectedAssessment._id}`
      );
      toast.success("Assessment deleted successfully");
      setAssessments((prev) =>
        prev.filter((a) => a._id !== selectedAssessment._id)
      );
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast.error("Failed to delete assessment");
    }
  };

  const copyAccessCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Access code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-100 text-blue-700", label: "Scheduled" },
      "in-progress": {
        color: "bg-yellow-100 text-yellow-700",
        label: "In Progress",
      },
      completed: { color: "bg-green-100 text-green-700", label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.scheduled;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}
      >
        {config.label}
      </span>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Assessment Management
            </h1>
            <p className="text-gray-600">
              Create and manage custom assessments
            </p>
          </div>
          <button
            onClick={() => navigate("/create-assessment")}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
          >
            <LuPlus className="text-xl" />
            Create Assessment
          </button>
        </div>

        {/* Assessments Grid */}
        {assessments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <LuTarget className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Custom Assessments Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first custom assessment to get started
            </p>
            <button
              onClick={() => navigate("/create-assessment")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              <LuPlus className="text-xl" />
              Create Assessment
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
                <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(assessment.status)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {assessment.title}
                  </h3>

                  {assessment.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {assessment.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <LuBriefcase className="text-indigo-600" />
                      <span className="font-medium">{assessment.role}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">
                        {assessment.experience}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <LuClock className="text-indigo-600" />
                      <span>{assessment.duration / 60} minutes</span>
                      <span className="text-gray-400">•</span>
                      <span>{assessment.questionCount} questions</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <LuCalendar className="text-indigo-600" />
                      <span>
                        {assessment.scheduledAt
                          ? moment(assessment.scheduledAt).format(
                              "MMM DD, YYYY HH:mm"
                            )
                          : "Not scheduled"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <LuUsers className="text-indigo-600" />
                      <span>
                        {assessment.assignedStudents?.length || 0} student(s)
                        assigned
                      </span>
                    </div>

                    {/* Access Code Section */}
                    {assessment.accessCode && (
                      <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-xs text-gray-600 font-semibold mb-1">
                              Access Code:
                            </p>
                            <p className="text-2xl font-bold font-mono tracking-wider text-indigo-600">
                              {assessment.accessCode}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              copyAccessCode(assessment.accessCode)
                            }
                            className="p-2 rounded-lg bg-white hover:bg-indigo-50 transition-colors border border-indigo-200"
                            title="Copy access code"
                          >
                            {copiedCode === assessment.accessCode ? (
                              <LuCheck className="w-5 h-5 text-green-600" />
                            ) : (
                              <LuCopy className="w-5 h-5 text-indigo-600" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Share this code with students to let them join
                        </p>
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

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() =>
                        navigate(`/assessment/${assessment._id}/results`)
                      }
                      className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-100 transition-colors"
                    >
                      <LuEye />
                      View Results
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/edit-assessment/${assessment._id}`)
                        }
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition-colors"
                      >
                        <LuPencil />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAssessment(assessment);
                          setDeleteModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                      >
                        <LuTrash2 />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
          <DeleteAlertContent
            title="Delete Assessment"
            message={`Are you sure you want to delete "${selectedAssessment?.title}"? This action cannot be undone.`}
            onCancel={() => setDeleteModal(false)}
            onConfirm={handleDelete}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AssessmentsManagement;
