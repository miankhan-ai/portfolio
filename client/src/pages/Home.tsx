import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { useSkills } from "@/hooks/use-skills";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillCard } from "@/components/SkillCard";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { EducationExperience } from "@/components/EducationExperience";
import { LearningSection } from "@/components/LearningSection";
import { InteractiveExpertise } from "@/components/InteractiveExpertise";
import { VoiceAgent } from "@/components/VoiceAgent";
import { BookingSection } from "@/components/BookingSection";
import { motion } from "framer-motion";
import { Cpu, Globe, Rocket, Terminal, Sparkles, Mail, MessageSquare, Zap } from "lucide-react";
import type { Skill } from "@shared/schema";

function SkillsTabs({ skills }: { skills: Skill[] }) {
  const [activeCategory, setActiveCategory] = useState(skills[0]?.category || "AI & ML");
  // Ensure we have a valid category if the initial one doesn't exist? 
  // Getting unique categories
  const categories = Array.from(new Set(skills.map(s => s.category)));

  // If no skills helper
  if (skills.length === 0) return null;

  // Effect to set active if not set? default state handles it.

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4 mb-8 border-b border-white/10 pb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeCategory === category
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills
          .filter(s => s.category === activeCategory)
          .map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} />
          ))
        }
      </div>
    </div>
  );
}

