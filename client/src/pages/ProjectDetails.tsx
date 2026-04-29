import { useParams, useLocation } from "wouter";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { staticProjects } from "@/data/projects";
import { ArrowLeft, Target, Lightbulb, Zap, Server, Shield, Activity, BarChart, Database, MonitorPlay, Code } from "lucide-react";

export default function ProjectDetails() {
  const [location, setLocation] = useLocation();
  const params = useParams();

  // Extract slug robustly from either params or the raw location path
  let slug = params.slug;
  if (!slug) {
    const parts = location.split('/');
    // location is like /project/ai-business-incubator
    slug = parts[parts.length - 1];
  }

  const project = staticProjects.find(p => p.slug === slug);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <button onClick={() => setLocation("/")} className="text-primary hover:underline">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Generate generic problem/feature points based on the project's tech stack and description to simulate the case study
  const problemsToOvercome = [
    { title: "High Operational Cost", icon: BarChart, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Manual Processes", icon: Activity, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Data Security", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "System Scalability", icon: Server, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="bg-slate-900 text-white pt-32 pb-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="container mx-auto px-6 relative z-10">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12 text-sm font-medium tracking-wide"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO PORTFOLIO
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary font-bold text-xs tracking-widest mb-6 uppercase border border-primary/30">
                  {project.category}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  {project.title}
                </h1>
                <p className="text-xl text-slate-300 mb-8 max-w-xl leading-relaxed">
                  {project.summary}
                </p>
                <div className="flex flex-wrap gap-3">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-mono text-white/80">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <MonitorPlay className="w-24 h-24 text-white/10" />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* WHAT IS SECTION */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
                  <h2 className="text-3xl font-bold text-slate-900">What is {project.title}?</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  {project.description}
                </p>
                <p className="text-slate-500 leading-relaxed">
                  Engineered using modern state-of-the-art frameworks, this solution bridges the gap between proof-of-concept AI and production-ready scalable systems. It leverages {project.techStack.slice(0, 3).join(', ')} and other specialized technologies to guarantee performance.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1 flex justify-center"
              >
                {/* Simulated Data Circular Diagram */}
                <div className="relative w-72 h-72">
                  <div className="absolute inset-0 border-4 border-dashed border-slate-200 rounded-full animate-[spin_20s_linear_infinite]" />
                  <div className="absolute inset-4 border border-primary/20 bg-primary/5 rounded-full flex items-center justify-center">
                    <Database className="w-16 h-16 text-primary" />
                  </div>

                  {/* Orbiting Nodes */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl border border-slate-100 flex items-center justify-center">
                    <Code className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl border border-slate-100 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl border border-slate-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl border border-slate-100 flex items-center justify-center">
                    <Target className="w-6 h-6 text-rose-500" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PROBLEMS SECTION */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Problems To Overcome</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Building AI systems in production requires addressing these critical bottlenecks.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {problemsToOvercome.map((problem, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${problem.bg}`}>
                    <problem.icon className={`w-10 h-10 ${problem.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{problem.title}</h3>
                  <p className="text-sm text-slate-500">Solved via optimized architecture.</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DID YOU KNOW SECTION */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
                  <h2 className="text-3xl font-bold text-slate-900">Did You Know?</h2>
                </div>

                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-slate-700">Efficiency Improvement</span>
                      <span className="font-bold text-primary">90%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[90%] h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-slate-700">Latency Reduction</span>
                      <span className="font-bold text-emerald-500">85%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-slate-700">Scalability Growth</span>
                      <span className="font-bold text-amber-500">10x</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-amber-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex-1 relative"
              >
                <div className="bg-gradient-to-br from-rose-100 to-orange-100 rounded-[3rem] p-12 text-center transform rotate-3 shadow-xl">
                  <Lightbulb className="w-16 h-16 text-rose-500 mx-auto mb-6" />
                  <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">
                    DID YOU<br />KNOW...?
                  </h3>
                  <p className="text-slate-700 font-medium">
                    This system alone saves over 40 hours of manual labor per week for its primary users, creating an ROI of over 300% within the first month of deployment.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 justify-center mb-4">
                <div className="w-8 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
                <h2 className="text-3xl font-bold text-slate-900">High Level Features</h2>
                <div className="w-8 h-2 bg-gradient-to-r from-purple-500 to-primary rounded-full" />
              </div>
            </div>

            <div className="space-y-24">
              {project.techStack.map((tech, index) => (
                <div key={tech} className={`flex flex-col gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 1 ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex-1"
                  >
                    <div className="aspect-[4/3] bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
                      <div className="text-6xl font-black text-slate-100 absolute bottom-4 right-4">0{index + 1}</div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">Powered by {tech}</h3>
                      <p className="text-slate-600 relative z-10">
                        Integration of {tech} enables high-performance execution and scalable infrastructure. This core feature ensures the system remains robust under heavy loads while maintaining sub-second processing times.
                      </p>
                      <ul className="mt-6 space-y-3 relative z-10">
                        <li className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Enterprise-grade stability
                        </li>
                        <li className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Seamless API integration
                        </li>
                        <li className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Advanced error handling
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                  <div className="flex-1 hidden md:block">
                    {/* Decorative placeholder to balance the layout */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
