import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig';

const MicIcon = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zM19 10a1 1 0 112 0 7 7 0 01-14 0 1 1 0 112 0 5 5 0 0010 0zM12 21a7 7 0 007-7h-2a5 5 0 01-10 0H5a7 7 0 007 7z"/>
  </svg>
);
const XIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const Mic = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [statusText, setStatusText] = useState("Click the mic to start");
  const [showSpeakHint, setShowSpeakHint] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpeakHint(false), 120000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.error("SpeechRecognition API not supported in this browser.");
      setStatusText("Voice recognition not supported.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setStatusText("Listening...");
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatusText("Click the mic to start");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);

      let errorMessage = event.error;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMessage = "Microphone access denied. Please allow it in your browser settings and ensure you are on a secure (HTTPS) connection.";
      } else if (event.error === 'no-speech') {
        errorMessage = "No speech was detected. Please try again.";
      } else if (event.error === 'network') {
        errorMessage = "Network error. Ensure you are on HTTPS and have a stable connection.";
      }
      
      setStatusText(`Error: ${errorMessage}`);
    };

    recognition.onresult = async (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setTranscript(currentTranscript);

      if (event.results[0].isFinal) {
        setStatusText("Thinking...");
        try {
          const response = await api.post('/ai/assistant', { prompt: currentTranscript });
          const replyText = response.data.reply;
          setAiReply(replyText);
          speak(replyText);
        } catch (error) {
          const errorMessage = "Sorry, I had a problem responding.";
          setAiReply(errorMessage);
          speak(errorMessage);
          console.error("AI Assistant API error:", error);
        }
      }
    };
  }, []);


  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
        return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      setAiReply("");
      recognitionRef.current.start();
    }
  };
  
  const closePanel = () => {
    setIsPanelOpen(false);
    if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
  }

  return (
    <>
      <div className="relative">
        {showSpeakHint && (
          <div className="fixed bottom-28 right-8 bg-google-yellow text-white px-4 py-2 rounded-full shadow-lg animate-bounce text-sm font-semibold z-50">
            Speak to me 🎤
          </div>
        )}
        <button
          onClick={() => setIsPanelOpen(true)}
          className={`fixed bottom-8 right-8 z-[99] bg-google-blue text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl focus:outline-none ${isPanelOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
          aria-label="Open AI Assistant"
        >
          <MicIcon />
        </button>
      </div>

      <div
        className={`fixed bottom-8 right-8 z-[100] w-[90vw] max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out ${isPanelOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
          <h3 className="font-bold text-gray-800 text-lg">KalaGhar AI Assistant</h3>
          <button onClick={closePanel} className="text-gray-500 hover:text-gray-800">
            <XIcon />
          </button>
        </div>
        <div className="p-6 space-y-4 h-80 flex flex-col">
          <div className="flex-grow overflow-y-auto space-y-4">
            {transcript && (
              <div className="p-3 bg-google-blue/10 rounded-lg text-right">
                <p className="text-sm font-semibold text-google-blue mb-1">You said:</p>
                <p className="text-gray-700">{transcript}</p>
              </div>
            )}
            {aiReply && (
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 mb-1">AI Replied:</p>
                <p className="text-gray-800">{aiReply}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center pt-4">
            <button
              onClick={handleMicClick}
              disabled={!SpeechRecognition}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300 ${isListening ? 'bg-red-500' : 'bg-google-blue hover:bg-google-blue/90'} focus:outline-none focus:ring-4 focus:ring-google-blue/30 disabled:bg-gray-400`}
            >
              <MicIcon className="w-10 h-10 text-white" />
              {isListening && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              )}
            </button>
            <p className="mt-4 text-gray-600 text-sm font-medium text-center">{statusText}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mic;