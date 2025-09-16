import React, { useState, useEffect } from 'react';

// --- SVG Icons (can be moved to a separate icons file if preferred) ---
const MicIcon = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0m14 0a7 7 0 11-14 0m14 0v2a7 7 0 01-14 0v-2m14 0H5m19 11V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m7 11a2 2 0 01-2-2v-2a2 2 0 012-2h0a2 2 0 012 2v2a2 2 0 01-2 2h0z" />
  </svg>
);

const XIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Main Mic Component ---
const Mic = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [statusText, setStatusText] = useState("Click the mic to start");

  // Simulate transcription and AI reply
  useEffect(() => {
    let listenTimer;
    let replyTimer;

    if (isListening) {
      setStatusText("Listening...");
      setTranscript("");
      setAiReply("");
      
      listenTimer = setTimeout(() => {
        const dummyTranscript = "Could you show me the latest trends in pottery for home decor?";
        setTranscript(dummyTranscript);
        setStatusText("Thinking...");
        setIsListening(false);

        replyTimer = setTimeout(() => {
          setAiReply("Of course! Terracotta and rustic finishes are very popular. I'm pulling up a trend report for you now.");
          setStatusText("Click the mic to start");
        }, 1500); // Simulate AI thinking time

      }, 3000); // Simulate listening time
    }

    return () => {
      clearTimeout(listenTimer);
      clearTimeout(replyTimer);
    };
  }, [isListening]);

  const handleMicClick = () => {
    if (!isListening) {
      setIsListening(true);
    }
  };

  return (
    <>
      {/* --- Floating Action Button --- */}
      <button
        onClick={() => setIsPanelOpen(true)}
        className={`fixed bottom-8 right-8 z-[99] bg-google-blue text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl focus:outline-none ${isPanelOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
        aria-label="Open AI Assistant"
      >
        <MicIcon />
      </button>

      {/* --- AI Assistant Panel --- */}
      <div
        className={`fixed bottom-8 right-8 z-[100] w-[90vw] max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out ${isPanelOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
          <h3 className="font-bold text-gray-800 text-lg">KalaGhar AI Assistant</h3>
          <button onClick={() => setIsPanelOpen(false)} className="text-gray-500 hover:text-gray-800">
            <XIcon />
          </button>
        </div>

        {/* Content Body */}
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

          {/* Mic Button and Status */}
          <div className="flex flex-col items-center justify-center pt-4">
            <button
              onClick={handleMicClick}
              disabled={isListening}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300 ${isListening ? 'bg-red-500' : 'bg-google-blue hover:bg-google-blue/90'} focus:outline-none focus:ring-4 focus:ring-google-blue/30`}
            >
              <MicIcon className="w-10 h-10 text-white" />
              {isListening && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              )}
            </button>
            <p className="mt-4 text-gray-600 text-sm font-medium">{statusText}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mic;