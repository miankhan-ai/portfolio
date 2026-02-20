import { motion } from "framer-motion";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";

export function LearningSection() {
    const currentLearning = [
        {
            topic: "Advanced RAG Architectures",
            description: "Exploring multi-modal retrieval and hybrid search strategies",
            icon: Sparkles,
            progress: 75,
        },
        {
            topic: "LLM Fine-tuning at Scale",
            description: "Parameter-efficient methods (LoRA, QLoRA) for production",
            icon: TrendingUp,
            progress: 60,
        },
        {
            topic: "MLOps Best Practices",
            description: "Kubernetes-based model serving and A/B testing frameworks",
            icon: BookOpen,
            progress: 85,
        },
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-secondary/10 to-background">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Currently Learning
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Staying ahead of the curve in AI/ML. Here's what I'm exploring right now.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {currentLearning.map((item, index) => (
                            <motion.div
                                key={item.topic}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card p-6 rounded-xl hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-2">{item.topic}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                                        <span>Progress</span>
                                        <span>{item.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${item.progress}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-sm text-muted-foreground italic">
                            💡 Growth mindset: I dedicate 10+ hours/week to learning new technologies and staying current with AI research.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
