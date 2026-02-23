"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Dna, CheckCircle2, AlertCircle, Info, Activity } from "lucide-react";
import { useState, useEffect } from "react";

interface NucleotideProps {
    char: string;
    isMatch?: boolean;
    isGap?: boolean;
}

const Nucleotide = ({ char, isMatch, isGap }: NucleotideProps) => {
    const colors: Record<string, string> = {
        A: "text-accent border-accent/30 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]",
        C: "text-stable border-stable/30 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]",
        T: "text-warning border-warning/30 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]",
        G: "text-rose-500 border-rose-500/30 shadow-[inset_0_0_10px_rgba(244,63,94,0.1)]",
        "-": "text-slate-600 border-slate-700/50",
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
                w-10 h-12 border rounded-md flex flex-col items-center justify-center font-mono text-base font-black transition-colors duration-300
                ${isGap ? 'bg-background-dark/80 backdrop-blur-md' : 'bg-white/5'}
                ${!isMatch && !isGap ? 'bg-critical/20 border-critical flex-col-reverse' : ''}
                ${colors[char] || colors['-']}
            `}
        >
            {char}
            <div className={`w-full h-1 mt-1 rounded-full ${isMatch ? 'bg-current opacity-60' : 'bg-transparent'}`} />
        </motion.div>
    );
};

export default function DNAMatchWidget() {
    const [reference, setReference] = useState("ATGCTGGACTTGCCATGAC");
    const [sample, setSample] = useState("ATGCCTGGCTTTGCCGATG");
    const [confidence, setConfidence] = useState(94.2);

    // Simulate real-time scrolling DNA sequence
    useEffect(() => {
        const chars = ["A", "T", "G", "C"];
        const interval = setInterval(() => {
            const nextRef = chars[Math.floor(Math.random() * chars.length)];
            const isMatch = Math.random() > 0.15; // 85% match rate relative to ref
            const isGap = Math.random() > 0.95; // 5% gap rate

            let nextSam = nextRef;
            if (isGap) {
                nextSam = "-";
            } else if (!isMatch) {
                const others = chars.filter(c => c !== nextRef);
                nextSam = others[Math.floor(Math.random() * others.length)];
            }

            setReference(prev => prev.substring(1) + nextRef);
            setSample(prev => prev.substring(1) + nextSam);

            setConfidence(prev => Math.min(99.9, Math.max(90.0, prev + (Math.random() * 0.4 - 0.2))));
        }, 600);

        return () => clearInterval(interval);
    }, []);

    let mismatches = 0;
    let gaps = 0;
    for (let i = 0; i < reference.length; i++) {
        if (sample[i] === "-") gaps++;
        else if (reference[i] !== sample[i]) mismatches++;
    }

    return (
        <div className="glass-panel p-8 border-accent/20 bg-surface-dark/40 backdrop-blur-xl rounded-3xl space-y-8 shadow-[0_0_30px_rgba(34,211,238,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-50" />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <Dna size={24} className="animate-spin-slow" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">DNA Alignment Profile</h3>
                        <p className="text-[11px] text-accent font-bold uppercase tracking-widest mt-1">Gene Target: LAMB1 (Oncogenic Marker)</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="font-mono text-[9px] text-accent/60 uppercase tracking-widest mb-1">Confidence Score</p>
                        <p className="text-2xl font-black text-stable drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{confidence.toFixed(1)}%</p>
                    </div>
                    <div className="size-12 rounded-full border-2 border-stable flex items-center justify-center text-stable shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        <Activity size={24} className="animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="py-8 border-y border-white/5 relative">
                {/* Background scanning line */}
                <motion.div
                    animate={{ x: ["-10%", "110%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-accent/5 to-transparent skew-x-12 z-0"
                />

                <div className="space-y-6 overflow-hidden relative z-10 px-2 mask-edges">
                    {/* Reference Sequence */}
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] text-accent font-bold tracking-widest min-w-[120px]">REF (LAMB1)</span>
                        <div className="flex gap-2">
                            <AnimatePresence mode="popLayout">
                                {reference.split('').map((char, i) => (
                                    <Nucleotide key={`ref-${i}-${char}`} char={char} isMatch={true} />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Alignment Indicators */}
                    <div className="flex items-center gap-4 opacity-70">
                        <span className="min-w-[120px]" />
                        <div className="flex gap-2">
                            {reference.split('').map((_, i) => (
                                <div key={`ind-${i}`} className="w-10 flex justify-center items-center">
                                    {reference[i] === sample[i] ? (
                                        <div className="w-0.5 h-6 bg-stable rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                    ) : (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 24 }}
                                            className="w-0.5 h-6 bg-critical rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sample Sequence */}
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] text-white font-bold tracking-widest min-w-[120px]">PILL_SAMPLE_A1</span>
                        <div className="flex gap-2">
                            <AnimatePresence mode="popLayout">
                                {sample.split('').map((char, i) => (
                                    <Nucleotide
                                        key={`sam-${i}-${char}`}
                                        char={char}
                                        isMatch={reference[i] === sample[i]}
                                        isGap={char === '-'}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-5 bg-background-dark/50 backdrop-blur-md rounded-2xl border border-white/5 grid grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                    <div className={`size-3 rounded-full ${mismatches > 0 ? 'bg-critical shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-slate-600'}`} />
                    <p className="font-mono text-[10px] text-white/80 tracking-widest uppercase">{mismatches} Mismatches</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`size-3 rounded-full ${gaps > 0 ? 'bg-warning shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'bg-slate-600'}`} />
                    <p className="font-mono text-[10px] text-white/80 tracking-widest uppercase">{gaps} Gaps (-)</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="size-3 rounded-full bg-stable shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                    <p className="font-mono text-[10px] text-stable tracking-widest uppercase font-bold">Homology Maintained</p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-4 p-4 bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 rounded-xl"
            >
                <AlertCircle size={18} className="text-accent shrink-0 mt-0.5" />
                <p className="text-[12px] text-accent/90 font-light leading-relaxed">
                    Warning: Sequence variation detected at current locus. This correlates with <span className="font-bold text-accent">early-stage adenocarcinoma markers</span> in the LAMB1 promoter region. Continue continuous telemetry recording.
                </p>
            </motion.div>
        </div>
    );
}
