import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Cpu, 
  Rocket, 
  Briefcase, 
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (args: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, any>;
        utm?: Record<string, any>;
      }) => void;
    };
  }
}

export function BookingSection() {
  const calendlyUrl = useMemo(() => {
    // Set in .env as VITE_CALENDLY_URL="https://calendly.com/<yourname>/<event>"
    return (
      import.meta.env.VITE_CALENDLY_URL ||
      "https://calendly.com/miankhan-dev/30min"
    );
  }, []);

  const embedHostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const mount = async () => {
      if (!embedHostRef.current) return;

      // Prevent duplicate mounts on re-renders
      embedHostRef.current.innerHTML = "";

      const ensureScript = () =>
        new Promise<void>((resolve, reject) => {
          const existing = document.querySelector<HTMLScriptElement>(
            'script[src="https://assets.calendly.com/assets/external/widget.js"]',
          );
          if (existing) {
            resolve();
            return;
          }
          const s = document.createElement("script");
          s.src = "https://assets.calendly.com/assets/external/widget.js";
          s.async = true;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Failed to load Calendly script"));
          document.body.appendChild(s);
        });

      await ensureScript();
      if (cancelled) return;

      if (!window.Calendly?.initInlineWidget) return;

      window.Calendly.initInlineWidget({
        url: calendlyUrl,
        parentElement: embedHostRef.current,
      });
    };

    mount().catch(() => {
      // ignore; UI will show fallback link below
    });

    return () => {
      cancelled = true;
    };
  }, [calendlyUrl]);

  return (
    <section id="booking" className="py-24 bg-[#F4F6F9] text-[#0F172A]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Column: Text and Stats */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 mb-8"
            >
              <Calendar className="w-4 h-4 text-[#0F172A]" />
              <span className="text-xs font-bold tracking-widest text-[#0F172A] uppercase">BOOK A CALL</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-[#0F172A]"
            >
              Work with me <span className="font-['Playfair_Display'] italic text-[#2563EB] font-normal">directly.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#6B7280] text-lg max-w-xl mb-10 leading-relaxed"
            >
              Schedule a free 30-minute intro call. No slides, no fluff — just a direct conversation about your project or role.
            </motion.p>

            {/* Discussion Pills */}
            <div className="flex flex-wrap gap-3 mb-16">
              {[
                { label: "ML Engineering", icon: Cpu },
                { label: "Model Deployment", icon: Rocket },
                { label: "Consulting", icon: MessageSquare },
                { label: "Hiring", icon: Briefcase },
              ].map((pill) => (
                <button
                  key={pill.label}
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-[#374151] hover:border-slate-300 transition-colors"
                >
                  <pill.icon className="w-4 h-4 text-[#2563EB]" />
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-10 max-w-md">
              {[
                { value: "50+", label: "Models deployed" },
                { value: "95%", label: "Automation rate" },
                { value: "99.9%", label: "Uptime" },
                { value: "< 24hrs", label: "Response time" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-4xl font-bold text-[#0F172A] mb-1">{stat.value}</span>
                  <span className="text-sm font-medium text-[#6B7280]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Calendar Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 w-full"
          >
            <div className="bg-white rounded-[16px] border border-slate-200/70 overflow-hidden relative">
              {/* Calendly inline widget */}
              <div
                ref={embedHostRef}
                className="w-full"
                style={{ height: "clamp(680px, 80vh, 980px)" }}
              />
            </div>
            
            <p className="mt-6 text-center text-xs text-[#94A3B8] font-medium flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure booking handled by Calendly. No account required.
            </p>

            <p className="mt-2 text-center text-xs text-[#94A3B8]">
              Booking link:{" "}
              <a className="text-[#2563EB] underline underline-offset-2" href={calendlyUrl} target="_blank" rel="noreferrer">
                {calendlyUrl}
              </a>
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
