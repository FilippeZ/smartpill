"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Syringe, Thermometer, ShieldCheck, Zap, Activity } from "lucide-react";

export default function InterventionConsole({ telemetry }: { telemetry: any }) {
    const [dosage, setDosage] = useState(25);
    const [biopsyStep, setBiopsyStep] = useState(0);

    return (
        <div className="space-y-6">
            {/* Digital Twin Widget */}
            <div className="glass-panel p-5 rounded-xl border-accent/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Activity size={40} className="text-accent" />
                </div>
                <h3 className="hud-text text-white/50 mb-4">Internal Telemetry</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="hud-text text-[10px] text-accent font-black">Internal pH</p>
                        <p className="text-2xl font-black text-white">{telemetry?.ph || 6.5}</p>
                    </div>
                    <div>
                        <p className="hud-text text-[10px] text-stable font-black">Local SpO2</p>
                        <p className="text-2xl font-black text-white">99.4 <span className="text-[10px] text-slate-500">%</span></p>
                    </div>
                </div>
            </div>

            {/* Drug Delivery */}
            <div className="glass-panel p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-6">
                    <Syringe size={18} className="text-accent" />
                    <h3 className="hud-text text-white font-black">Targeted Drug Delivery</h3>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between hud-text">
                            <span className="text-white/60">Dosage Amount</span>
                            <span className="text-accent">{dosage} mg</span>
                        </div>
                        <input
                            type="range"
                            value={dosage}
                            onChange={(e) => setDosage(Number(e.target.value))}
                            className="w-full accent-accent bg-slate-800 rounded-lg cursor-pointer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-lg">
                        <button className="py-2 hud-text text-[10px] rounded-md bg-slate-800 text-white font-bold">Instant</button>
                        <button className="py-2 hud-text text-[10px] rounded-md text-slate-500 font-bold hover:text-white">Timed Release</button>
                    </div>

                    <button className="w-full py-4 bg-primary/20 border border-primary/40 text-accent font-black text-xs uppercase hover:bg-primary/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10">
                        <Zap size={14} />
                        Deploy Microneedles & Inject
                    </button>
                </div>
            </div>

            {/* Biopsy Console */}
            <div className="glass-panel p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-6">
                    <Thermometer size={18} className="text-warning" />
                    <h3 className="hud-text text-white font-black">Biopsy Interface</h3>
                </div>

                <button
                    onClick={() => setBiopsyStep((prev) => (prev + 1) % 4)}
                    className="w-full py-3 bg-warning/10 border border-warning/20 text-warning font-black text-xs uppercase hover:bg-warning/20 transition-all mb-6"
                >
                    Activate Micro-Heater
                </button>

                <div className="flex items-center justify-between px-2">
                    {['Heated', 'Tissue Cut', 'Secured'].map((step, i) => (
                        <div key={step} className="flex flex-col items-center gap-2">
                            <div className={`size-3 rounded-full transition-all duration-500 ${biopsyStep > i ? 'bg-stable shadow-[0_0_10px_#10B981]' : 'bg-slate-800'}`} />
                            <span className={`hud-text text-[8px] ${biopsyStep > i ? 'text-stable' : 'text-slate-600'}`}>{step}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
