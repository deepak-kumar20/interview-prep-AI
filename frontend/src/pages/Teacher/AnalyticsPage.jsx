import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import {
  LuUsers,
  LuTrendingUp,
  LuClipboardCheck,
  LuTarget,
  LuAward,
  LuChartBar,
} from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TEACHER.GET_ANALYTICS);
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
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

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">No analytics data available</p>
        </div>
      </DashboardLayout>
    );
  }

  const statsCards = [
    {
      title: "Total Assessments",
      value: analytics.totalAssessments || 0,
      icon: LuClipboardCheck,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Students",
      value: analytics.totalStudents || 0,
      icon: LuUsers,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Average Score",
      value: `${analytics.averageScore || 0}%`,
      icon: LuTrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Completion Rate",
      value: `${analytics.completionRate || 0}%`,
      icon: LuTarget,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-8 pb-4 px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics</h1>
          <p className="text-gray-600">Performance insights and statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`text-2xl ${stat.iconColor}`} />
                  </div>
                  <div
                    className={`bg-gradient-to-r ${stat.color} text-white text-xs px-2 py-1 rounded-full font-semibold`}
                  >
                    Live
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Overview */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-lg">
                <LuChartBar className="text-2xl text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Performance Overview
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Highest Score</span>
                <span className="text-2xl font-bold text-green-600">
                  {analytics.highestScore || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Lowest Score</span>
                <span className="text-2xl font-bold text-red-600">
                  {analytics.lowestScore || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Pass Rate</span>
                <span className="text-2xl font-bold text-blue-600">
                  {analytics.passRate || 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg">
                <LuAward className="text-2xl text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Top Performers
              </h2>
            </div>

            {analytics.topPerformers && analytics.topPerformers.length > 0 ? (
              <div className="space-y-3">
                {analytics.topPerformers.slice(0, 5).map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-full text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                    <span className="font-bold text-green-600">
                      {student.score}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <LuAward className="text-5xl mx-auto mb-3 text-gray-300" />
                <p>No performance data available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Assessment Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 mb-1">Excellent (80%+)</p>
              <p className="text-2xl font-bold text-green-600">
                {analytics.excellentCount || 0}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 mb-1">Good (60-79%)</p>
              <p className="text-2xl font-bold text-blue-600">
                {analytics.goodCount || 0}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700 mb-1">
                Needs Improvement (&lt;60%)
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {analytics.needsImprovementCount || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
