import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceAgent() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [aiState, setAiState] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Initialize Speech APIs
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          stopRecording();
          toast({
            title: "Microphone Error",
            description: "Please check your microphone permissions.",
            variant: "destructive"
          });
        };
      }
    }

    return () => {
      stopRecording();
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeElapsed(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Silence detection logic
  useEffect(() => {
    if (isRecording && transcript.trim().length > 2) {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

      silenceTimeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsRecording(false);
        setIsProcessing(true);
        processWithGroq(transcript);
      }, 2500);
    }
    return () => {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    };
  }, [transcript, isRecording]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const processWithGroq = async (text: string) => {
    try {
      setAiState("thinking");
      // Use the Groq API (we know it's available via VITE_GROQ_API_KEY from the chat bot)
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) throw new Error("Groq API key missing");

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are an AI assistant designed to act as an interviewer for Mian Khan, an AI/ML Engineer. The user is a recruiter or hiring manager asking you questions about Mian. Keep your responses VERY brief (1-3 sentences max) so they sound natural when spoken out loud. Be confident, professional, and highly praise Mian's skills in GenAI, LangGraph, and Production ML."
            },
            { role: "user", content: text }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      const data = await response.json();
      const reply = data.choices[0].message.content;
      speakResponse(reply);
    } catch (error) {
      console.error(error);
      setAiState("idle");
      toast({
        title: "Connection Error",
        description: "Failed to connect to the AI brain.",
        variant: "destructive"
      });
    }
  };

  const speakResponse = (text: string) => {
    if (!synthRef.current) return;

    setAiState("speaking");
    const utterance = new SpeechSynthesisUtterance(text);

    // Try to find a good voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Natural")) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.rate = 1.05;
    utterance.pitch = 1;

    utterance.onend = () => {
      // Resume listening after speaking
      setAiState("idle");
      setTranscript("");
      // We can automatically resume listening here if desired, but requiring a tap is safer for UX.
    };

    synthRef.current.speak(utterance);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Browser Unsupported",
        description: "Your browser does not support voice recognition. Try Chrome.",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      // Stop and process
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);

      if (transcript.trim().length > 2) {
        processWithGroq(transcript);
      } else {
        setAiState("idle");
        setIsProcessing(false);
      }
    } else {
      // Start recording
      if (synthRef.current) synthRef.current.cancel(); // stop current speech
      setTranscript("");
      setAiState("listening");
      setIsRecording(true);
      setIsProcessing(false);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setAiState("idle");
  };

  return (
    <section className="py-32 bg-[#FAF9FF] relative overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 mb-8"
        >
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">Interactive Voice Agent</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900"
        >
          Interview me.<br />
          <span className="text-blue-600 font-serif italic font-normal">Live via Voice AI.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed mb-20"
        >
          Tap the microphone and ask my AI agent anything about my experience, tech stack, or problem-solving approach. It has full context of my professional background.
        </motion.p>

        {/* VOICE UI */}
        <div className="relative flex flex-col items-center justify-center mt-12 mb-12 h-64">

          {/* Pulsating Rings (Active State) */}
          <AnimatePresence>
            {isRecording && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 2 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute w-24 h-24 rounded-full border border-red-500/20 bg-red-500/5"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 2.5 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, ease: "linear" }}
                  className="absolute w-24 h-24 rounded-full border border-red-500/10"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 3 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 1.5, delay: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute w-24 h-24 rounded-full border border-red-500/5"
                />
              </>
            )}
          </AnimatePresence>

          {/* AI Speaking Waves */}
          <AnimatePresence>
            {aiState === "speaking" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center gap-2"
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ["20%", "80%", "20%"] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                    className="w-2 bg-blue-500/20 rounded-full"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Button */}
          <motion.button
            onClick={toggleRecording}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative z-20 w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isRecording
              ? "bg-red-500 shadow-red-500/40"
              : aiState === "speaking"
                ? "bg-blue-500 shadow-blue-500/40"
                : "bg-white border-2 border-slate-100 shadow-blue-900/5 hover:border-blue-200"
              }`}
          >
            {aiState === "thinking" ? (
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            ) : isRecording ? (
              <X className="w-10 h-10 text-white" />
            ) : (
              <Mic className={`w-10 h-10 ${aiState === "speaking" ? "text-white" : "text-blue-600"}`} />
            )}
          </motion.button>

          {/* Status / Timer */}
          <div className="absolute -bottom-16 w-full text-center">
            {isRecording ? (
              <div className="flex items-center justify-center gap-2 text-red-500 font-mono font-medium">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {formatTime(timeElapsed)}
              </div>
            ) : aiState === "thinking" ? (
              <div className="text-blue-500 font-medium text-sm animate-pulse tracking-widest uppercase">
                Thinking...
              </div>
            ) : aiState === "speaking" ? (
              <div className="text-blue-500 font-medium text-sm animate-pulse tracking-widest uppercase">
                Agent Speaking...
              </div>
            ) : (
              <div className="text-slate-400 font-mono text-xs uppercase tracking-widest font-bold">
                Tap to Start
              </div>
            )}
          </div>
        </div>

        {/* Live Transcript */}
        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 p-4 rounded-xl bg-white shadow-sm border border-slate-100 max-w-xl mx-auto"
            >
              <p className="text-slate-700 font-medium italic">"{transcript}"</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
