import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Code2, Database } from "lucide-react";
import profileImg from "@assets/343416498_1032557101038386_6788105226659903264_n_1770747098493.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Professional Gradient Mesh Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      {/* Subtle animated gradients - professional and performant */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [-50, 50, -50]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          y: [50, -50, 50]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 max-w-3xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border border-green-500/30 text-sm font-semibold text-green-400 mb-8 backdrop-blur-sm relative overflow-hidden group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated background glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/30 to-green-500/0"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {/* Pulsing dot */}
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-lg shadow-green-500/50"></span>
                </span>

                {/* Text with hover effect */}
                <span className="relative z-10 group-hover:text-green-300 transition-colors duration-300">
                  Available for new projects
                </span>

                {/* Sparkle effect on hover */}
                <motion.span
                  className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.6 }}
                >
                  ✨
                </motion.span>
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]"
            >
              Architecting the <span className="text-gradient">Intelligent</span> Future
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl md:text-3xl text-foreground font-medium mb-6 max-w-2xl leading-relaxed text-balance"
            >
              I help startups and teams deploy production-ready AI systems that reduce costs, automate workflows, and scale reliably.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed prose-relaxed"
            >
              Bridging the gap between cutting-edge research and mission-critical software. I don't just build models; I build businesses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <a
                href="/resume.pdf"
                download
                className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/25 hover:scale-105 active:scale-95"
              >
                Download Resume <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#projects"
                className="px-8 py-4 rounded-xl bg-secondary/50 text-secondary-foreground font-bold border border-white/10 hover:bg-secondary/80 hover:border-white/20 transition-all backdrop-blur-sm"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="px-8 py-4 rounded-xl bg-transparent text-foreground font-bold border border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                Let's Talk
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="relative lg:w-1/3 flex justify-center lg:justify-end"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent to-purple-500 rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-2xl rotate-3 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-[1.02]">
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-full max-w-[400px] h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tech Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 pt-8 border-t border-white/5 flex items-center gap-8 text-muted-foreground overflow-x-auto pb-4 md:pb-0"
        >
          <span className="font-mono text-xs uppercase tracking-wider whitespace-nowrap">Core Stack:</span>
          <div className="flex gap-8">
            <div className="flex items-center gap-2 whitespace-nowrap hover:text-foreground transition-colors">
              <BrainCircuit className="w-5 h-5" /> PyTorch
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap hover:text-foreground transition-colors">
              <Database className="w-5 h-5" /> PostgreSQL
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap hover:text-foreground transition-colors">
              <Code2 className="w-5 h-5" /> TypeScript
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
