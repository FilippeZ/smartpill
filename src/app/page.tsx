"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Pill, ArrowRight, Activity, ShieldCheck, Zap, Crosshair } from "lucide-react";

// --- Particle Component ---
const BiologicalParticle = ({ index }: { index: number }) => {
    const [randomValues, setRandomValues] = useState<{
        x: number;
        y: number;
        size: number;
        duration: number;
        delay: number;
    } | null>(null);

    useEffect(() => {
        setRandomValues({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 5,
        });
    }, []);

    if (!randomValues) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: `${randomValues.x}%`, y: `${randomValues.y}%`, scale: 0 }}
            animate={{
                opacity: [0, 0.4, 0],
                x: [`${randomValues.x}%`, `${randomValues.x + (Math.random() * 10 - 5)}%`],
                y: [`${randomValues.y}%`, `${randomValues.y - (Math.random() * 20 + 10)}%`],
                scale: [0, 1, 0]
            }}
            transition={{
                duration: randomValues.duration,
                repeat: Infinity,
                delay: randomValues.delay,
                ease: "linear"
            }}
            className="absolute rounded-full bg-accent/30 blur-[1px]"
            style={{ width: randomValues.size, height: randomValues.size }}
        />
    );
};

// --- Frame Sequence Player ---
const FrameSequencePlayer = () => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const totalFrames = 80;

    // Eagerly load all frames for smooth playback without flashing
    useEffect(() => {
        for (let i = 0; i < totalFrames; i++) {
            const img = new Image();
            img.src = `/frames/Pill_Marketing_Video_Generated_${i.toString().padStart(3, '0')}.jpg`;
        }
    }, [totalFrames]);

    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();
        const fps = 24;
        const interval = 1000 / fps;

        const loop = (time: number) => {
            if (time - lastTime >= interval) {
                setCurrentFrame(prev => (prev + 1) % totalFrames);
                lastTime = time;
            }
            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [totalFrames]);

    return (
        <div className="absolute inset-0 bg-black">
            {Array.from({ length: totalFrames }).map((_, i) => (
                <img
                    key={i}
                    src={`/frames/Pill_Marketing_Video_Generated_${i.toString().padStart(3, '0')}.jpg`}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-0"
                    style={{
                        opacity: i === currentFrame ? 1 : 0,
                        filter: "brightness(0.5) contrast(1.2)",
                        willChange: "opacity"
                    }}
                />
            ))}
        </div>
    );
};

