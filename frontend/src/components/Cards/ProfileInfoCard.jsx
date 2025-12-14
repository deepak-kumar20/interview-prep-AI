import React, { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { LuLogOut, LuUser, LuChevronDown } from "react-icons/lu";
import { getAvatarUrl } from "../../utils/constants";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:border-[#1e3a5f] hover:bg-gray-100 transition-all duration-200"
      >
        <img
          src={getAvatarUrl(user.profileImageUrl, user.name)}
          alt={user.name}
          className="w-9 h-9 bg-[#1e3a5f] rounded-full object-cover"
        />
        <div className="hidden md:block text-left">
          <div className="text-gray-800 text-sm font-semibold leading-tight">
            {user.name || "User"}
          </div>
          <div className="text-gray-500 text-xs">
            {user.email?.split("@")[0]}
          </div>
        </div>
        <LuChevronDown
          className={`text-gray-500 transition-transform duration-300 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <button
            onClick={() => {
              setIsDropdownOpen(false);
              navigate("/profile");
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <LuUser className="text-lg" />
            <span>View Profile</span>
          </button>

          <button
            onClick={() => {
              setIsDropdownOpen(false);
              navigate("/dashboard");
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <LuUser className="text-lg" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setIsDropdownOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <LuLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoCard;
