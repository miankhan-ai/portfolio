import { useProjects } from "@/hooks/use-projects";
import { useSkills } from "@/hooks/use-skills";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillCard } from "@/components/SkillCard";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Cpu, Globe, Rocket, Terminal } from "lucide-react";

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
        <section className="py-20 border-y border-white/5 bg-secondary/10">
          <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Automation", value: "95%", icon: Cpu },
              { label: "Error Reduction", value: "98%", icon: Terminal },
              { label: "Models Deployed", value: "50+", icon: Rocket },
              { label: "Uptime", value: "99.9%", icon: Globe },
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
                <div className="text-4xl md:text-5xl font-bold font-mono text-white mb-2">{metric.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Work</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
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
                <h3 className="text-2xl font-bold mb-8">Additional Experiments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherProjects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="py-24 bg-secondary/10 border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Technical Arsenal</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills?.map((skill, index) => (
                  <SkillCard key={skill.id} skill={skill} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* PHILOSOPHY SECTION */}
        <section id="philosophy" className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-8">Engineering Philosophy</h2>
                <div className="space-y-8">
                  <div className="pl-6 border-l-2 border-primary">
                    <h3 className="text-xl font-bold mb-2 text-white">Production over Demos</h3>
                    <p className="text-muted-foreground">
                      I don't just build Jupyter notebooks. I build robust, scalable systems that can handle real-world traffic and edge cases. Reliability is a feature.
                    </p>
                  </div>
                  <div className="pl-6 border-l-2 border-purple-500">
                    <h3 className="text-xl font-bold mb-2 text-white">Human-in-the-loop</h3>
                    <p className="text-muted-foreground">
                      AI should augment human intelligence, not replace it. I design systems that empower users with better decision-making capabilities.
                    </p>
                  </div>
                  <div className="pl-6 border-l-2 border-pink-500">
                    <h3 className="text-xl font-bold mb-2 text-white">Data-Centric AI</h3>
                    <p className="text-muted-foreground">
                      Better data beats better models. I prioritize data quality, versioning, and lineage to ensure reproducible and reliable results.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-3xl" />
                <div className="relative bg-secondary/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <pre className="font-mono text-sm text-blue-300 overflow-x-auto">
{`class Engineer:
    def __init__(self):
        self.focus = "impact"
        self.standards = "high"

    def deploy(self, model):
        if not self.is_robust(model):
            raise Exception("Not ready")
            
        return Container(model).scale()
        
    def solve(self, problem):
        # Complexity is the enemy
        return simple_solution(problem)`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Let's Build Together</h2>
                <p className="text-muted-foreground text-lg">
                  Have a challenging problem? I'm always open to discussing new opportunities and collaborations.
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
