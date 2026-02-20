import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Building2,
    Home,
    ShieldCheck,
    HeartPulse,
    ShoppingBag,
    Briefcase,
    Plus
} from "lucide-react";
import Matter from "matter-js";

// ─── Data ────────────────────────────────────────────────────────────

interface IndustryCard {
    id: number;
    title: string;
    icon: any;
    w: number;   // card width in px
    h: number;   // card height in px
}

const industries: IndustryCard[] = [
    { id: 1, title: "Insurance", icon: ShieldCheck, w: 160, h: 52 },
    { id: 2, title: "Home Services", icon: Home, w: 180, h: 52 },
    { id: 3, title: "Healthcare", icon: HeartPulse, w: 165, h: 52 },
    { id: 4, title: "Agency", icon: Briefcase, w: 145, h: 52 },
    { id: 5, title: "Real Estate", icon: Building2, w: 170, h: 52 },
    { id: 6, title: "Hospitality", icon: Building2, w: 170, h: 52 },
    { id: 7, title: "Retail", icon: ShoppingBag, w: 140, h: 52 },
];

// ─── Accordion Data ──────────────────────────────────────────────────

const sections = [
    "Healthcare", "Real Estate", "Insurance", "Home Services", "Retail & Consumer", "Hospitality"
];

// ─── Physics Playground ──────────────────────────────────────────────

