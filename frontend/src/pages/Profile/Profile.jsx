import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { getAvatarUrl } from "../../utils/constants";
import toast from "react-hot-toast";
import { LuUser, LuMail, LuShield, LuCamera } from "react-icons/lu";

const Profile = () => {
  const { user, updateUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      let profileImageUrl = user.profileImageUrl;

      // Upload new profile picture if selected
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || user.profileImageUrl;
      }

      // Update profile on backend
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        name,
        profileImageUrl,
      });

      // Update user context
      updateUser({ ...user, name, profileImageUrl });

      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, name, profileImageUrl })
      );

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setProfilePic(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setProfilePic(null);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-[#1e3a5f]"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Profile Picture */}
            <div className="relative -mt-16 mb-6">
              {isEditing ? (
                <div className="inline-block">
                  <ProfilePhotoSelector
                    image={profilePic}
                    setImage={setProfilePic}
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Click to change photo
                  </p>
                </div>
              ) : (
                <div className="relative inline-block">
                  <img
                    src={getAvatarUrl(user.profileImageUrl, user.name)}
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-[#1e3a5f]"
                  />
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <LuCamera className="text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <LuUser className="text-[#1e3a5f]" />
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-lg text-gray-800 px-4 py-3 bg-gray-50 rounded-lg">
                    {user.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <LuMail className="text-[#1e3a5f]" />
                  Email
                </label>
                <p className="text-lg text-gray-800 px-4 py-3 bg-gray-50 rounded-lg">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <LuShield className="text-[#1e3a5f]" />
                  Role
                </label>
                <div className="inline-flex items-center px-4 py-2 bg-[#1e3a5f]/10 border border-[#1e3a5f]/20 rounded-full">
                  <span className="text-sm font-semibold text-[#1e3a5f] uppercase">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing ? (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="flex-1 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#152d4a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#152d4a] transition-all duration-300 shadow-md"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
