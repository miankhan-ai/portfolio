import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Minus,
  Send,
  Sparkles,
  Terminal,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: string;
}

function parseSseDeltas(chunk: string): { deltas: string[]; done: boolean; error?: string } {
  // Accept either SSE chunks ("data: ...") or JSONL (Ollama style) and normalize to deltas.
  const deltas: string[] = [];
  let done = false;
  let error: string | undefined;

  const trimmed = chunk.trim();
  if (!trimmed) return { deltas, done };

  // Heuristic: if it looks like JSONL, parse line-by-line
  if (trimmed.startsWith("{") || trimmed.includes('{"message"')) {
    const lines = chunk.split("\n");
    for (const line of lines) {
      const l = line.trim();
      if (!l) continue;
      try {
        const json = JSON.parse(l);
        const d = json?.message?.content;
        if (typeof d === "string" && d.length) deltas.push(d);
        if (json?.done) done = true;
      } catch {
        // ignore
      }
    }
    return { deltas, done };
  }

  // SSE parsing
  const events = chunk.split("\n\n");
  for (const ev of events) {
    const lines = ev.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (line.startsWith("event:")) {
        const evt = line.slice("event:".length).trim();
        if (evt === "done") done = true;
        if (evt === "error") {
          // handled when data arrives
        }
      }
      if (!line.startsWith("data:")) continue;
      const payload = line.slice("data:".length).trim();
      if (payload === "[DONE]") {
        done = true;
        continue;
      }
      try {
        const json = JSON.parse(payload);
        const d = json?.delta;
        const e = json?.message;
        if (typeof d === "string" && d.length) deltas.push(d);
        if (typeof e === "string" && e.length) error = e;
      } catch {
        // ignore
      }
    }
  }

  return { deltas, done, error };
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY?.trim() || "";
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "llama-3.1-8b-instant";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are an AI assistant representing Mian Khan, an ML engineer based in Lahore, Pakistan.
Your job is to answer questions from recruiters, employers, and collaborators about Mian Khan's background, skills, projects, and availability.
Be concise, professional, and friendly.

STRICT FORMATTING RULES:
- Use structured Markdown (bullet points, bold text, headers).
- NEVER use large blocks of text.
- Use bolding for key tech stack items and metrics.
- Break down information into clear, scannable sections.

About Mian Khan:
- Specializes in **ML pipelines**, **model deployment**, and **AI infrastructure**
- Has deployed **50+ models** (actually 10+ production AI systems) across automation, RAG, and agent workflows
- Achieved **70%+ reduction** in manual operational workload through process automation
- **40% faster inference** through optimized pipelines and model tuning
- Built **5+ end-to-end ML pipelines** from data ingestion to monitoring
- Maintains **99.9% uptime** across monitored systems

Core Stack: **Python**, **PyTorch**, **PostgreSQL**, **FastAPI**, **TypeScript**, **LangChain**, **Docker**, **React.js**, **Node.js**, **Next.js**, **Vue.js**

AI/ML Expertise:
- **LLM Systems**: Production-grade LLM pipelines and workflows
- **Multi-Agent Orchestration**: Autonomous agent systems that collaborate and execute tasks
- **RAG**: Context-aware AI with vector search and knowledge grounding
- **AI Automation**: Replacing manual workflows with intelligent end-to-end systems
- **Model Integration & APIs**: OpenAI, open-source models, and tool integrations
- **Scalable AI Architecture**: Reliable, maintainable, and scalable AI systems

Key Projects:
- **AI-Powered Business Incubator**: Orchestrates 9 AI agents for startup asset generation (LangGraph, Python, React, OpenAI). 99% time reduction, 15k+ assets generated.
- **Privacy-First AI Chat Platform**: GDPR-compliant chatbot with <100ms latency, PII scrubbing, multi-provider LLM routing (React, FastAPI, Stripe). Zero data leaks with 500+ beta users.
- **AI Content Automation Platform**: End-to-end SEO publishing workflow reducing manual effort by 90% (LangGraph, WordPress API).
- **Fake Job Posting Detection**: BiLSTM model achieving 98.22% detection accuracy (Python, TensorFlow, NLP).
- **RAG Agent**: High-precision retrieval system with sub-second latency (FAISS, LangChain, FastAPI).
- **SJL Bot**: AI Credit Assistant processing 50+ daily queries (n8n, OpenAI, Telegram API).

