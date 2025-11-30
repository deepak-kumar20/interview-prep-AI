import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { Navigate } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";

const Dashboard = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect based on role
  if (user.role === "teacher" || user.role === "admin") {
    return <Navigate to="/teacher/dashboard" replace />;
  }

  // Student dashboard
  return <StudentDashboard />;
};

export default Dashboard;
