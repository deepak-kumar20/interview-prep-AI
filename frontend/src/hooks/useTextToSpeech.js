import { useState, useEffect, useCallback, useRef } from "react";

const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    if ("speechSynthesis" in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Select a default English voice
        const englishVoice = availableVoices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            (voice.name.includes("Google") || voice.name.includes("Microsoft"))
        );
        setSelectedVoice(englishVoice || availableVoices[0]);
      };

      // Load voices immediately
      loadVoices();

      // Chrome requires this event listener
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  const speak = useCallback(
    (text, options = {}) => {
      if (!isSupported || !text) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Set voice
      if (options.voice) {
        utterance.voice = options.voice;
      } else if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Set speech parameters
      utterance.rate = options.rate || 1; // 0.1 to 10
      utterance.pitch = options.pitch || 1; // 0 to 2
      utterance.volume = options.volume || 1; // 0 to 1

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, selectedVoice]
  );

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isSupported, isPaused]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [isSupported]);

  const toggle = useCallback(
    (text, options = {}) => {
      if (isSpeaking && !isPaused) {
        pause();
      } else if (isPaused) {
        resume();
      } else {
        speak(text, options);
      }
    },
    [isSpeaking, isPaused, speak, pause, resume]
  );

  return {
    speak,
    pause,
    resume,
    stop,
    toggle,
    isSpeaking,
    isPaused,
    voices,
    selectedVoice,
    setSelectedVoice,
    isSupported,
  };
};

export default useTextToSpeech;
