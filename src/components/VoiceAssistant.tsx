import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Loader2, Volume2, Languages, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getVoiceAssistantResponse } from "@/src/lib/gemini";
import { cn } from "@/src/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function VoiceAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hello! I am your Smart Krishi Assistant. How can I help you today?", sender: "ai", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("English");
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text, sender: "user", timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await getVoiceAssistantResponse(text, language);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), text: response, sender: "ai", timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      speak(response);
    } catch (err) {
      console.error(err);
      setError("Failed to get response from AI assistant.");
    } finally {
      setLoading(false);
    }
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop any current speaking
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const startListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    setError(null);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Please try using Google Chrome or Microsoft Edge.");
      return;
    }

    // Check Permissions API if available
    if (navigator.permissions && (navigator.permissions as any).query) {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as any });
        if (result.state === 'denied') {
          setError("Microphone access is permanently blocked. \n\nTo fix this:\n1. Click the 'Lock' icon in the address bar.\n2. Reset the 'Microphone' permission to 'Allow'.\n3. Refresh the page.");
          return;
        }
      } catch (e) {
        console.warn("Permissions API check failed", e);
      }
    }

    // Try to request microphone access explicitly
    try {
      if (!window.isSecureContext) {
        throw new Error("Microphone access requires a secure (HTTPS) connection.");
      }
      
      // Use a timeout for the permission request to handle cases where it hangs
      const streamPromise = navigator.mediaDevices.getUserMedia({ audio: true });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Permission request timed out. Please check if a prompt is hidden behind other windows.")), 10000)
      );
      
      const stream = await Promise.race([streamPromise, timeoutPromise]) as MediaStream;
      
      // Immediately stop the stream
      stream.getTracks().forEach(track => track.stop());
    } catch (err: any) {
      console.error("Microphone access error:", err);
      let msg = "Microphone access denied.";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError" || err.message?.toLowerCase().includes("denied")) {
        msg = "Microphone access is blocked by your browser.\n\nSTEPS TO FIX:\n1. Look at the top-right or top-left of your browser address bar.\n2. Click the 'Camera/Mic' or 'Lock' icon.\n3. Select 'Always allow' or 'Allow'.\n4. REFRESH this page to apply changes.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        msg = "No microphone was detected. Please ensure your microphone is properly connected and recognized by your computer.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        msg = "Your microphone is already in use by another application. Please close other apps using the mic and try again.";
      } else {
        msg = "Could not access microphone: " + err.message;
      }
      
      setError(msg);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language === "Hindi" ? "hi-IN" : language === "Marathi" ? "mr-IN" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        setError("Microphone access was denied during recognition. Please ensure permissions are set to 'Allow' in your browser settings.");
      } else if (event.error === "no-speech") {
        setError("No speech was detected. Please speak clearly and ensure your microphone is working.");
      } else if (event.error === "audio-capture") {
        setError("Could not capture audio. Please check your microphone connection.");
      } else if (event.error === "network") {
        setError("A network error occurred. Speech recognition requires an active internet connection.");
      } else {
        setError("Speech recognition error: " + event.error);
      }
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start recognition:", err);
      setError("Failed to start speech recognition. Please refresh and try again.");
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-surface border border-border rounded-[24px] shadow-polish overflow-hidden">
      {/* Language Selector */}
      <div className="px-6 py-4 bg-surface border-b border-border flex justify-between items-center">
        <div className="flex items-center gap-2 text-text-muted">
          <Languages size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Language</span>
        </div>
        <div className="flex gap-2">
          {["English", "Hindi", "Marathi"].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[11px] font-bold transition-all",
                language === lang ? "bg-primary text-white shadow-sm" : "bg-bg text-text-muted hover:bg-slate-100"
              )}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FAFAFA]">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
              "max-w-[85%] p-5 rounded-[20px] shadow-sm",
              msg.sender === "user" 
                ? "bg-primary text-white ml-auto rounded-tr-none" 
                : "bg-white text-text mr-auto rounded-tl-none border border-border"
            )}
          >
            <p className="text-sm leading-relaxed">{msg.text}</p>
            <div className={cn(
              "text-[10px] mt-3 opacity-60 font-medium",
              msg.sender === "user" ? "text-right" : "text-left"
            )}>
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="bg-white border border-border p-5 rounded-[20px] rounded-tl-none mr-auto shadow-sm flex items-center gap-3">
            <Loader2 size={18} className="animate-spin text-primary" />
            <span className="text-sm text-text-muted font-medium">Assistant is thinking...</span>
          </div>
        )}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-5 bg-red-50 border border-red-100 rounded-xl space-y-3"
            >
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-red-700 text-xs font-bold leading-tight">Microphone Error</p>
                  <p className="text-red-600 text-[11px] leading-relaxed whitespace-pre-line">
                    {error}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setError(null)}
                className="w-full py-2 bg-white border border-red-100 text-red-600 text-[10px] font-bold rounded-lg hover:bg-red-50 transition-colors"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-surface border-t border-border space-y-5">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
            className="flex-1 bg-bg border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all text-text"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loading}
            className="p-4 bg-primary text-white rounded-xl disabled:opacity-50 active:scale-95 transition-all shadow-sm"
          >
            <Send size={20} />
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={startListening}
            disabled={isListening || loading}
            className={cn(
              "flex items-center gap-3 px-10 py-4 rounded-full font-bold shadow-lg transition-all active:scale-95",
              isListening 
                ? "bg-red-500 text-white animate-pulse" 
                : "bg-primary text-white shadow-primary/10"
            )}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            <span>{isListening ? "Listening..." : "Tap to Speak"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
