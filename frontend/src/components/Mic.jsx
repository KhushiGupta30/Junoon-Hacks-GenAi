import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig'; // Adjust path if needed
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMicIcon, XIcon } from './common/Icons'; // Adjust path if needed

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// --- Animation Variants (Unchanged) ---
const fabHintVariants = { hidden: { opacity: 0, scale: 0.5, y: 10 }, visible: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0, y: 10 } };
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
const panelVariants = { hidden: { y: "100vh", opacity: 0 }, visible: { y: 0, opacity: 1 }, exit: { y: "100vh", opacity: 0 } };
const messageVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, x: -20 } };

const Mic = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([]);
    const [statusText, setStatusText] = useState("Tap the mic to start");
    const [showSpeakHint, setShowSpeakHint] = useState(true);
    const audioRef = useRef(new Audio());
    const recognitionRef = useRef(null);
    const panelContentRef = useRef(null);

    // Setup Speech Recognition
    useEffect(() => {
        if (!SpeechRecognition) {
            console.error("SpeechRecognition API not supported.");
            setStatusText("Voice recognition not supported.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = true;

        recognition.onstart = () => { setIsListening(true); setStatusText("Listening..."); };
        recognition.onend = () => { setIsListening(false); if (statusText === "Listening...") setStatusText("Tap the mic to start"); };
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
            let msg = "Sorry, I didn't catch that.";
            if (event.error === 'not-allowed') msg = "Microphone access denied.";
            if (event.error === 'no-speech') msg = "Didn't hear anything.";
            setStatusText(msg);
        };

        recognition.onresult = async (event) => {
            const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
            if (event.results[0].isFinal) {
                setMessages(prev => [...prev, { role: 'user', text: transcript }]);
                setStatusText("Thinking...");
                try {
                    const response = await api.post('/ai/assistant', { prompt: transcript });

                    // --- THIS IS THE ROBUSTNESS FIX ---
                    // Check if the response.data exists and has the properties we need.
                    if (response.data && response.data.reply && response.data.language) {
                        const { reply, language } = response.data;
                        setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
                        playAudio(reply, language);
                    } else {
                        // Handle cases where the backend might send an unexpected response
                        throw new Error("Invalid response structure from AI assistant.");
                    }

                } catch (error) {
                    const errorMessage = "Sorry, I had trouble responding.";
                    setMessages(prev => [...prev, { role: 'assistant', text: errorMessage, isError: true }]);
                    playAudio(errorMessage, 'en-US');
                    console.error("AI Assistant API error:", error);
                } finally {
                    setStatusText("Tap the mic to start");
                }
            }
        };
        recognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusText]);

    const playAudio = async (text, languageCode) => {
        const audio = audioRef.current;
        if (audio) { audio.pause(); audio.currentTime = 0; }
        try {
            const response = await api.post('/ai/synthesize-speech', { text, languageCode });
            if (response.data && response.data.audioContent) {
                audio.src = `data:audio/mp3;base64,${response.data.audioContent}`;
                audio.play();
            }
        } catch (error) {
            console.error("Error playing synthesized speech:", error);
        }
    };

    const handleMicClick = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
            recognitionRef.current.start();
        }
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        if (recognitionRef.current && isListening) recognitionRef.current.stop();
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        setStatusText("Tap the mic to start");
    };

    useEffect(() => {
        if (panelContentRef.current) {
            panelContentRef.current.scrollTop = panelContentRef.current.scrollHeight;
        }
    }, [messages]);
    
    // The JSX for rendering remains exactly the same.
    return (
        <>
            {/* --- Floating Action Button (FAB) --- */}
            <div className="fixed bottom-6 right-6 z-[90]">
                <AnimatePresence>
                    {showSpeakHint && !isPanelOpen && (
                        <motion.div
                            variants={fabHintVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute bottom-full right-0 mb-2 w-max bg-gray-700 text-white px-3 py-1 rounded-md shadow-lg text-xs font-medium"
                        >
                            Speak to me ✨
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                {!isPanelOpen && (
                    <motion.button
                        onClick={() => setIsPanelOpen(true)}
                        variants={fabHintVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-white w-18 h-18 rounded-2xl flex items-center justify-center shadow-lg border border-gray-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-blue"
                        aria-label="Open AI Assistant"
                    >
                        <GoogleMicIcon className="w-8 h-8" isListening={true} />
                    </motion.button>
                )}
                </AnimatePresence>
            </div>

            {/* --- Assistant Panel (Bottom Sheet Style) --- */}
            
            <AnimatePresence>
                {isPanelOpen && (
                    <>
                        <motion.div
                            variants={backdropVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed inset-0 z-[95] bg-black/30"
                            onClick={closePanel}
                            aria-hidden="true"
                        />
                        <motion.div
                            variants={panelVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ type: "spring", damping: 40, stiffness: 400 }}
                            className="fixed bottom-0 left-0 right-0 z-[100] w-full max-w-xl mx-auto bg-white rounded-t-2xl shadow-2xl overflow-hidden"
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
                                    <AnimatePresence>
                                        {messages.map((msg, index) => (
                                            <motion.div
                                                key={index}
                                                variants={messageVariants}
                                                layout
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`p-3 rounded-xl max-w-[80%] ${
                                                    msg.role === 'user'
                                                        ? 'bg-google-blue text-white rounded-br-none'
                                                        : msg.isError
                                                            ? 'bg-red-100 text-red-800 rounded-bl-none'
                                                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                                }`}>
                                                    <p className="text-sm">{msg.text}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    
                                    {statusText === "Thinking..." && (
                                        <motion.div 
                                            variants={messageVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="flex justify-start"
                                        >
                                            <div className="bg-gray-100 text-gray-500 p-3 rounded-xl rounded-bl-none inline-flex items-center space-x-2">
                                                <motion.span
                                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                                    animate={{ y: [0, -4, 0] }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                                />
                                                <motion.span
                                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                                    animate={{ y: [0, -4, 0] }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                                                />
                                                <motion.span
                                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                                    animate={{ y: [0, -4, 0] }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="flex flex-col items-center justify-center p-4 border-t border-gray-200 bg-white">
                                    <motion.button 
                                        onClick={handleMicClick}
                                        disabled={!SpeechRecognition}
                                        whileTap={{ scale: isListening ? 1 : 0.9 }} 
                                        className={`relative w-16 h-16 rounded-full flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-google-blue/30 disabled:opacity-50 ${isListening ? 'bg-white shadow-inner' : 'bg-white shadow-md hover:shadow-lg'}`}
                                        aria-label={isListening ? "Stop listening" : "Start listening"}
                                    >
                                        <GoogleMicIcon className="w-8 h-8" isListening={isListening} />
                                        {isListening && (
                                            <motion.span
                                                className="absolute inset-0 rounded-full border-4 border-blue-200"
                                                animate={{
                                                    scale: [1, 1.4, 1],
                                                    opacity: [0.5, 1, 0.5]
                                                }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                        )}
                                    </motion.button>
                                    <p className="mt-3 text-gray-500 text-xs font-medium text-center h-4">
                                        {statusText}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Mic;