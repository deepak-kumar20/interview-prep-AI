import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { getAvatarUrl } from "../../utils/constants";
import moment from "moment";
import {
  LuUser,
  LuMail,
  LuCalendar,
  LuTrendingUp,
  LuSearch,
} from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

const StudentsPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TEACHER.GET_STUDENTS);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-8 pb-4 px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Students</h1>
          <p className="text-gray-600">View and manage all students</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            />
          </div>
        </div>

        {/* Students List */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <LuUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Students Found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "No students match your search criteria"
                : "No students have taken assessments yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                onClick={() => navigate(`/teacher/student/${student._id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-[#1e3a5f]/30 overflow-hidden group"
              >
                {/* Card Header with Gradient */}
                <div className="h-24 bg-[#1e3a5f]"></div>

                {/* Profile Picture */}
                <div className="px-6 pb-6">
                  <div className="relative -mt-12 mb-4">
                    <img
                      src={getAvatarUrl(student.profileImageUrl, student.name)}
                      alt={student.name}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-[#1e3a5f] mx-auto"
                    />
                  </div>

                  {/* Student Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {student.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 text-gray-600 text-sm mb-3">
                      <LuMail className="text-xs" />
                      <span>{student.email}</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <LuTrendingUp className="text-[#1e3a5f]" />
                        Assessments
                      </span>
                      <span className="font-semibold text-gray-800">
                        {student.assessmentCount || 0}
                      </span>
                    </div>

                    {student.averageScore !== undefined && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Avg Score</span>
                        <span
                          className={`font-bold px-3 py-1 rounded-full ${getScoreColor(
                            student.averageScore
                          )}`}
                        >
                          {student.averageScore}%
                        </span>
                      </div>
                    )}

                    {student.lastAssessment && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <LuCalendar className="text-[#1e3a5f]" />
                          Last Active
                        </span>
                        <span className="text-xs text-gray-500">
                          {moment(student.lastAssessment).fromNow()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
                  <button className="w-full mt-4 bg-[#1e3a5f] text-white py-2 rounded-lg font-semibold hover:bg-[#152d4a] transition-all duration-300">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;
