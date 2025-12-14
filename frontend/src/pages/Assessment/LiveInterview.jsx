import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { LuClock, LuSend, LuVolume2, LuVolumeX, LuPause, LuMic, LuMicOff } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import useTextToSpeech from "../../hooks/useTextToSpeech";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import Avatar3D from "../../components/Avatar/Avatar3D";

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

  // Text-to-Speech hook
  const { speak, stop, isSpeaking, isPaused, pause, resume, isSupported } = useTextToSpeech();

  // Speech Recognition hook (voice input)
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: isSpeechRecognitionSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Sync speech recognition transcript to answer
  useEffect(() => {
    if (transcript) {
      setAnswer(transcript);
    }
  }, [transcript]);

  // Handle voice input toggle
  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      // Stop any ongoing speech synthesis before listening
      stop();
      resetTranscript();
      startListening();
      toast.success("Listening... Speak your answer");
    }
  };

  // Show speech recognition errors
  useEffect(() => {
    if (speechError) {
      toast.error(speechError);
    }
  }, [speechError]);

  // Auto-read question when it changes (first load or new question)
  useEffect(() => {
    if (currentQuestion?.questionText && isSupported && !fetchingData) {
      // Small delay to ensure component is fully rendered
      const timer = setTimeout(() => {
        speak(`Question ${currentQuestion.order}. ${currentQuestion.questionText}`, {
          rate: 0.9,
          pitch: 1,
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestion?._id, isSupported, fetchingData]);

  // Handle reading the question aloud
  const handleReadQuestion = () => {
    if (!currentQuestion?.questionText) return;
    
    if (isSpeaking && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      speak(`Question ${currentQuestion.order}. ${currentQuestion.questionText}`, {
        rate: 0.9,
        pitch: 1,
      });
    }
  };

  // Stop speech when question changes or component unmounts
  useEffect(() => {
    return () => stop();
  }, [currentQuestion, stop]);

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
                className="bg-[#1e3a5f] h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* AI Interviewer Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Avatar3D isSpeaking={isSpeaking} />
              <div className="p-4 text-center border-t">
                <h3 className="font-semibold text-gray-800">AI Interviewer</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {isSpeaking ? (
                    <span className="flex items-center justify-center gap-2 text-[#1e3a5f]">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1e3a5f] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1e3a5f]"></span>
                      </span>
                      Speaking...
                    </span>
                  ) : (
                    "Ready to listen"
                  )}
                </p>
                {/* Voice Controls */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  {isSupported && (
                    <button
                      onClick={handleReadQuestion}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isSpeaking
                          ? "bg-[#1e3a5f]/10 text-[#1e3a5f] hover:bg-[#1e3a5f]/20"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title={isSpeaking ? (isPaused ? "Resume reading" : "Pause reading") : "Read question aloud"}
                    >
                      {isSpeaking ? (
                        isPaused ? (
                          <><LuVolume2 className="text-lg" /> Resume</>
                        ) : (
                          <><LuPause className="text-lg" /> Pause</>
                        )
                      ) : (
                        <><LuVolume2 className="text-lg" /> Ask Question</>
                      )}
                    </button>
                  )}
                  {isSpeaking && (
                    <button
                      onClick={stop}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                      title="Stop reading"
                    >
                      <LuVolumeX className="text-lg" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-block bg-[#1e3a5f]/10 text-[#1e3a5f] px-3 py-1 rounded-full text-sm font-medium">
                    Question {currentQuestion.order}
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
                  {currentQuestion.questionText}
                </h2>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Your Answer
                  </label>
                  {isSpeechRecognitionSupported && (
                    <button
                      onClick={handleVoiceInput}
                      disabled={loading || isSpeaking}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isListening
                          ? "bg-red-100 text-red-600 hover:bg-red-200 animate-pulse"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={isListening ? "Stop listening" : "Speak your answer"}
                    >
                      {isListening ? (
                        <><LuMicOff className="text-lg" /> Stop Recording</>
                      ) : (
                        <><LuMic className="text-lg" /> Speak Answer</>
                      )}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <textarea
                    value={isListening ? answer + interimTranscript : answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={isListening ? "Listening... speak now" : "Type your answer here or click 'Speak Answer' to use voice input..."}
                    className={`w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent resize-none transition-all ${
                      isListening 
                        ? "border-green-400 bg-green-50" 
                        : "border-gray-300"
                    }`}
                    disabled={loading || isListening}
                  />
                  {isListening && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="text-xs text-red-600 font-medium">Recording...</span>
                    </div>
                  )}
                </div>
                {interimTranscript && isListening && (
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Hearing: "{interimTranscript}"
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={loading || !answer.trim() || isListening}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg hover:bg-[#152d4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LuSend className="text-xl" />
                  {loading ? "Submitting..." : "Submit Answer"}
                </button>
                {answer && (
                  <button
                    onClick={() => {
                      setAnswer("");
                      resetTranscript();
                    }}
                    disabled={loading || isListening}
                    className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    title="Clear answer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
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
