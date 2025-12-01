import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { LuClock, LuSend } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";

const LiveInterview = () => {
  const { assessmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(
    location.state?.assessmentData?.assessment || null
  );
  const [currentQuestion, setCurrentQuestion] = useState(
    location.state?.assessmentData?.currentQuestion || null
  );
  const [progress, setProgress] = useState({
    current: 1,
    total: location.state?.assessmentData?.totalQuestions || 8,
  });

  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Fetch assessment data if not passed via location.state
  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (!assessment || !currentQuestion) {
        setFetchingData(true);
        try {
          const response = await axiosInstance.get(
            API_PATHS.ASSESSMENT.GET_ONE(assessmentId)
          );

          const assessmentData = response.data;
          setAssessment(assessmentData);

          // Get the latest unanswered question
          if (assessmentData.questions && assessmentData.questions.length > 0) {
            const lastQuestion =
              assessmentData.questions[assessmentData.questions.length - 1];
            setCurrentQuestion(lastQuestion);
            setProgress({
              current: assessmentData.questions.length,
              total: assessmentData.questionCount || 8,
            });
          }
        } catch (error) {
          console.error("Error fetching assessment:", error);
          toast.error("Failed to load assessment");
          navigate("/assessment/assigned");
        } finally {
          setFetchingData(false);
        }
      }
    };

    fetchAssessmentData();
  }, [assessmentId, assessment, currentQuestion, navigate]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer");
      return;
    }

    setLoading(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    try {
      const response = await axiosInstance.post(
        API_PATHS.ASSESSMENT.SUBMIT_ANSWER,
        {
          assessmentId: assessment._id,
          questionId: currentQuestion._id,
          answer: answer.trim(),
          timeSpent,
        }
      );

      if (response.data.completed) {
        // Assessment completed, now evaluate
        toast.success("Completing assessment...");
        await completeAssessment();
      } else {
        // Move to next question
        setCurrentQuestion(response.data.currentQuestion);
        setProgress(response.data.progress);
        setAnswer("");
        setStartTime(Date.now());
        toast.success("Answer submitted!");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error(error.response?.data?.message || "Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  const completeAssessment = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.ASSESSMENT.COMPLETE, {
        assessmentId: assessment._id,
      });

      toast.success("Assessment completed! Generating results...");
      navigate(`/assessment/result/${assessment._id}`);
    } catch (error) {
      console.error("Error completing assessment:", error);
      toast.error(
        error.response?.data?.message || "Failed to complete assessment"
      );
    }
  };

  if (!assessment || !currentQuestion || fetchingData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-lg text-gray-600">Loading interview...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-8 pb-4 px-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {assessment.role} Interview
              </h1>
              <p className="text-gray-600 mt-1">
                {assessment.experience} Level · {assessment.topicsToFocus}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <LuClock className="text-xl" />
                <span className="text-lg font-mono">
                  {formatTime(elapsedTime)}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Question {progress.current} of {progress.total}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="mb-6">
            <div className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Question {currentQuestion.order}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
              {currentQuestion.questionText}
            </h2>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleSubmitAnswer}
            disabled={loading || !answer.trim()}
            className="flex items-center justify-center gap-2 w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LuSend className="text-xl" />
            {loading ? "Submitting..." : "Submit Answer"}
          </button>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> Take your time to provide a clear and detailed
            answer. The AI will evaluate your response and may ask follow-up
            questions.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LiveInterview;