export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Parallax & Smooth Physics
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    // Mouse Tracking for Interactive HUD
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 100 });
    const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 100 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div ref={containerRef} className="relative min-h-[200vh] w-full bg-[#0A0F1A] font-sans text-white overflow-x-hidden selection:bg-accent/30">

            {/* HD Background Layer with Ken Burns & Parallax */}
            <motion.div
                style={{ y: y1 }}
                className="fixed inset-0 z-0 overflow-hidden"
            >
                <motion.div
                    animate={{
                        scale: [1.1, 1.25, 1.1],
                        x: [-10, 10, -10],
                        y: [-10, 5, -10],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute inset-0 bg-black"
                >
                    <FrameSequencePlayer />
                </motion.div>

                {/* Advanced Light Leak / Breathing Atmosphere */}
                <motion.div
                    animate={{
                        opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0F1A]/30 to-[#0A0F1A]"
                />

                {/* Cinematic Pulse */}
                <motion.div
                    animate={{
                        opacity: [0, 0.15, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(14,165,233,0.2)_0%,transparent_60%)]"
                />

                {/* Biological Particles System */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <BiologicalParticle key={i} index={i} />
                    ))}
                </div>
            </motion.div>

            {/* Interactive HUD Layer (HD Scanning) */}
            <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden opacity-30">
                {/* Dynamic Cursor Target */}
                <motion.div
                    style={{ x: smoothMouseX, y: smoothMouseY }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 size-64 border-[0.5px] border-accent/20 rounded-full flex items-center justify-center"
                >
                    <div className="size-full animate-spin-slow opacity-20 border-t border-accent" />
                    <Crosshair className="text-accent/40" size={20} />
                </motion.div>

                {/* Grid System Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.01)_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div>

            {/* Navigation (Sticky / Premium) */}
            <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 group cursor-pointer"
                    >
                        <div className="size-12 glass-panel-hd rounded-xl flex items-center justify-center shadow-2xl group-hover:neon-glow-premium transition-all duration-500">
                            <Pill className="text-accent group-hover:text-white transition-colors" size={26} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter uppercase leading-none text-white">SmartPill</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="size-1.5 bg-stable rounded-full animate-pulse" />
                                <p className="text-[10px] text-accent font-bold tracking-[0.3em] uppercase opacity-70">
                                    BIO-INTELLIGENCE v2.4
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-8"
                    >
                        <div className="hidden md:flex items-center gap-8 text-xs font-black tracking-widest uppercase text-slate-400">
                            <Link href="/dashboard" className="hover:text-accent transition-colors">Neural Link</Link>
                            <Link href="/analysis" className="hover:text-accent transition-colors">Genomics</Link>
                        </div>
                        <Link href="/dashboard" className="px-6 py-2.5 glass-panel-hd rounded-full text-xs font-black tracking-widest uppercase hover:bg-white/10 transition-all hover:scale-105 active:scale-95 border-accent/20 text-accent">
                            Command Access
                        </Link>
                    </motion.div>
                </div>
            </nav>

            {/* Hero Main Area */}
            <main className="relative z-20 pt-[25vh]">
                <section className="max-w-7xl mx-auto px-8">
                    <motion.div
                        style={{ opacity }}
                        className="max-w-4xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="scanline inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel-hd border-accent/20 mb-8"
                        >
                            <span className="size-2 bg-accent rounded-full animate-ping" />
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-accent">
                                System Status: Optimal
                            </span>
                        </motion.div>

                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] italic text-white"
                            >
                                BEYOND <br />
                                <span className="not-italic text-glow-accent text-accent">SURGERY.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.6 }}
                                className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed font-medium mt-8 border-l-2 border-accent/30 pl-8"
                            >
                                Harness the power of ingestible micro-robotics.
                                Real-time clinical intelligence from the inside out.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="mt-16 flex flex-wrap gap-8"
                        >
                            <Link
                                href="/dashboard"
                                className="group relative px-12 py-6 bg-primary rounded-2xl font-black text-xl uppercase tracking-tighter transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(14,165,233,0.5)] active:scale-95 flex items-center gap-4 overflow-hidden"
                            >
                                <span className="relative z-10">Initiate Mission</span>
                                <ArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" size={28} />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </Link>

                            <button className="px-12 py-6 glass-panel-hd border-white/10 rounded-2xl font-black text-xl uppercase tracking-tighter hover:bg-white/5 transition-all flex items-center gap-3">
                                <Activity size={24} className="text-accent" />
                                <span>Tech Specs</span>
                            </button>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Dynamic Feature Tiles */}
                <section className="mt-[30vh] max-w-7xl mx-auto px-8 pb-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Zap, title: "Neural Link", desc: "Ultra-low latency connection between operator and pill." },
                        { icon: ShieldCheck, title: "Bio-Secure", desc: "Military-grade encryption for patient biometric data." },
                        { icon: Activity, title: "Deep Scan", desc: "Multi-spectral imaging beyond the reach of endoscopy." }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="glass-panel-hd p-8 rounded-[2rem] hover:border-accent/30 transition-colors group cursor-default"
                        >
                            <div className="size-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                                <feature.icon className="text-accent" size={32} />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight mb-4 uppercase">{feature.title}</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </section>
            </main>

            {/* Premium Bottom HUD Bar */}
            <div className="fixed bottom-0 left-0 w-full z-40 p-8 flex justify-between items-end pointer-events-none">
                <div className="glass-panel-hd px-6 py-4 rounded-2xl border-white/5 opacity-50">
                    <p className="hud-text text-accent">SATELLITE_LINK: STABLE</p>
                    <p className="hud-text text-white mt-1">UPLINK_SPEED: 4.2 GB/S</p>
                </div>
                <div className="text-right opacity-30">
                    <p className="hud-text">Designed by Antigravity AI</p>
                    <p className="hud-text font-black text-accent mt-1">PRO_EDITION // 2026</p>
                </div>
            </div>

            {/* Custom Styles for Spin */}
            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}</style>
        </div>
    );
}
