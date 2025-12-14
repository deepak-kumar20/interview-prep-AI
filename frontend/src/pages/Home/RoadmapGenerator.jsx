import React, { useState } from "react";
import { LuDownload, LuLoader, LuMap } from "react-icons/lu";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import jsPDF from "jspdf";

const RoadmapGenerator = () => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "Junior",
    topics: "",
    duration: "3",
  });
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateRoadmap = async (e) => {
    e.preventDefault();

    if (!formData.role || !formData.topics) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_ROADMAP, {
        role: formData.role,
        experience: formData.experience,
        topics: formData.topics,
        duration: formData.duration,
      });

      setRoadmap(response.data.roadmap);
      toast.success("Roadmap generated successfully!");
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast.error("Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!roadmap) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Add header with gradient background color simulation
    doc.setFillColor(30, 58, 95); // Navy blue color #1e3a5f
    doc.rect(0, 0, pageWidth, 40, "F");

    // Title in white
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Interview Preparation Roadmap", pageWidth / 2, 25, {
      align: "center",
    });

    yPosition = 50;

    // Role and Experience section with background
    doc.setFillColor(249, 250, 251);
    doc.rect(margin - 5, yPosition - 5, maxWidth + 10, 25, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(55, 65, 81);
    doc.text(`Role: `, margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(formData.role, margin + 20, yPosition);

    yPosition += 8;
    doc.setFont("helvetica", "bold");
    doc.text(`Experience: `, margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(formData.experience, margin + 30, yPosition);

    yPosition += 8;
    doc.setFont("helvetica", "bold");
    doc.text(`Duration: `, margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`${formData.duration} months`, margin + 27, yPosition);

    yPosition += 20;

    // Process roadmap line by line with proper formatting
    const lines = roadmap.split("\n");
    
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      // Check if we need a new page
      if (yPosition > pageHeight - margin - 15) {
        doc.addPage();
        yPosition = margin;
      }

      // Main Headers (## or #)
      if (trimmedLine.match(/^#{1,2}\s+(.+)/)) {
        const text = trimmedLine.replace(/^#{1,2}\s+/, "");
        yPosition += 5;
        doc.setFillColor(30, 58, 95);
        doc.rect(margin - 5, yPosition - 5, maxWidth + 10, 12, "F");
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(text, margin, yPosition + 3);
        yPosition += 15;
        return;
      }

      // Sub-headers (###)
      if (trimmedLine.match(/^###\s+(.+)/)) {
        const text = trimmedLine.replace(/^###\s+/, "");
        yPosition += 4;
        doc.setDrawColor(30, 58, 95);
        doc.setLineWidth(2);
        doc.line(margin, yPosition, margin, yPosition + 8);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 58, 95);
        doc.text(text, margin + 5, yPosition + 5);
        yPosition += 12;
        return;
      }

      // Bold text (**text**)
      if (trimmedLine.match(/^\*\*(.+?)\*\*:?\s*$/)) {
        const text = trimmedLine.replace(/^\*\*(.+?)\*\*:?\s*$/, "$1");
        yPosition += 3;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(55, 65, 81);
        doc.text("• " + text, margin + 2, yPosition);
        yPosition += 7;
        return;
      }

      // Bullet points with *
      if (trimmedLine.match(/^\*\s+(.+)/)) {
        const text = trimmedLine.replace(/^\*\s+/, "");
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(75, 85, 99);
        
        const bulletLines = doc.splitTextToSize("  • " + text, maxWidth - 5);
        bulletLines.forEach((bulletLine, idx) => {
          if (yPosition > pageHeight - margin - 10) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(bulletLine, margin + 5, yPosition);
          yPosition += 5;
        });
        return;
      }

      // Numbered lists
      if (trimmedLine.match(/^\d+\.\s+(.+)/)) {
        const text = trimmedLine;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(75, 85, 99);
        
        const numberedLines = doc.splitTextToSize(text, maxWidth - 5);
        numberedLines.forEach((numLine) => {
          if (yPosition > pageHeight - margin - 10) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(numLine, margin + 2, yPosition);
          yPosition += 5;
        });
        return;
      }

      // Horizontal dividers
      if (trimmedLine.match(/^[-*]{2,}$/)) {
        yPosition += 3;
        doc.setDrawColor(30, 58, 95);
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;
        return;
      }

      // Empty lines
      if (trimmedLine === "") {
        yPosition += 3;
        return;
      }

      // Regular paragraphs
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      
      const paragraphLines = doc.splitTextToSize(trimmedLine, maxWidth);
      paragraphLines.forEach((pLine) => {
        if (yPosition > pageHeight - margin - 10) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(pLine, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 2;
    });

    // Add footer
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
      doc.text(
        `Generated by PrepView - ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: "center" }
      );
    }

    doc.save(
      `${formData.role.replace(/\s+/g, "_")}_Roadmap_${Date.now()}.pdf`
    );
    toast.success("PDF downloaded successfully!");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto pt-8 pb-12 px-4 md:px-8">
          {/* Header Section */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 bg-[#1e3a5f] rounded-xl shadow-lg flex items-center justify-center">
              <LuMap className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a5f]">
                Roadmap Generator
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                Generate a personalized learning roadmap tailored to your target role, experience level, and preparation timeline
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Form Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-[#1e3a5f]/10 hover:shadow-2xl transition-shadow duration-300">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Create Your Roadmap
                </h2>
                <p className="text-gray-500 text-sm">
                  Fill in the details to generate a customized learning path
                </p>
              </div>
              <form onSubmit={generateRoadmap} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="text-[#1e3a5f]">🎯</span>
                    Target Role *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g., Frontend Developer, Data Scientist"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition-all duration-200 hover:border-[#1e3a5f]/30 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="text-[#1e3a5f]">📊</span>
                    Experience Level *
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition-all duration-200 hover:border-[#1e3a5f]/30 bg-gray-50 focus:bg-white cursor-pointer"
                  >
                    <option value="Junior">Junior (0-2 years)</option>
                    <option value="Mid">Mid (2-5 years)</option>
                    <option value="Senior">Senior (5+ years)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="text-[#1e3a5f]">📚</span>
                    Topics/Syllabus *
                  </label>
                  <textarea
                    name="topics"
                    value={formData.topics}
                    onChange={handleChange}
                    placeholder="e.g., React, Node.js, MongoDB, System Design, Algorithms, Data Structures"
                    rows="5"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition-all duration-200 hover:border-[#1e3a5f]/30 bg-gray-50 focus:bg-white resize-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate topics with commas for better organization
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="text-[#1e3a5f]">⏱️</span>
                    Preparation Duration
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition-all duration-200 hover:border-[#1e3a5f]/30 bg-gray-50 focus:bg-white cursor-pointer"
                  >
                    <option value="1">1 month - Intensive</option>
                    <option value="2">2 months - Fast Track</option>
                    <option value="3">3 months - Balanced</option>
                    <option value="6">6 months - Comprehensive</option>
                    <option value="12">12 months - In-Depth</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1e3a5f] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-8"
                >
                  {loading ? (
                    <>
                      <LuLoader className="animate-spin text-2xl" />
                      <span>Generating Your Roadmap...</span>
                    </>
                  ) : (
                    <>
                      <LuMap className="text-2xl" />
                      <span>Generate Roadmap</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Roadmap Display Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-[#1e3a5f]/10 overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center px-8">
                  <div className="w-20 h-20 bg-[#1e3a5f] rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <LuMap className="text-4xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Generating Your Roadmap
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Our AI is crafting a personalized learning path just for you...
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-[#1e3a5f] rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-[#1e3a5f] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-[#1e3a5f] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              ) : roadmap ? (
                <div>
                  {/* Header with gradient */}
                  <div className="bg-[#1e3a5f] px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                          <LuMap className="text-3xl" />
                          Your Learning Roadmap
                        </h2>
                        <p className="text-white/70 text-sm mt-1">
                          {formData.role} • {formData.experience} • {formData.duration} months
                        </p>
                      </div>
                      <button
                        onClick={downloadPDF}
                        className="flex items-center gap-2 bg-white text-[#1e3a5f] px-6 py-3 rounded-xl hover:bg-[#1e3a5f]/5 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <LuDownload className="text-xl" />
                        Download PDF
                      </button>
                    </div>
                  </div>

                  {/* Roadmap Content */}
                  <div className="p-8 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                    <div className="space-y-6 relative">
                      {roadmap.split("\n").map((line, index) => {
                        const trimmedLine = line.trim();
                        
                        // Main Headers (## or #)
                        if (trimmedLine.match(/^#{1,2}\s+(.+)/)) {
                          const text = trimmedLine.replace(/^#{1,2}\s+/, "");
                          const level = trimmedLine.startsWith("##") ? 2 : 1;
                          
                          return (
                            <div key={index} className={level === 1 ? "mt-8" : "mt-6"}>
                              <div className={`bg-[#1e3a5f] ${
                                level === 1 
                                  ? "" 
                                  : "bg-opacity-90"
                              } text-white px-6 py-3 rounded-xl shadow-lg`}>
                                <h2 className={`${
                                  level === 1 ? "text-2xl" : "text-xl"
                                } font-bold flex items-center gap-3`}>
                                  <span className="text-3xl">
                                    {level === 1 ? "📋" : "📍"}
                                  </span>
                                  {text}
                                </h2>
                              </div>
                            </div>
                          );
                        }
                        
                        // Sub-headers (###)
                        if (trimmedLine.match(/^###\s+(.+)/)) {
                          const text = trimmedLine.replace(/^###\s+/, "");
                          return (
                            <div key={index} className="mt-6 mb-4">
                              <div className="border-l-4 border-[#1e3a5f] pl-4 bg-[#1e3a5f]/5 py-3 rounded-r-lg">
                                <h3 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
                                  <span>🎯</span>
                                  {text}
                                </h3>
                              </div>
                            </div>
                          );
                        }
                        
                        // Bold text (**text**)
                        if (trimmedLine.match(/^\*\*(.+?)\*\*:?\s*$/)) {
                          const text = trimmedLine.replace(/^\*\*(.+?)\*\*:?\s*$/, "$1");
                          return (
                            <div key={index} className="mt-4">
                              <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#1e3a5f] rounded-full"></span>
                                {text}
                              </h4>
                            </div>
                          );
                        }
                        
                        // Bullet points with *
                        if (trimmedLine.match(/^\*\s+(.+)/)) {
                          const text = trimmedLine.replace(/^\*\s+/, "");
                          // Check if it contains bold text
                          const hasBold = text.match(/\*\*(.+?)\*\*/);
                          
                          if (hasBold) {
                            const parts = text.split(/(\*\*.+?\*\*)/);
                            return (
                              <div key={index} className="flex items-start gap-3 ml-6 my-2">
                                <span className="text-[#1e3a5f] mt-1.5 text-sm">●</span>
                                <span className="text-gray-700 leading-relaxed">
                                  {parts.map((part, i) => {
                                    if (part.match(/^\*\*(.+?)\*\*$/)) {
                                      return (
                                        <strong key={i} className="font-semibold text-gray-900">
                                          {part.replace(/^\*\*(.+?)\*\*$/, "$1")}
                                        </strong>
                                      );
                                    }
                                    return <span key={i}>{part}</span>;
                                  })}
                                </span>
                              </div>
                            );
                          }
                          
                          return (
                            <div key={index} className="flex items-start gap-3 ml-6 my-2">
                              <span className="text-[#1e3a5f] mt-1.5 text-sm">●</span>
                              <span className="text-gray-700 leading-relaxed">{text}</span>
                            </div>
                          );
                        }
                        
                        // Numbered lists
                        if (trimmedLine.match(/^\d+\.\s+(.+)/)) {
                          const match = trimmedLine.match(/^(\d+)\.\s+(.+)/);
                          const number = match[1];
                          const text = match[2];
                          
                          return (
                            <div key={index} className="flex items-start gap-3 ml-4 my-2">
                              <span className="flex-shrink-0 w-7 h-7 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                {number}
                              </span>
                              <span className="text-gray-700 leading-relaxed pt-0.5">{text}</span>
                            </div>
                          );
                        }
                        
                        // Horizontal dividers
                        if (trimmedLine.match(/^[-*]{2,}$/)) {
                          return (
                            <div key={index} className="my-6">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#1e3a5f]/30 to-transparent"></div>
                                <span className="text-[#1e3a5f]/40">◆</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#1e3a5f]/30 to-transparent"></div>
                              </div>
                            </div>
                          );
                        }
                        
                        // Empty lines
                        if (trimmedLine === "") {
                          return <div key={index} className="h-2"></div>;
                        }
                        
                        // Regular paragraphs
                        return (
                          <p key={index} className="text-gray-700 leading-relaxed ml-2">
                            {trimmedLine}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center px-8">
                  <div className="w-32 h-32 bg-[#1e3a5f]/10 rounded-3xl flex items-center justify-center mb-6">
                    <LuMap className="text-6xl text-[#1e3a5f]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Ready to Start Your Journey?
                  </h3>
                  <p className="text-gray-500 text-lg max-w-md">
                    Fill in the form on the left and click &quot;Generate Roadmap&quot; to
                    create your personalized learning path
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="text-2xl">✨</span>
                      <span>AI-Powered</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="text-2xl">🎯</span>
                      <span>Personalized</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="text-2xl">📥</span>
                      <span>PDF Download</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="text-2xl">⚡</span>
                      <span>Instant Results</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoadmapGenerator;
