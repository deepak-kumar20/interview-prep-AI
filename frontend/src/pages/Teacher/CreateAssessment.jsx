import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { getAvatarUrl } from "../../utils/constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  LuClipboardList,
  LuUser,
  LuBriefcase,
  LuClock,
  LuTarget,
  LuCalendar,
  LuUsers,
  LuFileText,
} from "react-icons/lu";

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    role: "",
    experience: "Junior",
    topicsToFocus: "",
    duration: 1800,
    questionCount: 10,
    scheduledAt: "",
    assignedStudents: [],
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TEACHER.GET_STUDENTS);
      // Extract unique students from assessments
      const uniqueStudents = [];
      const studentIds = new Set();

      response.data.forEach((assessment) => {
        if (assessment.student && !studentIds.has(assessment.student._id)) {
          studentIds.add(assessment.student._id);
          uniqueStudents.push(assessment.student);
        }
      });

      setStudents(uniqueStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudentToggle = (studentId) => {
    setFormData((prev) => ({
      ...prev,
      assignedStudents: prev.assignedStudents.includes(studentId)
        ? prev.assignedStudents.filter((id) => id !== studentId)
        : [...prev.assignedStudents, studentId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/api/teacher/assessment/create", formData);
      toast.success("Custom assessment created successfully!");
      navigate("/assessments-management");
    } catch (error) {
      console.error("Error creating assessment:", error);
      toast.error(
        error.response?.data?.message || "Failed to create assessment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-8 pb-4 px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="bg-[#1e3a5f] p-3 rounded-lg">
              <LuClipboardList className="text-2xl text-white" />
            </div>
            Create Custom Assessment
          </h1>
          <p className="text-gray-600">
            Design a custom interview assessment for your students
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <LuFileText className="text-[#1e3a5f]" />
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assessment Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  placeholder="e.g., React Developer Technical Assessment"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent resize-none"
                  placeholder="Describe the assessment objectives and what will be evaluated..."
                />
              </div>
            </div>
          </div>

          {/* Assessment Configuration */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <LuTarget className="text-[#1e3a5f]" />
              Assessment Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <LuBriefcase className="text-[#1e3a5f]" />
                  Role *
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  placeholder="e.g., Frontend Developer, Backend Engineer"
                  required
                />
              </div>

              {/* Experience Level */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <LuUser className="text-[#1e3a5f]" />
                  Experience Level *
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                  required
                >
                  <option value="Junior">Junior (0-2 years)</option>
                  <option value="Mid">Mid-Level (3-5 years)</option>
                  <option value="Senior">Senior (5+ years)</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <LuClock className="text-[#1e3a5f]" />
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration / 60}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value) * 60,
                    }))
                  }
                  min="15"
                  max="180"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                />
              </div>

              {/* Question Count */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <LuTarget className="text-[#1e3a5f]" />
                  Number of Questions
                </label>
                <input
                  type="number"
                  name="questionCount"
                  value={formData.questionCount}
                  onChange={handleChange}
                  min="5"
                  max="30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                />
              </div>

              {/* Scheduled Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <LuCalendar className="text-[#1e3a5f]" />
                  Scheduled Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={formData.scheduledAt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                />
              </div>
            </div>

            {/* Topics to Focus */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Topics to Focus On (Optional)
              </label>
              <textarea
                name="topicsToFocus"
                value={formData.topicsToFocus}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent resize-none"
                placeholder="e.g., React Hooks, State Management, Component Lifecycle, API Integration"
              />
            </div>
          </div>

          {/* Assign Students */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <LuUsers className="text-[#1e3a5f]" />
              Assign Students (Optional)
            </h2>

            {students.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No students available. Students will appear here once they
                complete their first assessment.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {students.map((student) => (
                  <div
                    key={student._id}
                    onClick={() => handleStudentToggle(student._id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.assignedStudents.includes(student._id)
                        ? "border-[#1e3a5f] bg-[#1e3a5f]/10"
                        : "border-gray-200 hover:border-[#1e3a5f]/30 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.assignedStudents.includes(student._id)}
                      onChange={() => {}}
                      className="w-5 h-5 text-[#1e3a5f] rounded focus:ring-[#1e3a5f]"
                    />
                    <img
                      src={getAvatarUrl(student.profileImageUrl, student.name)}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover bg-[#1e3a5f]"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#152d4a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? "Creating..." : "Create Assessment"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateAssessment;
