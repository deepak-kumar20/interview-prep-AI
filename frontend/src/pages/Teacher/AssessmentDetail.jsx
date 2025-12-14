import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { LuArrowLeft, LuSave } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { getAvatarUrl } from "../../utils/constants";
import moment from "moment";
import toast from "react-hot-toast";

const AssessmentDetail = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teacherNotes, setTeacherNotes] = useState("");
  const [teacherRating, setTeacherRating] = useState("");
  const [status, setStatus] = useState("pending_review");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAssessmentDetail();
  }, [assessmentId]);

  const fetchAssessmentDetail = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TEACHER.GET_ASSESSMENT(assessmentId)
      );
      setAssessment(response.data);
      setTeacherNotes(response.data.evaluation?.teacherNotes || "");
      setTeacherRating(response.data.evaluation?.teacherRating || "");
      setStatus(response.data.evaluation?.status || "pending_review");
    } catch (error) {
      console.error("Error fetching assessment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReview = async () => {
    setSaving(true);
    try {
      await axiosInstance.post(API_PATHS.TEACHER.ADD_REVIEW, {
        assessmentId,
        teacherNotes,
        teacherRating: teacherRating ? parseInt(teacherRating) : null,
        status,
      });
      toast.success("Review saved successfully");
      fetchAssessmentDetail();
    } catch (error) {
      console.error("Error saving review:", error);
      toast.error("Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!assessment) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-lg text-red-600">Assessment not found</div>
        </div>
      </DashboardLayout>
    );
  }

  const { evaluation, student } = assessment;

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-8 pb-4 px-8 max-w-6xl">
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <LuArrowLeft />
          Back to Dashboard
        </button>

        {/* Student & Assessment Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              className="h-16 w-16 rounded-full bg-[#1e3a5f]"
              src={getAvatarUrl(student?.profileImageUrl, student?.name)}
              alt=""
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {student?.name}
              </h1>
              <p className="text-gray-600">{student?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-semibold">{assessment.role}</p>
            </div>
            <div>
              <p className="text-gray-500">Experience</p>
              <p className="font-semibold">{assessment.experience}</p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-semibold">
                {Math.floor(assessment.duration / 60)}:
                {(assessment.duration % 60).toString().padStart(2, "0")}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-semibold">
                {moment(assessment.completedAt).format("MMM DD, YYYY")}
              </p>
            </div>
          </div>
        </div>

        {/* AI Scores */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Overall</p>
            <p className="text-3xl font-bold text-[#1e3a5f]">
              {evaluation?.overallScore || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Technical</p>
            <p className="text-3xl font-bold text-blue-600">
              {evaluation?.technicalScore || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Communication</p>
            <p className="text-3xl font-bold text-green-600">
              {evaluation?.communicationScore || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Problem Solving</p>
            <p className="text-3xl font-bold text-gray-700">
              {evaluation?.problemSolvingScore || 0}
            </p>
          </div>
        </div>

        {/* Questions & Answers */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Interview Transcript
          </h2>
          <div className="space-y-6">
            {assessment.questions.map((q, index) => (
              <div key={q._id} className="border-l-4 border-[#1e3a5f] pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Q{index + 1}: {q.questionText}
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong>Answer:</strong> {q.studentAnswer || "No answer"}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-blue-600">Score: {q.score}/10</span>
                  <span className="text-gray-500">Time: {q.timeSpent}s</span>
                </div>
                {q.feedback && (
                  <p className="text-sm text-gray-600 mt-2 italic">
                    {q.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Review Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Teacher Review
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teacher Notes
            </label>
            <textarea
              value={teacherNotes}
              onChange={(e) => setTeacherNotes(e.target.value)}
              placeholder="Add your comments and feedback..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teacher Rating (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={teacherRating}
                onChange={(e) => setTeacherRating(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
              >
                <option value="pending_review">Pending Review</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSaveReview}
            disabled={saving}
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-2 rounded-lg hover:bg-[#152d4a] disabled:opacity-50"
          >
            <LuSave />
            {saving ? "Saving..." : "Save Review"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssessmentDetail;
