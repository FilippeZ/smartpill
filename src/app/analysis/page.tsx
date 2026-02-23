"use client";

import Sidebar from "@/components/Sidebar";
import HUDHeader from "@/components/live-feed/HUDHeader";
import DNAMatchWidget from "@/components/live-feed/DNAMatchWidget";
import { motion, AnimatePresence } from "framer-motion";
import { Dna, Activity, ShieldCheck, Microscope } from "lucide-react";
import { useState, useEffect } from "react";

export default function DNAGenomicAnalysis() {
    const [stats, setStats] = useState({
        depth: 450,
        errorRate: 0.002,
        lamb1: 94.2,
        cdh1: 99.8,
        tp53: 88.4
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                depth: prev.depth + (Math.random() > 0.5 ? 1 : 0), // slowly climbs
                errorRate: Math.max(0.001, prev.errorRate + (Math.random() * 0.0002 - 0.0001)),
                lamb1: Math.min(99.9, Math.max(90.0, prev.lamb1 + (Math.random() * 0.2 - 0.1))),
                cdh1: Math.min(99.9, Math.max(98.0, prev.cdh1 + (Math.random() * 0.1 - 0.05))),
                tp53: Math.min(95.0, Math.max(80.0, prev.tp53 + (Math.random() * 0.4 - 0.2))),
            }));
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-background-dark text-slate-100 selection:bg-accent/30">
            <Sidebar />

            <main className="flex-1 flex flex-col overflow-hidden relative">
                <HUDHeader telemetry={null} />

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05)_0%,transparent_60%)] relative">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

                    <div className="max-w-[1400px] mx-auto space-y-8 relative z-10">

                        {/* Header Section */}
                        <div className="flex justify-between items-end border-b border-stable/20 pb-6">
                            <div>
                                <h1 className="text-3xl font-black tracking-tighter text-white flex items-center gap-3 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                    GENOMIC_SURVEILLANCE <Dna className="text-stable animate-pulse drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                </h1>
                                <p className="text-stable/60 uppercase text-[10px] tracking-[0.3em] font-bold mt-1">
                                    Real-time sequencing & biomarker indexing
                                </p>
                            </div>
                            <div className="flex gap-8">
                                <QuickStat label="SEQUENCING_DEPTH" value={`${stats.depth}x`} color="text-white" />
                                <QuickStat label="ERROR_RATE" value={`${stats.errorRate.toFixed(4)}%`} color="text-stable" />
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-8">

                            {/* Main Content: DNA Matching */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="col-span-8"
                            >
                                <DNAMatchWidget />
                            </motion.div>

                            {/* Sidebar Area: Biomarkers & Intel */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="col-span-4 space-y-6"
                            >
                                <div className="glass-panel p-6 border-stable/20 bg-surface-dark/40 backdrop-blur-xl rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.3)] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-stable/5 rounded-full blur-[50px] pointer-events-none" />

                                    <div className="flex items-center gap-2 mb-6 relative z-10">
                                        <Activity className="text-stable w-4 h-4 animate-pulse" />
                                        <h3 className="text-[11px] font-mono text-stable font-bold uppercase tracking-[0.2em]">ONCOLOGY_MARKERS</h3>
                                    </div>
                                    <div className="space-y-4 relative z-10">
                                        <MarkerItem label="LAMB1" status="DETECTION_HIGH" confidence={stats.lamb1} color="bg-critical" />
                                        <MarkerItem label="CDH1" status="STABLE" confidence={stats.cdh1} color="bg-stable" />
                                        <MarkerItem label="TP53" status="MONITORING" confidence={stats.tp53} color="bg-warning" />
                                    </div>
                                </div>

                                <motion.div
                                    className="glass-panel p-6 border-stable/20 bg-gradient-to-br from-stable/10 to-transparent rounded-3xl border-stable/10 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden"
                                    animate={{ borderColor: "rgba(16, 185, 129, 0.3)" }}
                                >
                                    <div className="absolute -bottom-4 -right-4 p-2 opacity-[0.03]">
                                        <Microscope className="w-40 h-40 text-stable" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Microscope size={16} className="text-stable drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                            <span className="text-[11px] font-mono text-stable font-bold uppercase tracking-[0.2em]">Genomic Intel</span>
                                        </div>
                                        <p className="text-[13px] text-slate-300 italic leading-relaxed font-light">
                                            "The current sequence profile suggests a 78% correlation with known GI-tract premalignant conditions. <span className="text-stable font-bold">Increased surveillance of the LAMB1 promoter region is recommended</span> during the next 48 hours of capsule transit."
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

function QuickStat({ label, value, color }: { label: string, value: string, color?: string }) {
    return (
        <div className="text-right">
            <p className="text-[9px] text-stable/60 font-mono tracking-widest uppercase mb-1">{label}</p>
            <p className={`text-2xl font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] ${color}`}>{value}</p>
        </div>
    );
}

function MarkerItem({ label, status, confidence, color }: { label: string, status: string, confidence: number, color: string }) {
    const isHigh = status.includes("HIGH");
    return (
        <div className="group flex justify-between items-center py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors">
            <div>
                <p className="text-base font-black text-white">{label}</p>
                <p className={`text-[9px] font-mono tracking-widest mt-0.5 ${isHigh ? 'text-critical drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 'text-slate-400'}`}>{status}</p>
            </div>
            <div className="text-right w-1/3">
                <p className="text-sm font-black text-white mb-1">{confidence.toFixed(1)}%</p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${confidence}%` }}
                        transition={{ ease: "linear", duration: 1.2 }}
                        className={`h-full ${color} shadow-[0_0_8px_${color.replace('bg-', '')}]`}
                    />
                </div>
            </div>
        </div>
    );
}
