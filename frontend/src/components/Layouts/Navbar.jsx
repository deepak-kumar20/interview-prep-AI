import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import {
  LuHouse,
  LuClipboardList,
  LuUsers,
  LuChartBar,
  LuBookOpen,
} from "react-icons/lu";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Navigation items based on user role
  const studentNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: LuHouse },
    { path: "/practice", label: "Practice", icon: LuBookOpen },
    { path: "/assessment", label: "Assessment", icon: LuClipboardList },
    { path: "/assessment/assigned", label: "Assigned", icon: LuClipboardList },
  ];

  const teacherNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: LuHouse },
    {
      path: "/assessments-management",
      label: "Assessments",
      icon: LuClipboardList,
    },
    { path: "/students", label: "Students", icon: LuUsers },
    { path: "/analytics", label: "Analytics", icon: LuChartBar },
  ];

  const navItems = user?.role === "teacher" ? teacherNavItems : studentNavItems;

  return (
    <nav className="h-16 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto h-full flex items-center justify-between gap-5 px-6 md:px-8">
        {/* Left side → Logo / Title */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[#1e3a5f]">
            PrepView AI
          </h2>
        </Link>

        {/* Center → Navigation Links (only show if user exists) */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? "bg-[#1e3a5f] text-white shadow-md"
                      : "text-gray-700 hover:bg-[#1e3a5f]/10 hover:text-[#1e3a5f]"
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Right side → Profile Info or Role Badge */}
        <div className="flex items-center gap-3">
          {user && user.role && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1e3a5f]/10 border border-[#1e3a5f]/20 rounded-full">
              <span className="text-xs font-semibold text-[#1e3a5f] uppercase">
                {user.role}
              </span>
            </div>
          )}
          <ProfileInfoCard />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