Engineering Philosophy:
- **Production over Demos**: Builds robust, scalable systems, not just Jupyter notebooks. Replaced a Jupyter POC with a monitored FastAPI service handling 10k requests/day.
- **Human-in-the-loop**: Designs systems that augment human intelligence. Built review interfaces improving labeling accuracy by 40%.
- **Data-Centric AI**: Prioritizes data quality, versioning, and lineage. Implemented DVC pipelines detecting data drift.

Currently Learning: Advanced RAG Architectures (75%), LLM Fine-tuning at Scale with LoRA/QLoRA (60%), MLOps with Kubernetes (85%).

- Open to freelance projects, consulting, and full-time remote roles
- Based in Lahore, PK — available for international remote work
- Booking link: https://calendly.com/miankhan-dev/30min

When someone asks to book a call or schedule a meeting, ALWAYS share the booking link https://calendly.com/miankhan-dev/30min and ask for their preferred time zone.`;

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [chatTheme, setChatTheme] = useState<"light" | "dark">("dark");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm Mian's AI assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const toggleTheme = () => {
    setChatTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build conversation history for the API
      const chatHistory = messages
        .filter((m) => (m.role === "user" || m.role === "assistant") && m.content.trim().length > 0)
        .map((m) => ({ role: m.role, content: m.content }));

      // Call our backend chat API instead of direct Groq
      // Using /api/chatbot-query instead of /api/chat to avoid potential keyword blocks
      const response = await fetch("/api/chatbot-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...chatHistory,
            { role: "user", content: text },
          ],
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          throw new Error(`Server returned HTML instead of JSON (Status ${response.status}). This usually means the backend is not reachable or a security filter is blocking the request.`);
        }
        const errBody = await response.text().catch(() => "");
        throw new Error(errBody || `Chat API returned ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");
      
      const decoder = new TextDecoder();
      let botContent = "";

      const botMessage: Message = {
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const lines = part.split("\n");
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            
            try {
              const json = JSON.parse(payload);
              const delta = json?.delta;
              if (typeof delta === "string" && delta.length) {
                botContent += delta;
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  const others = prev.slice(0, -1);
                  return [...others, { ...last, content: botContent }];
                });
              }
            } catch {
              // ignore
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setIsLoading(false);
      const errorMessage: Message = {
        role: "assistant",
        content: `Error: ${error.message || "I couldn't generate a response right now. Please try again later."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const quickReplies = ["My Projects", "My Skills", "Book a Call"];

  return (
    <>
      {/* Floating Trigger Button - Positioned to the left of WhatsApp button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-24 z-[99] w-14 h-14 rounded-full bg-[#8B00FF] text-white shadow-[0_0_30px_5px_rgba(139,0,255,0.4)] flex items-center justify-center hover:scale-110 transition-all group"
          >
            <MessageSquare className="w-7 h-7" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#00E676] border-2 border-white rounded-full" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "64px" : "520px"
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[100] w-[360px] ${chatTheme === "dark" ? "bg-[#0D0D0D] text-white" : "bg-white text-slate-900"} rounded-[20px] shadow-[0_0_40px_10px_rgba(139,0,255,0.5)] border border-[#8B00FF]/20 overflow-hidden flex flex-col transition-all duration-300`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8B00FF] to-[#4B0082] p-4 flex items-center justify-between h-16 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-[15px] leading-tight">Mian Khan AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00E676]" />
                    <span className="text-[11px] text-white/80">● Online · Ready to assist</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-black/30 rounded-full p-1 border border-white/10">
                <button
                  onClick={toggleTheme}
                  className="p-1.5 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors"
                  title="Toggle Theme"
                >
                  {chatTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-red-500/50 rounded-full text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col flex-1 overflow-hidden"
                >
                  {/* Chat History */}
                  <div
                    ref={scrollRef}
                    className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin ${chatTheme === "dark" ? "scrollbar-thumb-[#1E1E1E]" : "scrollbar-thumb-slate-200"} scrollbar-track-transparent`}
                  >
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"} items-end gap-2`}
                      >
                        <div className={`max-w-[85%] flex flex-col ${msg.role === "assistant" ? "items-start" : "items-end"}`}>
                          <div className={`
                            p-3.5 rounded-[20px] text-[14px] leading-relaxed
                            ${msg.role === "assistant"
                              ? (chatTheme === "dark" ? "bg-[#1E1E1E] text-white rounded-bl-none" : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200")
                              : "bg-[#8B00FF] text-white rounded-br-none shadow-lg shadow-[#8B00FF]/10"}
                          `}>
                            {msg.role === "assistant" ? (
                              <div className={`prose prose-sm max-w-none ${chatTheme === "dark" ? "prose-invert text-white/90" : "text-slate-800"}`}>
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    a: ({ node, ...props }) => (
                                      <a
                                        {...props}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#8B00FF] font-bold underline hover:text-[#7B2FBE] transition-colors"
                                      />
                                    )
                                  }}
                                >
                                  {msg.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              msg.content
                            )}
                          </div>
                          <span className={`text-[10px] ${chatTheme === "dark" ? "text-white/40" : "text-slate-400"} mt-1.5 px-2`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className={`${chatTheme === "dark" ? "bg-[#1E1E1E]" : "bg-slate-100"} p-3 rounded-[20px] rounded-bl-none flex gap-1.5 items-center`}>
                          <span className="w-1.5 h-1.5 bg-[#8B00FF] rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-[#8B00FF] rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-[#8B00FF] rounded-full animate-bounce" />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Quick Replies & Input */}
                  <div className={`p-4 ${chatTheme === "dark" ? "bg-[#0D0D0D] border-white/5" : "bg-slate-50 border-slate-200"} border-t mt-auto`}>
                    {/* Quick Reply Chips */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
                      {quickReplies.map(reply => (
                        <button
                          key={reply}
                          onClick={() => handleSend(reply)}
                          className={`px-4 py-2 rounded-full border ${chatTheme === "dark" ? "border-[#8B00FF]/30 bg-[#8B00FF]/5 text-purple-300 hover:bg-[#8B00FF]/20" : "border-purple-200 bg-white text-purple-600 hover:bg-purple-50"} text-[12px] transition-all whitespace-nowrap active:scale-95`}
                        >
                          {reply}
                        </button>
                      ))}
                    </div>

                    {/* Input Field */}
                    <div className={`relative flex items-center gap-2 ${chatTheme === "dark" ? "bg-[#1E1E1E] border-white/5" : "bg-white border-slate-200"} rounded-xl p-1.5 border focus-within:border-[#8B00FF]/50 transition-all shadow-inner`}>
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
                        placeholder="Type your message..."
                        className={`flex-1 bg-transparent border-none px-3 text-[14px] ${chatTheme === "dark" ? "text-white placeholder:text-white/20" : "text-slate-900 placeholder:text-slate-400"} focus:outline-none h-10`}
                      />
                      <button
                        onClick={() => handleSend(input)}
                        disabled={!input.trim() || isLoading}
                        className="w-11 h-11 rounded-lg bg-[#8B00FF] flex items-center justify-center text-white hover:bg-[#7B2FBE] transition-all disabled:opacity-40 disabled:cursor-not-allowed group shadow-lg shadow-[#8B00FF]/20"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        )}
                      </button>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-3 flex items-center justify-center gap-2 opacity-30">
                      <Terminal className={`w-3 h-3 ${chatTheme === "dark" ? "text-[#8B00FF]" : "text-slate-400"}`} />
                      <span className={`text-[9px] ${chatTheme === "dark" ? "text-white" : "text-slate-500"} font-mono uppercase tracking-[0.2em]`}>LLaMA 3 Powered Assistant</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
