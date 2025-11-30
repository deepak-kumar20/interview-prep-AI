import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Input from "../../components/Inputs/Input";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

const StartAssessment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    experience: "Junior",
    topicsToFocus: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStartAssessment = async (e) => {
    e.preventDefault();

    if (!formData.role || !formData.topicsToFocus) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        API_PATHS.ASSESSMENT.START,
        formData
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-8 pb-4 px-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Start Interview Assessment
          </h1>
          <p className="text-gray-600 mt-2">
            Take a 5-10 minute AI-conducted interview. You'll receive instant
            scoring and feedback.
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-sm text-yellow-700">
            <strong>Important:</strong> Once started, you cannot pause the
            assessment. Make sure you have 10-15 minutes of uninterrupted time.
          </p>
        </div>

        <form
          onSubmit={handleStartAssessment}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <Input
            label="Role/Position"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g., Frontend Developer, Backend Engineer"
            type="text"
            required
          />

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-xs font-medium text-slate-700">
              Experience Level <span className="text-red-500">*</span>
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
              required
            >
              <option value="Junior">Junior (0-2 years)</option>
              <option value="Mid">Mid-level (2-5 years)</option>
              <option value="Senior">Senior (5+ years)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label className="text-xs font-medium text-slate-700">
              Topics to Focus <span className="text-red-500">*</span>
            </label>
            <textarea
              name="topicsToFocus"
              value={formData.topicsToFocus}
              onChange={handleChange}
              placeholder="e.g., React, JavaScript, Node.js, System Design"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 h-24"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Starting..." : "Start Assessment"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/assessment")}
            className="w-full mt-3 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default StartAssessment;