function PhysicsPlayground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const bodiesRef = useRef<Map<number, Matter.Body>>(new Map());
    const cardRefsMap = useRef<Map<number, HTMLDivElement>>(new Map());
    const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
    const renderLoopRef = useRef<number>(0);
    const wallsRef = useRef<Matter.Body[]>([]);

    // Track which body is being dragged
    const dragBodyRef = useRef<Matter.Body | null>(null);

    // Setup physics engine
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const cW = container.offsetWidth;
        const cH = container.offsetHeight;

        // Create engine with gravity pointing down
        const engine = Matter.Engine.create({
            gravity: { x: 0, y: 1.2, scale: 0.001 },
        });
        engineRef.current = engine;

        // Create walls (floor, left, right, ceiling) - make them thick
        const wallThickness = 60;
        const walls = [
            // Floor
            Matter.Bodies.rectangle(cW / 2, cH + wallThickness / 2 - 2, cW + wallThickness * 2, wallThickness, { isStatic: true, restitution: 0.3, friction: 0.8 }),
            // Left wall
            Matter.Bodies.rectangle(-wallThickness / 2 + 2, cH / 2, wallThickness, cH + wallThickness * 2, { isStatic: true, restitution: 0.3, friction: 0.4 }),
            // Right wall
            Matter.Bodies.rectangle(cW + wallThickness / 2 - 2, cH / 2, wallThickness, cH + wallThickness * 2, { isStatic: true, restitution: 0.3, friction: 0.4 }),
            // Ceiling
            Matter.Bodies.rectangle(cW / 2, -wallThickness / 2 + 2, cW + wallThickness * 2, wallThickness, { isStatic: true, restitution: 0.3, friction: 0.4 }),
        ];
        wallsRef.current = walls;
        Matter.Composite.add(engine.world, walls);

        // Create bodies for each card — drop them from staggered positions near the top
        industries.forEach((card, i) => {
            const x = 80 + (i % 4) * (cW - 160) / 3;
            const y = 40 + Math.floor(i / 4) * 80;
            const body = Matter.Bodies.rectangle(x, y, card.w, card.h, {
                restitution: 0.4,
                friction: 0.6,
                frictionAir: 0.02,
                density: 0.002,
                chamfer: { radius: 4 },
                label: `card-${card.id}`,
            });
            bodiesRef.current.set(card.id, body);
            Matter.Composite.add(engine.world, body);
        });

        // Mouse constraint for dragging via Matter.js
        const mouse = Matter.Mouse.create(container);
        // Fix for high-DPI screens
        mouse.pixelRatio = window.devicePixelRatio || 1;

        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.6,
                damping: 0.1,
                render: { visible: false },
            },
        });
        mouseConstraintRef.current = mouseConstraint;
        Matter.Composite.add(engine.world, mouseConstraint);

        // Track drag start/end for cursor styling
        Matter.Events.on(mouseConstraint, "startdrag", (e: any) => {
            dragBodyRef.current = e.body;
        });
        Matter.Events.on(mouseConstraint, "enddrag", () => {
            dragBodyRef.current = null;
        });

        // Physics loop + DOM sync
        let lastTime = performance.now();

        const loop = (now: number) => {
            const delta = now - lastTime;
            lastTime = now;

            // Cap delta to avoid physics explosion on tab switch
            Matter.Engine.update(engine, Math.min(delta, 32));

            // Sync DOM cards to physics positions
            bodiesRef.current.forEach((body, id) => {
                const el = cardRefsMap.current.get(id);
                if (el) {
                    const card = industries.find(c => c.id === id)!;
                    const x = body.position.x - card.w / 2;
                    const y = body.position.y - card.h / 2;
                    const angle = body.angle * (180 / Math.PI);
                    el.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;

                    // Cursor styling
                    if (dragBodyRef.current === body) {
                        el.style.cursor = "grabbing";
                        el.style.zIndex = "50";
                        el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.18)";
                    } else {
                        el.style.cursor = "grab";
                        el.style.zIndex = "1";
                        el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                    }
                }
            });

            renderLoopRef.current = requestAnimationFrame(loop);
        };

        renderLoopRef.current = requestAnimationFrame(loop);

        // Resize handler
        const handleResize = () => {
            const newW = container.offsetWidth;
            const newH = container.offsetHeight;

            // Reposition walls
            Matter.Body.setPosition(walls[0], { x: newW / 2, y: newH + wallThickness / 2 - 2 });
            Matter.Body.setVertices(walls[0], Matter.Bodies.rectangle(newW / 2, newH + wallThickness / 2 - 2, newW + wallThickness * 2, wallThickness).vertices);

            Matter.Body.setPosition(walls[2], { x: newW + wallThickness / 2 - 2, y: newH / 2 });
            Matter.Body.setVertices(walls[2], Matter.Bodies.rectangle(newW + wallThickness / 2 - 2, newH / 2, wallThickness, newH + wallThickness * 2).vertices);

            Matter.Body.setPosition(walls[3], { x: newW / 2, y: -wallThickness / 2 + 2 });
            Matter.Body.setVertices(walls[3], Matter.Bodies.rectangle(newW / 2, -wallThickness / 2 + 2, newW + wallThickness * 2, wallThickness).vertices);
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);

        return () => {
            cancelAnimationFrame(renderLoopRef.current);
            resizeObserver.disconnect();
            Matter.Engine.clear(engine);
            Matter.Composite.clear(engine.world, false);
        };
    }, []);

    const setCardRef = useCallback((id: number, el: HTMLDivElement | null) => {
        if (el) {
            cardRefsMap.current.set(id, el);
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative aspect-square w-full max-w-xl mx-auto border border-gray-100 rounded-lg overflow-hidden bg-gradient-to-br from-orange-50/50 via-white to-blue-50/50 shadow-inner"
            style={{ touchAction: "none" }}
        >
            {/* Subtle ground indicator */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-blue-100/30 pointer-events-none" />

            {/* Physics-driven cards */}
            {industries.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.id}
                        ref={(el) => setCardRef(card.id, el)}
                        className="absolute top-0 left-0 bg-white text-zinc-900 p-3 px-4 rounded-sm flex items-center gap-3 border border-zinc-100 select-none will-change-transform"
                        style={{
                            width: card.w,
                            height: card.h,
                            transformOrigin: "center center",
                            cursor: "grab",
                        }}
                    >
                        <Icon className="w-5 h-5 flex-shrink-0 text-zinc-600" />
                        <span className="font-medium whitespace-nowrap text-sm">{card.title}</span>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────

export function InteractiveExpertise() {
    const [activeTab, setActiveTab] = useState<string | null>(null);

    return (
        <section className="py-24 bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left Side: Physics Playground */}
                    <PhysicsPlayground />

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
