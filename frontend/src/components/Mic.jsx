import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig'; // Adjust path if needed

// --- Import Icons ---
import { GoogleMicIcon, XIcon } from './common/Icons'; // Adjust path if needed

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const Mic = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [aiReply, setAiReply] = useState("");
    const [statusText, setStatusText] = useState("Tap the mic to start");
    const [showSpeakHint, setShowSpeakHint] = useState(true);

    const recognitionRef = useRef(null);
    const panelContentRef = useRef(null); // Ref for scrolling

    // Hide hint after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowSpeakHint(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    // Setup Speech Recognition
    useEffect(() => {
        if (!SpeechRecognition) {
            console.error("SpeechRecognition API not supported in this browser.");
            setStatusText("Voice recognition not supported.");
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.continuous = false; // Process after each pause
        recognition.lang = 'en-US';
        recognition.interimResults = true; // Show results as they come in

        recognition.onstart = () => {
            setIsListening(true);
            setStatusText("Listening...");
        };

        recognition.onend = () => {
            setIsListening(false);
            // Don't reset status immediately if thinking, wait for API response or error
            if (statusText === "Listening...") {
                setStatusText("Tap the mic to start");
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
            let errorMessage = "Sorry, I didn't catch that."; // Simpler default
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                errorMessage = "Microphone access denied.";
            } else if (event.error === 'no-speech') {
                errorMessage = "Didn't hear anything.";
            } else if (event.error === 'network') {
                errorMessage = "Network error. Please try again.";
            }
            setStatusText(errorMessage);
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
                    await new Promise(resolve => setTimeout(resolve, 300));
                    const response = await api.post('/ai/assistant', { prompt: currentTranscript });
                    
                    // OLD CODE:
                    // const replyText = response.data.reply;

                    // NEW CODE:
                    const { reply, language } = response.data; // Destructure the new response object
                    
                    setAiReply(reply);
                    setStatusText("Tap the mic to start");

                    // OLD CALL:
                    // speak(replyText);

                    // NEW CALL:
                    if (reply && language) {
                        playAudio(reply, language); // Play audio in the correct language
                    }
                    
                } catch (error) {
                    const errorMessage = "Sorry, I had trouble responding.";
                    setAiReply(errorMessage);
                    setStatusText("Tap the mic to start");
                    
                    // Speak the error message in a default language (e.g., English)
                    playAudio(errorMessage, 'en-US'); 
                    
                    console.error("AI Assistant API error:", error);
                }
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusText]); // Rerun setup if statusText changes (mainly for reset logic)

    // Text-to-Speech function
const playAudio = async (text, languageCode) => {
    try {
        // Call our new backend endpoint
        const response = await api.post('/ai/synthesize-speech', {
            text,
            languageCode
        });
        
        const { audioContent } = response.data;
        if (!audioContent) return;

        // Decode the Base64 string and play the audio
        const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
        audio.play();

    } catch (error) {
        console.error("Error playing synthesized speech:", error);
        // Handle error, maybe show a message to the user
    }
};

    // Toggle listening state
    const handleMicClick = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setTranscript(""); // Clear previous transcript
            setAiReply("");   // Clear previous reply
            recognitionRef.current.start();
        }
    };

    // Close the panel and stop listening/speaking
    const closePanel = () => {
        setIsPanelOpen(false);
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setStatusText("Tap the mic to start"); // Reset status on close
    };

    // Auto-scroll chat area
    useEffect(() => {
        if (panelContentRef.current) {
            panelContentRef.current.scrollTop = panelContentRef.current.scrollHeight;
        }
    }, [transcript, aiReply]);

    return (
        <>
            {/* --- Floating Action Button (FAB) --- */}
            <div className="fixed bottom-6 right-6 z-[90]">
                {showSpeakHint && !isPanelOpen && (
                    <div className="absolute bottom-full right-0 mb-2 w-max bg-gray-700 text-white px-3 py-1 rounded-md shadow-lg text-xs font-medium animate-fade-in-down">
                        Speak to me ✨
                    </div>
                )}
                <button
                    onClick={() => setIsPanelOpen(true)}
                    // Increased size (w-18 h-18) and added border
                    className={`bg-white w-18 h-18 rounded-2xl flex items-center justify-center shadow-lg border border-gray-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-blue transform transition-all duration-300 ease-in-out hover:scale-105 ${isPanelOpen ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100'}`}
                    aria-label="Open AI Assistant"
                >
                    {/* Increased icon size */}
                    <GoogleMicIcon className="w-8 h-8" isListening={true} />
                </button>
            </div>

            {/* --- Assistant Panel (Bottom Sheet Style) --- */}
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[95] bg-black/30 transition-opacity duration-300 ease-in-out ${isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closePanel}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-[100] w-full max-w-xl mx-auto bg-white rounded-t-2xl shadow-2xl overflow-hidden transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ maxHeight: '75vh' }} // Limit height
            >
                {/* Panel Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-700 text-base">AI Assistant</h3>
                    <button onClick={closePanel} className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Panel Content (Scrollable Chat + Fixed Mic Button) */}
                <div className="h-[60vh] flex flex-col"> {/* Fixed height for content area */}
                    {/* Chat/Transcript Area */}
                    <div ref={panelContentRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                        {/* User transcript bubble */}
                        {transcript && (
                            <div className="flex justify-end">
                                <div className="bg-google-blue text-white p-3 rounded-xl rounded-br-none max-w-[80%]">
                                    <p className="text-sm">{transcript}</p>
                                </div>
                            </div>
                        )}
                        {/* AI reply bubble */}
                        {aiReply && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 p-3 rounded-xl rounded-bl-none max-w-[80%]">
                                    <p className="text-sm">{aiReply}</p>
                                </div>
                            </div>
                        )}
                        {/* Thinking indicator */}
                        {statusText === "Thinking..." && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-500 p-3 rounded-xl rounded-bl-none inline-flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mic Button Area */}
                    <div className="flex flex-col items-center justify-center p-4 border-t border-gray-200 bg-white">
                        <button
                            onClick={handleMicClick}
                            disabled={!SpeechRecognition}
                            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-google-blue/30 disabled:opacity-50 ${isListening ? 'bg-white shadow-inner' : 'bg-white shadow-md hover:shadow-lg'}`}
                            aria-label={isListening ? "Stop listening" : "Start listening"}
                        >
                            <GoogleMicIcon className="w-8 h-8" isListening={isListening} />
                            {/* Optional pulse when listening */}
                            {isListening && (
                                <span className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></span>
                            )}
                        </button>
                        <p className="mt-3 text-gray-500 text-xs font-medium text-center h-4"> {/* Fixed height */}
                            {statusText}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Mic;