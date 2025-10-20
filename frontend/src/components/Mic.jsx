import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig'; // Adjust path if needed

// --- Import Icons ---
import { GoogleMicIcon, XIcon } from './common/Icons'; // Adjust path if needed

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const Mic = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    // State is now a single array to hold the entire conversation
    const [messages, setMessages] = useState([]);
    const [statusText, setStatusText] = useState("Tap the mic to start");
    const [showSpeakHint, setShowSpeakHint] = useState(true);
    const audioRef = useRef(null);
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
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
            setStatusText("Listening...");
        };

        recognition.onend = () => {
            setIsListening(false);
            if (statusText === "Listening...") {
                setStatusText("Tap the mic to start");
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
            let errorMessage = "Sorry, I didn't catch that.";
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

            // Once speech is final, update the conversation
            if (event.results[0].isFinal) {
                // Add the user's message to the chat history
                setMessages(prev => [...prev, { role: 'user', text: currentTranscript }]);
                setStatusText("Thinking...");
                try {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    const response = await api.post('/ai/assistant', { prompt: currentTranscript });
                    const { reply, language } = response.data;

                    // Add the AI's response to the chat history
                    setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
                    setStatusText("Tap the mic to start");
                    
                    if (reply && language) {
                        playAudio(reply, language);
                    }
                } catch (error) {
                    const errorMessage = "Sorry, I had trouble responding.";
                    // Add the error message to the chat history for visibility
                    setMessages(prev => [...prev, { role: 'assistant', text: errorMessage, isError: true }]);
                    setStatusText("Tap the mic to start");
                    playAudio(errorMessage, 'en-US');
                    console.error("AI Assistant API error:", error);
                }
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusText]);

    // Function to call the backend for Text-to-Speech
    const playAudio = async (text, languageCode) => {
        if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset the audio to the beginning
    }
        try {
            const response = await api.post('/ai/synthesize-speech', {
                text,
                languageCode
            });
            const { audioContent } = response.data;
            if (!audioContent) return;
            const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
            audioRef.current = audio;
            audio.play();
        } catch (error) {
            console.error("Error playing synthesized speech:", error);
        }
    };

    // Toggle listening state
    const handleMicClick = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
            // No need to clear messages for a continuous conversation
            recognitionRef.current.start();
        }
    };

    // Close the panel and stop any activity
    const closePanel = () => {
        setIsPanelOpen(false);
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
        if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
        // This function to stop audio playback is not standard, but good practice if available
        // Or you would need to manage the Audio object in state to pause/stop it.
        // For Google TTS, this stop is handled by the browser/OS.
        setStatusText("Tap the mic to start");
    };

    // Auto-scroll chat area whenever new messages are added
    useEffect(() => {
        if (panelContentRef.current) {
            panelContentRef.current.scrollTop = panelContentRef.current.scrollHeight;
        }
    }, [messages]);

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
                    onClick={() => {
                        setIsPanelOpen(true);
                        // Optionally clear history when opening panel for a fresh start
                        // setMessages([]); 
                    }}
                    className={`bg-white w-18 h-18 rounded-2xl flex items-center justify-center shadow-lg border border-gray-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-blue transform transition-all duration-300 ease-in-out hover:scale-105 ${isPanelOpen ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100'}`}
                    aria-label="Open AI Assistant"
                >
                    <GoogleMicIcon className="w-8 h-8" isListening={true} />
                </button>
            </div>

            {/* --- Assistant Panel (Bottom Sheet Style) --- */}
            <div
                className={`fixed inset-0 z-[95] bg-black/30 transition-opacity duration-300 ease-in-out ${isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closePanel}
                aria-hidden="true"
            />
            <div
                className={`fixed bottom-0 left-0 right-0 z-[100] w-full max-w-xl mx-auto bg-white rounded-t-2xl shadow-2xl overflow-hidden transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ maxHeight: '75vh' }}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-700 text-base">AI Assistant</h3>
                    <button onClick={closePanel} className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="h-[60vh] flex flex-col">
                    <div ref={panelContentRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                        {/* Render the conversation history from the messages array */}
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-xl max-w-[80%] ${
                                    msg.role === 'user'
                                        ? 'bg-google-blue text-white rounded-br-none'
                                        : msg.isError
                                            ? 'bg-red-100 text-red-800 rounded-bl-none'
                                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                }`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        
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

                    <div className="flex flex-col items-center justify-center p-4 border-t border-gray-200 bg-white">
                        <button
                            onClick={handleMicClick}
                            disabled={!SpeechRecognition}
                            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-google-blue/30 disabled:opacity-50 ${isListening ? 'bg-white shadow-inner' : 'bg-white shadow-md hover:shadow-lg'}`}
                            aria-label={isListening ? "Stop listening" : "Start listening"}
                        >
                            <GoogleMicIcon className="w-8 h-8" isListening={isListening} />
                            {isListening && (
                                <span className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></span>
                            )}
                        </button>
                        <p className="mt-3 text-gray-500 text-xs font-medium text-center h-4">
                            {statusText}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Mic;