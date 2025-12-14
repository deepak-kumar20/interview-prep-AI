import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/20">
      <Navbar />
      {user && <div>{children}</div>}
    </div>
  );
};

export default DashboardLayout;
