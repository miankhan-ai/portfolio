import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { useSkills } from "@/hooks/use-skills";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillCard } from "@/components/SkillCard";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { LearningSection } from "@/components/LearningSection";
import { InteractiveExpertise } from "@/components/InteractiveExpertise";
import { motion } from "framer-motion";
import { Cpu, Globe, Rocket, Terminal } from "lucide-react";
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

        {/* METRICS SECTION */}
        <section className="py-24 border-y border-white/5 bg-secondary/5">
          <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Automation", sub: "Manual processes eliminated", value: "95%", icon: Cpu },
              { label: "Error Reduction", sub: "Across deployed pipelines", value: "98%", icon: Terminal },
              { label: "Models Deployed", sub: "Production environments", value: "50+", icon: Rocket },
              { label: "Uptime", sub: "Monitored systems", value: "99.9%", icon: Globe },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4 text-primary/80">
                  <metric.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl md:text-5xl font-extrabold font-mono text-foreground mb-2">{metric.value}</div>
                <div className="text-sm text-foreground font-semibold uppercase tracking-wider mb-1">{metric.label}</div>
                <div className="text-xs text-muted-foreground">{metric.sub}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE EXPERTISE SECTION */}
        <InteractiveExpertise />

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-24 relative bg-gradient-to-b from-background to-secondary/10">
          <div className="container mx-auto px-6 mb-16">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl font-light text-muted-foreground border-l-2 border-primary pl-6 max-w-2xl italic"
            >
              "Here are some real systems I’ve built for real problems."
            </motion.h3>
          </div>

          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Work</h2>
              <p className="text-muted-foreground text-lg max-w-2xl text-balance">
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

        {/* PHILOSOPHY SECTION */}
        <section id="philosophy" className="py-24 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-8">Engineering Philosophy</h2>
                <div className="space-y-8">
                  <div className="pl-6 border-l-2 border-primary">
                    <h3 className="text-xl font-bold mb-2 text-foreground">Production over Demos</h3>
                    <p className="text-muted-foreground mb-3">
                      I don't just build Jupyter notebooks. I build robust, scalable systems that can handle real-world traffic and edge cases. Reliability is a feature.
                    </p>
                    <p className="text-sm text-primary/80 italic border-l-2 border-primary/20 pl-3">
                      Example: I replaced a Jupyter based POC with a monitored FastAPI service handling 10k requests per day.
                    </p>
                  </div>
                  <div className="pl-6 border-l-2 border-purple-500">
                    <h3 className="text-xl font-bold mb-2 text-foreground">Human-in-the-loop</h3>
                    <p className="text-muted-foreground mb-3">
                      AI should augment human intelligence, not replace it. I design systems that empower users with better decision-making capabilities.
                    </p>
                    <p className="text-sm text-purple-400/80 italic border-l-2 border-purple-500/20 pl-3">
                      Example: Built a review interface that improved model labeling accuracy by 40% using active learning.
                    </p>
                  </div>
                  <div className="pl-6 border-l-2 border-pink-500">
                    <h3 className="text-xl font-bold mb-2 text-foreground">Data-Centric AI</h3>
                    <p className="text-muted-foreground mb-3">
                      Better data beats better models. I prioritize data quality, versioning, and lineage to ensure reproducible and reliable results.
                    </p>
                    <p className="text-sm text-pink-400/80 italic border-l-2 border-pink-500/20 pl-3">
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

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Let's Talk AI</h2>
                <p className="text-muted-foreground text-lg mb-2">
                  Have a challenging problem? I'm always open to discussing new opportunities and collaborations.
                </p>
                <p className="text-primary/80 font-medium">
                  No spam. I reply personally within 24 hours.
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