export default function Home() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: skills, isLoading: skillsLoading } = useSkills();

  const featuredProjects = projects?.filter(p => p.featured) || [];
  const otherProjects = projects?.filter(p => !p.featured) || [];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar />

      <main>
        <Hero />

        {/* METRICS SECTION - LIGHT */}
        <section className="py-24 border-y border-slate-200 bg-slate-50 text-slate-900 light">
          <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Production AI Systems", sub: "Deployed across automation, RAG, and agent workflows", value: "10+", icon: Cpu },
              { label: "Process Automation", sub: "Reduction in manual operational workload", value: "70%+", icon: Terminal },
              { label: "Faster Inference", sub: "Through optimized pipelines and model tuning", value: "40%", icon: Zap },
              { label: "End-to-End ML Pipelines", sub: "From data ingestion to monitoring", value: "5+", icon: Rocket },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4 text-primary">
                  <metric.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl md:text-5xl font-extrabold font-mono text-slate-900 mb-2">{metric.value}</div>
                <div className="text-sm text-slate-700 font-semibold uppercase tracking-wider mb-1">{metric.label}</div>
                <div className="text-xs text-slate-500">{metric.sub}</div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* INTERACTIVE EXPERTISE SECTION */}
        <InteractiveExpertise />

        {/* EDUCATION & EXPERIENCE SECTION */}
        <EducationExperience />

        {/* PROJECTS SECTION - LIGHT */}
        <section id="projects" className="py-24 relative bg-white text-slate-900 light">
          <div className="container mx-auto px-6 mb-16">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl font-light text-slate-500 border-l-2 border-primary pl-6 max-w-2xl italic"
            >
              "Here are some real systems I’ve built for real problems."
            </motion.h3>
          </div>

          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Featured Work</h2>
              <p className="text-slate-600 text-lg max-w-2xl text-balance">
                A selection of production-grade AI systems and machine learning pipelines I've engineered.
              </p>
            </div>

            {projectsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-[400px] rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {featuredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            )}

            {/* Other Projects */}
            {otherProjects.length > 0 && (
              <>
                <h3 className="text-2xl font-bold mb-8 text-primary/80">Experimental AI Systems</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherProjects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* NARRATIVE BRIDGE */}
        <div className="container mx-auto px-6 pt-24 pb-12">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-light text-muted-foreground border-l-2 border-primary pl-6 max-w-2xl italic"
          >
            "These are the tools I trust in production."
          </motion.h3>
        </div>

        {/* SKILLS SECTION */}
        <section id="skills" className="pb-24 pt-12 bg-secondary/5 border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Technical Arsenal</h2>
              <p className="text-muted-foreground text-lg max-w-2xl text-balance">
                My toolbox for solving complex problems, from low-level systems to high-level abstractions.
              </p>
            </div>

            {skillsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-40 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <SkillsTabs skills={skills || []} />
            )}
          </div>
        </section>

        {/* PHILOSOPHY SECTION - LIGHT */}
        <section id="philosophy" className="py-24 bg-slate-50 text-slate-900 light">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-8 text-slate-900">Engineering Philosophy</h2>
                <div className="space-y-8">
                  <div className="pl-6 border-l-2 border-primary">
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Production over Demos</h3>
                    <p className="text-slate-600 mb-3">
                      I don't just build Jupyter notebooks. I build robust, scalable systems that can handle real-world traffic and edge cases. Reliability is a feature.
                    </p>
                    <p className="text-sm text-primary italic border-l-2 border-primary/20 pl-3">
                      Example: I replaced a Jupyter based POC with a monitored FastAPI service handling 10k requests per day.
                    </p>
                  </div>
                  <div className="pl-6 border-l-2 border-purple-500">
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Human-in-the-loop</h3>
                    <p className="text-slate-600 mb-3">
                      AI should augment human intelligence, not replace it. I design systems that empower users with better decision-making capabilities.
                    </p>
                    <p className="text-sm text-purple-600 italic border-l-2 border-purple-500/20 pl-3">
                      Example: Built a review interface that improved model labeling accuracy by 40% using active learning.
                    </p>
                  </div>
                  <div className="pl-6 border-l-2 border-pink-500">
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Data-Centric AI</h3>
                    <p className="text-slate-600 mb-3">
                      Better data beats better models. I prioritize data quality, versioning, and lineage to ensure reproducible and reliable results.
                    </p>
                    <p className="text-sm text-pink-600 italic border-l-2 border-pink-500/20 pl-3">
                      Example: Implemented DVC pipelines that detected data drift before it impacted production models.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image + Code Overlay */}
              <div className="relative group perspective-1000">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent to-purple-500 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:transform group-hover:scale-[1.02] transition-all duration-500">
                  <img
                    src="/engineer-at-work.png"
                    alt="Engineering Logic"
                    className="w-full h-auto object-cover opacity-60 hover:opacity-100 transition duration-700"
                  />
                  <div className="absolute bottom-6 right-6 max-w-[85%]">
                    <div className="glass-card p-6 rounded-xl text-xs font-mono text-blue-200/90 backdrop-blur-xl border border-white/20 shadow-2xl transform transition-transform duration-500 group-hover:-translate-y-2">
                      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                        <span className="text-white/70">production_logic.py</span>
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500/50" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                          <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        </div>
                      </div>
                      <pre className="overflow-x-auto">{`class Engineer:
  def __init__(self):
    self.focus = "impact"
    
  def deploy(self, model):
    if not self.is_robust(model):
      raise Exception("Not ready")
    return Container(model).scale()`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LEARNING SECTION */}
        <LearningSection />

        {/* VOICE AGENT SECTION */}
        <VoiceAgent />

        {/* BOOKING SECTION */}
        <BookingSection />

        {/* CONTACT SECTION - REDESIGNED */}
        <section id="contact" className="py-24 bg-[#FAF9FF] relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            {/* Header Content */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E0D5FF] mb-6 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#7B2FBE]" />
                <span className="text-xs font-bold tracking-widest text-[#7B2FBE] uppercase">Contact Us</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-slate-900"
              >
                Let's Start a <span className="text-[#7B2FBE] relative inline-block">
                  Conversation
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#7B2FBE]/30 rounded-full" />
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed"
              >
                Ready to transform your business? Get in touch with our team and discover how Mian Khan can revolutionize your workflow.
              </motion.p>
            </div>

            {/* Main Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto group"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden border border-[#E0D5FF] bg-white shadow-xl transition-all duration-500 group-hover:shadow-[0_0_40px_8px_rgba(139,0,255,0.45)] group-hover:border-[#7B2FBE] flex flex-col md:flex-row min-h-[700px]">
                
                {/* Left Panel: Form */}
                <div className="flex-1 bg-[#F3E8FF] p-8 md:p-12">
                  <ContactForm />
                </div>

                {/* Right Panel: Info */}
                <div className="w-full md:w-[400px] bg-gradient-to-br from-[#4A0080] to-[#1A0030] p-8 md:p-12 text-white relative overflow-hidden flex flex-col">
                  {/* Subtle bloom effect */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-8 self-start">
                      <Sparkles className="w-3 h-3 text-purple-300" />
                      <span className="text-[10px] font-bold tracking-wider text-purple-100 uppercase">AI-Powered Support</span>
                    </div>

                    <div className="mb-10">
                      <h3 className="text-3xl font-bold mb-4">Get in Touch</h3>
                      <div className="w-12 h-1 bg-[#7B2FBE] rounded-full mb-6" />
                      <p className="text-purple-200/70 text-sm leading-relaxed">
                        Whether you have a specific project in mind or just want to explore the possibilities of AI, we're here to help.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Contact Info Card 1 */}
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold mb-0.5">Email Support</div>
                          <div className="text-purple-300 text-sm mb-1">miankhan@ai-engineer.com</div>
                          <div className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Response within 24 hours</div>
                        </div>
                      </div>

                      {/* Contact Info Card 2 */}
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold">AI Live Chat</span>
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/20 text-[10px] font-bold text-green-400 border border-green-500/20">
                              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                              ONLINE
                            </span>
                          </div>
                          <div className="text-purple-300 text-sm mb-1">Instant AI-powered assistance</div>
                          <div className="text-[10px] text-white/40 uppercase tracking-widest font-medium font-mono">Available 24/7</div>
                        </div>
                      </div>

                      {/* Contact Info Card 3 */}
                      <div className="p-5 rounded-2xl border border-dashed border-purple-500/30 flex items-start gap-4 bg-purple-500/5">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold mb-1 flex items-center gap-2">
                            AI Updates & Insights
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                          </div>
                          <p className="text-purple-200/50 text-[11px] leading-relaxed">
                            Subscribe to our newsletter for the latest breakthroughs in agentic AI and LLM automation.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-10 text-[11px] text-purple-200/30 font-mono flex items-center gap-2">
                      <Terminal className="w-3 h-3" />
                      SECURE END-TO-END ENCRYPTED CHANNEL
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
