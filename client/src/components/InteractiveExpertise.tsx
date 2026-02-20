import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    Building2,
    Home,
    ShieldCheck,
    HeartPulse,
    ShoppingBag,
    Briefcase,
    UtilityPole,
    Plus
} from "lucide-react";

interface IndustryCardProps {
    id: number;
    title: string;
    icon: any;
    initialX: string;
    initialY: string;
    rotation: number;
    width?: string;
    height?: string;
}

const industries: IndustryCardProps[] = [
    { id: 1, title: "Insurance", icon: ShieldCheck, initialX: "10px", initialY: "72%", rotation: -90, width: "110px" },
    { id: 2, title: "Home Services", icon: Home, initialX: "65px", initialY: "70%", rotation: -90, height: "180px" },
    { id: 3, title: "Healthcare", icon: HeartPulse, initialX: "88%", initialY: "48%", rotation: -90, height: "230px" },
    { id: 4, title: "Hospitality", icon: Building2, initialX: "62%", initialY: "75%", rotation: 0, width: "180px" },
    { id: 5, title: "Agency", icon: Briefcase, initialX: "65%", initialY: "84%", rotation: 0, width: "150px" },
    { id: 6, title: "Real Estate", icon: Building2, initialX: "28%", initialY: "91%", rotation: 0, width: "185px" },
    { id: 7, title: "Hospitality", icon: Building2, initialX: "32%", initialY: "83%", rotation: 0, width: "180px" },
    { id: 8, title: "Retail", icon: ShoppingBag, initialX: "62%", initialY: "91%", rotation: 0, width: "135px" },
];

function Card({ card, constraintsRef }: { card: IndustryCardProps; constraintsRef: any }) {
    const Icon = card.icon;

    return (
        <motion.div
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            whileDrag={{ scale: 1.05, zIndex: 50 }}
            initial={{
                opacity: 0,
                scale: 0.8
            }}
            whileInView={{
                opacity: 1,
                scale: 1,
                transition: { delay: card.id * 0.1, duration: 0.5 }
            }}
            viewport={{ once: true }}
            className="absolute bg-white text-zinc-900 p-4 rounded-sm shadow-md flex items-center gap-3 cursor-grab active:cursor-grabbing border border-zinc-100 select-none"
            style={{
                left: card.initialX.endsWith("%") && parseFloat(card.initialX) > 50 ? "auto" : card.initialX,
                right: card.initialX.endsWith("%") && parseFloat(card.initialX) > 50 ? `${100 - parseFloat(card.initialX)}%` : "auto",
                top: card.initialY,
                width: card.width || "auto",
                height: card.height || "auto",
                rotate: card.rotation,
                minWidth: "140px",
                transformOrigin: "center"
            }}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium whitespace-nowrap">{card.title}</span>
        </motion.div>
    );
}

const sections = [
    "Healthcare", "Real Estate", "Insurance", "Home Services", "Retail & Consumer", "Hospitality"
];

export function InteractiveExpertise() {
    const constraintsRef = useRef(null);
    const [activeTab, setActiveTab] = useState<string | null>(null);

    return (
        <section className="py-24 bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left Side: Interactive Pile Area */}
                    <div className="relative aspect-square w-full max-w-xl mx-auto border border-gray-100 rounded-lg overflow-hidden bg-gradient-to-br from-orange-50/50 via-white to-blue-50/50 shadow-inner" ref={constraintsRef}>
                        {/* Background elements */}
                        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-blue-100/30" />

                        {industries.map((card) => (
                            <Card key={card.id} card={card} constraintsRef={constraintsRef} />
                        ))}
                    </div>

                    {/* Right Side: Content and Accordion */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-4">
                            <span className="text-zinc-500 font-mono text-xs font-bold uppercase tracking-[0.2em]">
                                Industries
                            </span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-serif leading-tight mb-8 text-zinc-900 dark:text-zinc-100">
                            Built for the real world.<br />
                            <span className="italic">Across every industry.</span>
                        </h2>

                        <div className="space-y-0 border-t border-zinc-200 dark:border-zinc-800">
                            {sections.map((section) => (
                                <div
                                    key={section}
                                    className="group"
                                >
                                    <button
                                        onClick={() => setActiveTab(activeTab === section ? null : section)}
                                        className="w-full py-6 flex items-center justify-between text-left border-b border-zinc-200 dark:border-zinc-800 hover:px-2 transition-all"
                                    >
                                        <span className={activeTab === section ? "text-xl font-medium text-zinc-900 dark:text-zinc-100" : "text-xl text-zinc-400 group-hover:text-zinc-600 transition-colors"}>
                                            {section}
                                        </span>
                                        <Plus className={`w-5 h-5 text-zinc-300 transition-transform duration-300 ${activeTab === section ? 'rotate-45' : ''}`} />
                                    </button>
                                    <motion.div
                                        initial={false}
                                        animate={{ height: activeTab === section ? "auto" : 0, opacity: activeTab === section ? 1 : 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pb-6 pt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                            Deploying production-ready {section.toLowerCase()} systems that reduce costs, automate workflows, and scale reliably. Bridging the gap between cutting-edge research and mission-critical software.
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12">
                            <button className="px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-sm hover:opacity-90 transition-all">
                                Start building
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
