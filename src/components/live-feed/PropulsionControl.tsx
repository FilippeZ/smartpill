"use client";

import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Circle, Scan, FileText, Activity } from "lucide-react";

export default function PropulsionControl() {
    return (
        <div className="space-y-6">
            {/* AI ProScan Card */}
            <div className="glass-panel p-5 rounded-xl border-accent/20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Scan size={18} className="text-accent" />
                        <h3 className="hud-text text-white font-black">AI ProScan v4.2</h3>
                    </div>
                    <span className="size-2 rounded-full bg-stable animate-pulse shadow-[0_0_10px_#10B981]" />
                </div>

                <div className="space-y-3">
                    {[
                        { label: "Polyp (Type I)", confidence: "98.4%", color: "border-accent", bg: "bg-accent/10" },
                        { label: "Inflammation", confidence: "62.1%", color: "border-warning", bg: "bg-warning/10" },
                    ].map((anomaly) => (
                        <div key={anomaly.label} className={`flex items-center justify-between p-3 rounded-lg border ${anomaly.color} ${anomaly.bg}`}>
                            <span className="hud-text text-[10px] text-white font-bold">{anomaly.label}</span>
                            <span className="hud-text text-[10px] text-white font-black">{anomaly.confidence}</span>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-4 py-3 bg-white/5 border border-white/10 text-white/60 font-black text-[10px] uppercase hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <FileText size={14} />
                    Generate Quick Report
                </button>
            </div>

            {/* Propulsion Control */}
            <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Activity size={40} className="text-primary" />
                </div>
                <h3 className="hud-text text-white/50 mb-8">Propulsion Matrix</h3>

                <div className="flex flex-col items-center gap-4">
                    {/* D-Pad */}
                    <div className="grid grid-cols-3 gap-2">
                        <div />
                        <button className="size-12 glass-panel flex items-center justify-center text-accent hover:bg-accent/20 transition-all rounded-lg shadow-lg active:scale-95"><ChevronUp size={24} /></button>
                        <div />
                        <button className="size-12 glass-panel flex items-center justify-center text-accent hover:bg-accent/20 transition-all rounded-lg shadow-lg active:scale-95"><ChevronLeft size={24} /></button>
                        <button className="size-12 bg-accent/20 flex items-center justify-center text-accent border border-accent/50 rounded-lg shadow-inner"><Circle size={16} fill="currentColor" /></button>
                        <button className="size-12 glass-panel flex items-center justify-center text-accent hover:bg-accent/20 transition-all rounded-lg shadow-lg active:scale-95"><ChevronRight size={24} /></button>
                        <div />
                        <button className="size-12 glass-panel flex items-center justify-center text-accent hover:bg-accent/20 transition-all rounded-lg shadow-lg active:scale-95"><ChevronDown size={24} /></button>
                        <div />
                    </div>

                    <div className="w-full space-y-4 mt-4">
                        <div className="space-y-2">
                            <div className="flex justify-between hud-text text-[10px]">
                                <span className="text-white/40">Main Thrust</span>
                                <span className="text-accent uppercase font-black tracking-widest">Nominal</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "65%" }}
                                    className="h-full bg-accent shadow-[0_0_10px_#22D3EE]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between hud-text text-[10px]">
                                <span className="text-white/40">Vector Stab</span>
                                <span className="text-accent uppercase font-black tracking-widest">Active</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "42%" }}
                                    className="h-full bg-primary shadow-[0_0_10px_#0EA5E9]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
