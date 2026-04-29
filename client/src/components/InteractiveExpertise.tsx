import React from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Network, 
  Database, 
  Zap, 
  Braces, 
  Layers,
  Cpu
} from "lucide-react";

const expertiseSkills = [
  {
    id: 1,
    title: "LLM Systems",
    desc: "Designing production-grade LLM pipelines and workflows",
    icon: MessageSquare,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Multi-Agent Orchestration",
    desc: "Building autonomous agent systems that collaborate and execute tasks",
    icon: Network,
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: 3,
    title: "Retrieval-Augmented Generation (RAG)",
    desc: "Context-aware AI with vector search and knowledge grounding",
    icon: Database,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 4,
    title: "AI Automation",
    desc: "Replacing manual workflows with intelligent end-to-end systems",
    icon: Zap,
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: 5,
    title: "Model Integration & APIs",
    desc: "Seamless integration of OpenAI, open-source models, and tools",
    icon: Braces,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 6,
    title: "Scalable AI Architecture",
    desc: "Designing reliable, maintainable, and scalable AI systems",
    icon: Layers,
    color: "from-violet-500 to-fuchsia-500",
  },
];

export function InteractiveExpertise() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    // Highlight faster on mobile (1.5s) compared to desktop (3s)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    const intervalDuration = isMobile ? 1500 : 3000;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % expertiseSkills.length);
    }, intervalDuration);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-24 pb-40 relative overflow-hidden bg-[#0a0515]">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
          >
            <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">Expertise</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            AI/ML <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Skills & Expertise</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Production-grade AI systems, not just models, built for scale, automation, and real-world impact.
          </motion.p>
        </div>

        {/* Circular Layout Container */}
        <div className="relative flex flex-col items-center justify-center min-h-[600px] py-10">
          {/* Center Identity Node */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative z-20 flex shrink-0 flex-col items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-[0_0_50px_rgba(168,85,247,0.5)] border-4 border-white/10 mb-12 lg:mb-0"
          >
            <div className="absolute inset-0 rounded-full animate-pulse bg-purple-500/20" />
            <Cpu className="w-10 h-10 text-white mb-2" />
            <span className="text-xl font-bold text-white tracking-tight">AI Engineer</span>
          </motion.div>

          {/* Connection Lines (Desktop only) */}
          <div className="absolute inset-0 hidden lg:block pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(168,85,247,0.5)" />
                  <stop offset="100%" stopColor="rgba(236,72,153,0.5)" />
                </linearGradient>
              </defs>
              {expertiseSkills.map((_, i) => {
                const angle = (i * 360) / expertiseSkills.length;
                const radian = (angle * Math.PI) / 180;
                const r = 300;
                const isActive = activeIndex === i;
                return (
                  <motion.line
                    key={i}
                    x1="500"
                    y1="500"
                    x2={500 + Math.cos(radian) * r}
                    y2={500 + Math.sin(radian) * r}
                    stroke={isActive ? "url(#lineGradient)" : "rgba(255,255,255,0.05)"}
                    strokeWidth={isActive ? "2.5" : "1"}
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
          </div>

          {/* Skill Cards in Circle (Desktop) */}
          <div className="absolute inset-0 hidden lg:flex items-center justify-center">
            {expertiseSkills.map((skill, i) => {
              const angle = (i * 360) / expertiseSkills.length;
              const radian = (angle * Math.PI) / 180;
              const distance = 300;
              
              return (
                <motion.div
                  key={skill.id}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ 
                    opacity: 1, 
                    scale: 1,
                    x: Math.cos(radian) * distance,
                    y: Math.sin(radian) * distance 
                  }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 100, 
                    damping: 20,
                    delay: 0.3 + i * 0.1 
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <ExpertiseCard skill={skill} isActive={activeIndex === i} />
                </motion.div>
              );
            })}
          </div>

          {/* List Layout for Mobile/Tablet */}
          <div className="flex flex-col gap-4 lg:hidden w-full relative z-30 max-w-xl mx-auto">
            {expertiseSkills.map((skill, i) => (
              <MobileExpertiseCard 
                key={skill.id} 
                skill={skill} 
                index={i} 
                isActive={activeIndex === i} 
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpertiseCard({ skill, isActive }: { skill: typeof expertiseSkills[0], isActive: boolean }) {
  const Icon = skill.icon;
  
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative w-72 h-auto cursor-pointer"
    >
      {/* Card Background with Glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur transition duration-500 ${isActive ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'}`} />
      
      <div className={`relative flex flex-col p-6 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${isActive ? 'bg-[#1a0b2e] border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 'bg-[#120b25]/80 border-white/10 group-hover:border-purple-500/30'}`}>
        <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${skill.color} shadow-lg transition-transform duration-500 ${isActive ? 'scale-110' : ''}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <h3 className={`text-lg font-bold mb-2 transition-colors duration-500 ${isActive ? 'text-purple-300' : 'text-white group-hover:text-purple-300'}`}>
          {skill.title}
        </h3>
        
        <p className={`text-sm leading-relaxed transition-colors duration-500 ${isActive ? 'text-purple-200/80' : 'text-muted-foreground'}`}>
          {skill.desc}
        </p>
      </div>
    </motion.div>
  );
}

function MobileExpertiseCard({ skill, index, isActive, onClick }: { skill: typeof expertiseSkills[0], index: number, isActive: boolean, onClick: () => void }) {
  const Icon = skill.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div
        onClick={onClick}
        className={`group relative w-full rounded-2xl border transition-all duration-500 overflow-hidden cursor-pointer ${
          isActive 
            ? "border-purple-500/60 bg-[#1a0b2e] shadow-[0_0_30px_rgba(168,85,247,0.15)] opacity-100 scale-[1.02]" 
            : "border-white/5 bg-[#120b25]/40 opacity-40 hover:opacity-80 scale-100 hover:bg-[#120b25]/80 hover:border-white/10"
        }`}
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        
        {/* Glow effect when active */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent pointer-events-none" />
        )}

        <div className="relative p-4 md:p-5 flex items-center gap-4">
          {/* Left Icon Block - ALWAYS COLORED */}
          <div className={`shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg bg-gradient-to-br ${skill.color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          {/* Content */}
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={`shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold transition-all duration-500 bg-gradient-to-br ${skill.color} text-white`}>
                {index + 1}
              </div>
              <h3 className={`text-sm md:text-base font-bold truncate transition-colors duration-500 ${isActive ? "text-white" : "text-white/90"}`}>
                {skill.title}
              </h3>
            </div>
            <p className={`text-xs md:text-sm line-clamp-2 transition-colors duration-500 ${isActive ? "text-purple-200/90" : "text-muted-foreground"}`}>
              {skill.desc}
            </p>
          </div>

          {/* Right Arrow */}
          <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-white/40 group-hover:text-white/60"}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
