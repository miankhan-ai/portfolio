import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Code2, Database } from "lucide-react";
import profileImg from "@assets/343416498_1032557101038386_6788105226659903264_n_1770747098493.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-primary mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Open to new opportunities
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            >
              Building the <span className="text-gradient">Intelligent</span><br />
              Future of Software
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed"
            >
              I am an AI & Machine Learning Engineer specializing in bridging the gap between cutting-edge research and production-grade software. I architect scalable systems that learn, adapt, and deliver value.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#projects"
                className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/25"
              >
                View My Work <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="px-8 py-4 rounded-lg bg-secondary text-secondary-foreground font-semibold border border-white/10 hover:bg-secondary/80 transition-all"
              >
                Contact Me
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative lg:w-1/3 flex justify-center lg:justify-end"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <Avatar className="w-64 h-64 md:w-80 md:h-80 border-2 border-white/10 relative">
                <AvatarImage src={profileImg} alt="Profile" className="object-cover" />
                <AvatarFallback className="bg-secondary text-4xl">AI</AvatarFallback>
              </Avatar>
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
