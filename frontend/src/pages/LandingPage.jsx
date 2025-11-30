import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuSparkles,
  LuTarget,
  LuBrain,
  LuRocket,
  LuAward,
  LuUsers,
  LuTrendingUp,
  LuZap,
} from "react-icons/lu";
import { motion } from "framer-motion";
import { APP_FEATURES } from "../utils/data";
import Modal from "../components/Modal";
import Login from "./Auth/Login";
import Signup from "./Auth/SignUp";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";
import axiosInstance from "../utils/axiosInstance";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState("login");
  const [stats, setStats] = useState({
    totalQuestions: 0,
    completedAssessments: 0,
    successRate: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    // Fetch platform statistics
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/stats/platform");
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Keep default values if fetch fails
      }
    };
    fetchStats();
  }, []);

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <motion.div
          className="w-[600px] h-[600px] bg-gradient-to-r from-indigo-300/30 to-purple-300/30 blur-[100px] absolute -top-48 -left-48"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="w-[500px] h-[500px] bg-gradient-to-r from-pink-300/30 to-orange-300/30 blur-[100px] absolute top-1/2 -right-48"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <div className="container mx-auto px-6 md:px-10 pt-6 pb-20 relative z-10">
          {/* Glassy Navbar */}
          <motion.header
            className="flex justify-between items-center mb-20 bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl px-6 py-4 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                PrepView
              </span>
            </motion.div>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <motion.button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white px-7 py-3 rounded-full hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setOpenAuthModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login / Sign Up
              </motion.button>
            )}
          </motion.header>

          {/* Hero content */}
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <motion.div
              className="flex items-center justify-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-sm text-indigo-700 font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full border border-indigo-200 shadow-sm">
                <LuSparkles className="animate-pulse" /> AI-Powered Platform
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Master Your Interviews with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-text-shine">
                PrepView
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-700 max-w-3xl mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Practice with AI-generated questions, get instant feedback, track
              your progress with assessments, and let teachers review your
              performance. Your complete interview preparation platform.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-semibold text-white px-8 py-3.5 rounded-full hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={handleCTA}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Free
              </motion.button>
              <motion.button
                className="bg-white text-base font-semibold text-indigo-600 px-8 py-3.5 rounded-full border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Animated Feature Icons */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 w-full max-w-4xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                {
                  icon: LuTarget,
                  label: "Practice Mode",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: LuAward,
                  label: "AI Assessment",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  icon: LuUsers,
                  label: "Teacher Review",
                  color: "from-orange-500 to-red-500",
                },
                {
                  icon: LuTrendingUp,
                  label: "Track Progress",
                  color: "from-green-500 to-emerald-500",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div
                    className={`p-4 bg-gradient-to-br ${item.color} rounded-xl`}
                  >
                    <item.icon className="text-3xl text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full min-h-full bg-gradient-to-br from-gray-50 to-indigo-50/30 py-20">
        <div className="container mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Features That Make You Shine
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              Everything you need to prepare, practice, and perfect your
              interview skills
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {APP_FEATURES.map((feature, index) => {
              const icons = [
                LuTarget,
                LuBrain,
                LuRocket,
                LuZap,
                LuAward,
                LuUsers,
                LuTrendingUp,
              ];
              const gradients = [
                "from-blue-500 to-cyan-500",
                "from-purple-500 to-pink-500",
                "from-orange-500 to-red-500",
                "from-green-500 to-emerald-500",
                "from-indigo-500 to-purple-500",
                "from-pink-500 to-rose-500",
                "from-yellow-500 to-orange-500",
              ];
              const Icon = icons[index % icons.length];
              const gradient = gradients[index % gradients.length];

              return (
                <motion.div
                  key={feature.id}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-indigo-100 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Tracking Stats Section */}
      <div className="w-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-6 md:px-10 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Track Your Progress in Real-Time
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Monitor your improvement with detailed analytics, performance
              metrics, and personalized insights
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                value: stats.totalQuestions.toLocaleString(),
                label: "Questions Generated",
                icon: LuBrain,
                delay: 0,
              },
              {
                value: stats.completedAssessments.toLocaleString(),
                label: "Assessments Completed",
                icon: LuAward,
                delay: 0.1,
              },
              {
                value: `${stats.successRate}%`,
                label: "Success Rate",
                icon: LuTrendingUp,
                delay: 0.2,
              },
              {
                value: stats.activeUsers.toLocaleString(),
                label: "Active Users",
                icon: LuUsers,
                delay: 0.3,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 text-center border border-indigo-200 hover:bg-white/80 transition-all duration-300 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: stat.delay }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-md">
                    <stat.icon className="text-4xl text-white" />
                  </div>
                </div>
                <motion.div
                  className="text-5xl font-bold text-gray-800 mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    delay: stat.delay + 0.3,
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Progress Tracking Features */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              {
                title: "Score Analytics",
                description:
                  "View detailed breakdowns of technical, communication, and problem-solving scores",
              },
              {
                title: "Performance Trends",
                description:
                  "Track your improvement over time with visual charts and historical data",
              },
              {
                title: "Personalized Insights",
                description:
                  "Get AI-powered recommendations based on your strengths and weaknesses",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 border border-indigo-200 shadow-md"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 tex`t-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-6">
        Made with ❤️ by{" "}
        <a
          href="https://www.linkedin.com/in/deepak-kumar-5a6a1828b/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:underline"
        >
          Deepak Kumar
        </a>
      </div>

      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <Signup setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;
