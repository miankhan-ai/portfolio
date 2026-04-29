import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Briefcase, Calendar, Award, Building2, Rocket, HeartPulse, Search, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineItem {
  id: number;
  title: string;
  organization: string;
  duration: string;
  category: string;
  description?: string;
  type: "education" | "experience";
  industry: "tech" | "consulting" | "healthcare" | "E-Commerce";
}

const experienceData: TimelineItem[] = [
  {
    id: 1,
    title: "AI Agent Manager",
    organization: "Xeven Solutions",
    duration: "Apr 2026 - Present",
    category: "AI Company",
    type: "experience",
    industry: "tech",
    description: "Leading the development of agentic AI systems and large-scale LLM infrastructure for enterprise clients."
  },
  {
    id: 2,
    title: "AI Engineer",
    organization: "The Sweet Tooth LLC",
    duration: "May 2025 - Mar 2025",
    category: "E-Commerce",
    type: "experience",
    industry: "E-Commerce",
    description: "Designed AI solutions for an E-Commerce platform."
  }
];

const educationData: TimelineItem[] = [
  {
    id: 6,
    title: "B.S. in Artificial Intelligence",
    organization: "COMSATS University Islamabad",
    duration: "2022 - 2026",
    category: "University",
    type: "education",
    industry: "tech"
  },
  {
    id: 7,
    title: "A Levels",
    organization: "Army Public School & College",
    duration: "2018 - 2020",
    category: "College",
    type: "education",
    industry: "tech"
  }
];

export function EducationExperience() {
  const [activeTab, setActiveTab] = useState<"education" | "experience">("experience");

  const data = activeTab === "experience" ? experienceData : educationData;

  return (
    <section id="experience" className="py-24 bg-[#FAF9FF] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8B5CF6]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#10B981]/5 rounded-full blur-[120px]" />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#10B981]"
          >
            Education & Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium"
          >
            A Journey Through Innovation — 8+ Years in Technology
          </motion.p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-20">
          <div className="relative flex w-full max-w-2xl p-2 bg-gray-200/50 backdrop-blur-sm rounded-[2.5rem] border border-gray-300/50 shadow-inner overflow-hidden">
            {/* Background Decorative Bubbles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, 10, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                  className="absolute w-8 h-8 rounded-full bg-white/40 blur-sm"
                  style={{
                    left: `${i * 20}%`,
                    top: `${(i % 3) * 30}%`
                  }}
                />
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("education")}
              className={cn(
                "relative flex-1 py-5 text-sm md:text-base font-black rounded-[2rem] transition-all duration-500 z-10",
                activeTab === "education"
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              {activeTab === "education" && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-0 bg-[#10B981] shadow-lg"
                  transition={{
                    type: "spring",
                    bounce: 0.35,
                    duration: 0.8,
                  }}
                  style={{ borderRadius: 40 }}
                />
              )}
              <span className="relative z-20 flex items-center justify-center gap-2">
                <GraduationCap className="w-5 h-5" /> Education
              </span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("experience")}
              className={cn(
                "relative flex-1 py-5 text-sm md:text-base font-black rounded-[2rem] transition-all duration-500 z-10",
                activeTab === "experience"
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              {activeTab === "experience" && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] shadow-lg"
                  transition={{
                    type: "spring",
                    bounce: 0.35,
                    duration: 0.8,
                  }}
                  style={{ borderRadius: 40 }}
                />
              )}
              <span className="relative z-20 flex items-center justify-center gap-2">
                <Briefcase className="w-5 h-5" /> Experience
              </span>
            </motion.button>
          </div>
        </div>

        {/* Timeline View */}
        <div className="max-w-4xl mx-auto relative pl-8 md:pl-12">
          {/* Vertical Line */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#8B5CF6] via-[#10B981] to-[#8B5CF6] opacity-20" />

          <div className="space-y-12 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {data.map((item) => (
                  <div key={item.id} className="relative flex flex-col items-start mb-12">
                    {/* Node Dot */}
                    <div className={cn(
                      "absolute -left-[9px] md:-left-[11px] top-8 w-4 md:w-5 h-4 md:h-5 rounded-full border-[3px] border-white shadow-lg z-20 transition-all duration-500",
                      item.industry === "tech" ? "bg-[#8B5CF6]" : item.industry === "E-Commerce" ? "bg-[#3B82F6]" : "bg-[#10B981]",
                      "animate-pulse"
                    )} />

                    {/* Content Card */}
                    <motion.div
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="w-full pl-6 md:pl-10"
                    >
                      <div className="bg-white rounded-[1rem] p-6 shadow-xl border border-gray-100 relative group transition-all duration-300 hover:shadow-2xl hover:border-gray-200 overflow-hidden">
                        {/* Subtle Border Glow on Hover */}
                        <div className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                          item.industry === "tech"
                            ? "shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]"
                            : item.industry === "E-Commerce"
                              ? "shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]"
                              : "shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]"
                        )} />

                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                {item.industry === "tech" ? <Rocket className="w-5 h-5 text-[#8B5CF6]" /> : item.industry === "E-Commerce" ? <ShoppingCart className="w-5 h-5 text-[#3B82F6]" /> : <HeartPulse className="w-5 h-5 text-[#10B981]" />}
                                {item.title}
                              </h3>
                              <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                                <Building2 className="w-4 h-4" /> {item.organization}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 md:items-end flex-col">
                              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center gap-1.5 border border-gray-200">
                                <Calendar className="w-3.5 h-3.5" /> {item.duration}
                              </span>
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                item.industry === "tech"
                                  ? "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20"
                                  : item.industry === "E-Commerce"
                                    ? "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20"
                                    : "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                              )}>
                                {item.category}
                              </span>
                            </div>
                          </div>

                          {item.description && (
                            <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4 mt-2 italic">
                              "{item.description}"
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
