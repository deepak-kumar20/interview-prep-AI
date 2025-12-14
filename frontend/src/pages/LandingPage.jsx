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
  LuSearch,
  LuMic,
  LuMessageSquare,
  LuCircleCheck,
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
        const response = await axiosInstance.get("/api/stats/platform");
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

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-white">
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-lg">
          <div className="container mx-auto px-6 md:px-10">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#1e3a5f]">
                  PrepView AI
                </span>
              </div>

              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-8">
                <button 
                  onClick={() => scrollToSection("features")} 
                  className="text-sm text-gray-600 hover:text-[#1e3a5f] transition-colors cursor-pointer"
                >
                  Practice Sessions
                </button>
                <button 
                  onClick={() => scrollToSection("how-it-works")} 
                  className="text-sm text-gray-600 hover:text-[#1e3a5f] transition-colors cursor-pointer"
                >
                  AI Assessment
                </button>
                <button 
                  onClick={() => scrollToSection("progress")} 
                  className="text-sm text-gray-600 hover:text-[#1e3a5f] transition-colors cursor-pointer"
                >
                  Track Progress
                </button>
                <button 
                  onClick={() => scrollToSection("how-it-works")} 
                  className="text-sm text-gray-600 hover:text-[#1e3a5f] transition-colors cursor-pointer"
                >
                  How PrepView Works
                </button>
              </nav>

              {/* Right Side - Search & Auth */}
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="hidden md:flex items-center">
                  <div className="flex items-center border border-gray-200 rounded-l-lg px-4 py-2">
                    <input
                      type="text"
                      placeholder="Search for any topics"
                      className="text-sm outline-none w-48 bg-transparent"
                    />
                  </div>
                  <button className="bg-[#1e3a5f] text-white p-2.5 rounded-r-lg">
                    <LuSearch className="text-lg" />
                  </button>
                </div>

                {user ? (
                  <ProfileInfoCard />
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setCurrentPage("login");
                        setOpenAuthModal(true);
                      }}
                      className="text-sm font-medium text-[#1e3a5f] px-6 py-2.5 rounded-lg border border-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white transition-all duration-200"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage("signup");
                        setOpenAuthModal(true);
                      }}
                      className="text-sm font-medium text-white px-6 py-2.5 rounded-lg bg-[#1e3a5f] hover:bg-[#152d4a] transition-all duration-200"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1e3a5f] leading-tight mb-6">
                Ace Your Next
                <br />
                Interview
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Practice with AI-Powered Mock Interviews, Get Instant Feedback & 
                Master Everything in One Platform
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <motion.button
                  onClick={handleCTA}
                  className="bg-[#1e3a5f] text-white font-semibold px-8 py-4 rounded-lg hover:bg-[#152d4a] transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>

                <div className="flex items-center gap-3">
                  {/* User Avatars - Instagram Style */}
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <svg viewBox="0 0 128 128" className="w-full h-full">
                        <circle cx="64" cy="64" r="64" fill="#e4e6eb"/>
                        <circle cx="64" cy="47" r="22" fill="#bcc0c4"/>
                        <path d="M64 78c-28 0-46 16-46 38a64 64 0 0 0 92 0c0-22-18-38-46-38z" fill="#bcc0c4"/>
                      </svg>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <svg viewBox="0 0 128 128" className="w-full h-full">
                        <circle cx="64" cy="64" r="64" fill="#e4e6eb"/>
                        <circle cx="64" cy="47" r="22" fill="#bcc0c4"/>
                        <path d="M64 78c-28 0-46 16-46 38a64 64 0 0 0 92 0c0-22-18-38-46-38z" fill="#bcc0c4"/>
                      </svg>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <svg viewBox="0 0 128 128" className="w-full h-full">
                        <circle cx="64" cy="64" r="64" fill="#e4e6eb"/>
                        <circle cx="64" cy="47" r="22" fill="#bcc0c4"/>
                        <path d="M64 78c-28 0-46 16-46 38a64 64 0 0 0 92 0c0-22-18-38-46-38z" fill="#bcc0c4"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Join <span className="font-semibold text-[#1e3a5f]">1000+</span> users
                    <br />
                    preparing with AI
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Team collaboration"
                  className="w-full h-auto object-cover"
                />
                {/* Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-blue-500 rounded-xl flex items-center justify-center">
                      <LuMic className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">AI Interview in Progress</p>
                      <p className="text-sm text-gray-500">Voice-enabled mock interview</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-xs text-green-600 font-medium">Live</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2">
                  <LuSparkles className="text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-700">AI Powered</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Strip */}
        <section className="bg-gray-50 py-8 border-y border-gray-100">
          <div className="container mx-auto px-6 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: LuMic, label: "Voice Interview", desc: "Speak naturally" },
                { icon: LuBrain, label: "AI Analysis", desc: "Smart feedback" },
                { icon: LuTarget, label: "Role-Specific", desc: "Tailored questions" },
                { icon: LuTrendingUp, label: "Track Progress", desc: "See improvement" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
                    <item.icon className="text-xl text-[#1e3a5f]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="container mx-auto px-6 md:px-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
                How PrepView AI Works
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get interview-ready in 3 simple steps
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Choose Your Role",
                  description: "Select your target position and experience level. AI customizes questions accordingly.",
                  icon: LuTarget,
                },
                {
                  step: "02",
                  title: "Practice with AI",
                  description: "Answer questions via voice or text. Our AI interviewer adapts to your responses.",
                  icon: LuMessageSquare,
                },
                {
                  step: "03",
                  title: "Get Instant Feedback",
                  description: "Receive detailed scores, improvement tips, and track your progress over time.",
                  icon: LuCircleCheck,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="absolute -top-4 left-8 bg-[#1e3a5f] text-white text-sm font-bold px-3 py-1 rounded-full">
                    {item.step}
                  </span>
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-gray-100">
                    <item.icon className="text-2xl text-[#1e3a5f]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 md:px-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
                Features That Make You Shine
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to prepare, practice, and perfect your interview skills
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {APP_FEATURES.map((feature, index) => {
                const icons = [LuTarget, LuBrain, LuRocket, LuZap, LuAward, LuUsers, LuTrendingUp];
                const Icon = icons[index % icons.length];

                return (
                  <motion.div
                    key={feature.id}
                    className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-14 h-14 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center mb-5">
                      <Icon className="text-2xl text-[#1e3a5f]" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="progress" className="py-20 bg-[#1e3a5f]">
          <div className="container mx-auto px-6 md:px-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Trusted by Thousands
              </h2>
              <p className="text-blue-200 max-w-2xl mx-auto">
                Join our growing community of interview-ready professionals
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { value: stats.totalQuestions.toLocaleString() || "10K+", label: "Questions Generated", icon: LuBrain },
                { value: stats.completedAssessments.toLocaleString() || "5K+", label: "Assessments Done", icon: LuAward },
                { value: `${stats.successRate || 92}%`, label: "Success Rate", icon: LuTrendingUp },
                { value: stats.activeUsers.toLocaleString() || "1K+", label: "Active Users", icon: LuUsers },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="text-3xl text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 md:px-10">
            <motion.div
              className="max-w-3xl mx-auto text-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
                Ready to Ace Your Interview?
              </h2>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                Start practicing with AI-powered mock interviews today. It's free to get started!
              </p>
              <motion.button
                onClick={handleCTA}
                className="bg-[#1e3a5f] text-white font-semibold px-10 py-4 rounded-lg hover:bg-[#152d4a] transition-all duration-200 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Free Practice
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0f1c2e] text-white">
          {/* Main Footer */}
          <div className="container mx-auto px-6 md:px-10 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <h3 className="text-2xl font-bold mb-4">PrepView AI</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Your AI-powered interview preparation platform. Practice smarter, 
                  get instant feedback, and land your dream job.
                </p>
                {/* Social Links */}
                <div className="flex items-center gap-4">
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#1e3a5f] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#0077b5] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#333] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h4 className="text-lg font-semibold mb-6">Product</h4>
                <ul className="space-y-3">
                  <li>
                    <button onClick={() => scrollToSection("features")} className="text-gray-400 hover:text-white transition-colors text-sm">
                      Features
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection("how-it-works")} className="text-gray-400 hover:text-white transition-colors text-sm">
                      How It Works
                    </button>
                  </li>
                  <li>
                    <button onClick={handleCTA} className="text-gray-400 hover:text-white transition-colors text-sm">
                      Pricing
                    </button>
                  </li>
                  <li>
                    <button onClick={handleCTA} className="text-gray-400 hover:text-white transition-colors text-sm">
                      AI Assessment
                    </button>
                  </li>
                  <li>
                    <button onClick={handleCTA} className="text-gray-400 hover:text-white transition-colors text-sm">
                      Practice Mode
                    </button>
                  </li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h4 className="text-lg font-semibold mb-6">Company</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Partners
                    </a>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="text-lg font-semibold mb-6">Stay Updated</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Subscribe to our newsletter for tips, updates, and exclusive content.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#2563eb]"
                  />
                  <button className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] rounded-lg text-sm font-medium transition-colors">
                    Subscribe
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-3">
                  By subscribing, you agree to our Privacy Policy.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white/10">
            <div className="container mx-auto px-6 md:px-10 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} PrepView AI. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Cookie Policy
                  </a>
                </div>
                <p className="text-gray-500 text-sm">
                  Made with ❤️ by{" "}
                  <a
                    href="https://www.linkedin.com/in/deepak-kumar-5a6a1828b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Deepak Kumar
                  </a>
                </p>
              </div>
            </div>
          </div>
        </footer>
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
          {currentPage === "signup" && <Signup setCurrentPage={setCurrentPage} />}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;
