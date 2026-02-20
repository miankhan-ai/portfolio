import { motion } from "framer-motion";
import { type Skill } from "@shared/schema";
import * as Icons from "lucide-react";

interface SkillCardProps {
  skill: Skill;
  index: number;
}

export function SkillCard({ skill, index }: SkillCardProps) {
  // Dynamic icon rendering
  const IconComponent = (skill.icon && (Icons as any)[skill.icon])
    ? (Icons as any)[skill.icon]
    : Icons.Code;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="p-6 rounded-2xl glass-card hover:bg-secondary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded bg-primary/10 text-primary">
          <IconComponent className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-lg">{skill.category}</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {skill.items.map((item) => (
          <span
            key={item}
            className="px-3 py-1.5 rounded bg-white/5 text-sm font-medium text-muted-foreground border border-white/5 hover:text-foreground hover:border-primary/20 transition-all cursor-default"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
