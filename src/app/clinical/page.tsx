"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Activity, Shield, Thermometer, Maximize, AlertTriangle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import HUDHeader from "@/components/live-feed/HUDHeader";

export default function AIAnalysisPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<any>(null);

    const [latency, setLatency] = useState("-");

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setIsProcessing(true);
            setResults(null);

            const formData = new FormData();
            formData.append("file", file);

            const startTime = performance.now();
            try {
                const response = await fetch("http://localhost:8000/process", {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();
                const endTime = performance.now();
                setLatency((endTime - startTime).toFixed(0) + "ms");
                setResults(data);
            } catch (error) {
                console.error("Processing failed", error);
                setLatency("FAILED");
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const generateClinicalReport = (data: any) => {
        if (!data || !data.results) return "Awaiting neural processing of ingested capsule frames...";

        const preds = data.results;
        const anatomy = [
            { name: "stomach", val: preds.stomach },
            { name: "small bowel", val: preds.small_bowel },
            { name: "colon", val: preds.colon }
        ].sort((a, b) => b.val - a.val)[0];

        const pathology = [
            { name: "polyp", val: preds.polyp },
            { name: "ulcer", val: preds.ulcer },
            { name: "blood", val: preds.blood }
        ].sort((a, b) => b.val - a.val)[0];

        let recommendation = pathology.val > 0.5
            ? `Immediate follow-up endoscopy required targeting the ${anatomy.name}.`
            : "Routine surveillance recommended. No critical life-threatening pathology detected.";

        return `The AI has localized the frame to the ${anatomy.name} with ${(anatomy.val * 100).toFixed(1)}% confidence. ${pathology.val > 0.1 ? `Suspicious ${pathology.name} markers detected (${(pathology.val * 100).toFixed(1)}%).` : 'No obvious pathological markers observed.'} Recommendation: ${recommendation}`;
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-dark text-slate-100 selection:bg-accent/30">
            <Sidebar />

            <main className="flex-1 flex flex-col overflow-hidden relative">
                <HUDHeader telemetry={null} />

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.05)_0%,transparent_60%)] relative">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

                    <div className="max-w-[1400px] mx-auto space-y-8 relative z-10">
                        {/* Header Area */}
                        <div className="flex justify-between items-end border-b border-accent/20 pb-6">
                            <div>
                                <h1 className="text-3xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                                    CLINICAL_AI_ANALYSIS
                                    <span className="text-accent text-sm ml-3 font-mono uppercase tracking-widest bg-accent/10 border border-accent/20 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(34,211,238,0.2)]">v1.2.4</span>
                                </h1>
                                <p className="text-accent/60 mt-1 uppercase text-[10px] tracking-[0.3em] font-bold">End-to-End Capsule Endoscopy Pipeline (EndoL2H + GalarML)</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="flex flex-col items-end">
                                    <p className="text-[9px] text-accent/60 font-mono tracking-widest uppercase">NEURAL_LOAD</p>
                                    <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden mt-1 backdrop-blur-sm">
                                        <motion.div
                                            animate={{ width: isProcessing ? "95%" : results ? "35%" : "15%" }}
                                            transition={{ duration: 1.5, ease: "easeInOut" }}
                                            className="h-full bg-accent shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-8">
                            {/* Main Stage: Image Upload & Comparison */}
                            <div className="col-span-8 space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-panel p-1 border-accent/20 bg-white/[0.02] rounded-3xl overflow-hidden relative group shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                                >
                                    <div className="aspect-video bg-black/60 flex items-center justify-center relative overflow-hidden backdrop-blur-xl">
                                        {!selectedFile && (
                                            <label className="cursor-pointer group flex flex-col items-center">
                                                <div className="size-20 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                                                    <Upload className="w-8 h-8 text-accent/60 group-hover:text-accent transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                                                </div>
                                                <span className="text-[11px] font-mono font-bold text-accent/60 tracking-[0.3em] uppercase group-hover:text-accent transition-colors">INGEST_RAW_DATA_PATH</span>
                                                <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                                            </label>
                                        )}

                                        {selectedFile && isProcessing && (
                                            <div className="text-center z-20">
                                                <div className="relative size-20 mx-auto mb-6">
                                                    <div className="absolute inset-0 border-4 border-t-accent border-accent/10 rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                                                    <Activity className="w-8 h-8 text-accent absolute inset-0 m-auto animate-pulse" />
                                                </div>
                                                <p className="text-[11px] text-accent font-mono font-bold tracking-[0.3em] uppercase animate-pulse drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                                                    ENHANCING_RESOLUTION_SPATIAL_CGAN...
                                                </p>
                                            </div>
                                        )}

                                        {results && (
                                            <div className="relative w-full h-full group">
                                                <img src={selectedFile ? URL.createObjectURL(selectedFile) : ""} className="absolute inset-0 w-full h-full object-contain opacity-30 blur-md grayscale" />
                                                <motion.img
                                                    initial={{ opacity: 0, scale: 1.1 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.8 }}
                                                    src={`http://localhost:8000${results.hr_image_url}`}
                                                    className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent pointer-events-none" />
                                                <div className="absolute bottom-4 left-4 bg-background-dark/80 backdrop-blur-md px-4 py-2 rounded-xl border border-accent/20 flex items-center gap-3">
                                                    <Maximize className="w-4 h-4 text-accent animate-ping absolute opacity-50" />
                                                    <Maximize className="w-4 h-4 text-accent relative z-10" />
                                                    <span className="text-[10px] font-mono text-accent tracking-[0.2em] font-bold">HR_OUTPUT: 1024x1024_SPATIAL_SAB</span>
                                                </div>

                                                {/* Scanline overlay for aesthetic */}
                                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Prediction Grid */}
                                <AnimatePresence>
                                    {results && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                            className="grid grid-cols-3 gap-6"
                                        >
                                            <ResultCard title="ANATOMY" icon={<Activity size={18} />}>
                                                <StatBar label="Stomach" val={results.results.stomach} />
                                                <StatBar label="Small Bowel" val={results.results.small_bowel} />
                                                <StatBar label="Colon" val={results.results.colon} />
                                            </ResultCard>

                                            <ResultCard title="PATHOLOGY" icon={<AlertTriangle size={18} className="drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />} customColor="border-critical/30">
                                                <StatBar label="Polyp" val={results.results.polyp} color="bg-critical" />
                                                <StatBar label="Ulcer" val={results.results.ulcer} color="bg-warning" />
                                                <StatBar label="Blood" val={results.results.blood} color="bg-rose-600" />
                                            </ResultCard>

                                            <ResultCard title="TECHNICAL" icon={<Shield size={18} className="drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />} customColor="border-stable/30">
                                                <StatBar label="Clear" val={results.results.clear} color="bg-stable" />
                                                <StatBar label="Bubbles" val={results.results.bubbles} color="bg-slate-400" />
                                                <StatBar label="Dirt" val={results.results.dirt} color="bg-slate-500" />
                                            </ResultCard>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Sidebar: Pipeline Telemetry */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="col-span-4 space-y-6"
                            >
                                <div className="glass-panel p-6 border-accent/20 bg-surface-dark/40 backdrop-blur-lg rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Activity className="text-accent w-4 h-4 animate-pulse" />
                                        <h3 className="text-[11px] font-mono text-accent font-bold uppercase tracking-[0.2em]">PIPELINE_STATUS</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <StatusItem label="EndoL2H Generator" status="ACTIVE" info="v.latest_G" color="text-stable" />
                                        <StatusItem label="GalarML Classifier" status="ACTIVE" info="EfficientNet_B2" color="text-stable" />
                                        <StatusItem label="Inference Device" status="CUDA_0" info="RTX_4090" color="text-primary" />
                                        <StatusItem label="Latency" status={latency} info="End-to-End" color="text-warning" />

                                        <div className="pt-4 mt-4 border-t border-white/5">
                                            <button
                                                onClick={() => { setResults(null); setSelectedFile(null); setLatency("-"); }}
                                                className="w-full py-3 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-xl text-accent font-mono text-[10px] tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                                            >
                                                TERMINATE_&_RESET_SESSION
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <motion.div
                                    className="glass-panel p-6 border-accent/20 bg-gradient-to-br from-accent/10 to-transparent rounded-2xl relative overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.05)]"
                                    animate={{
                                        borderColor: results ? "rgba(34, 211, 238, 0.4)" : "rgba(34, 211, 238, 0.1)"
                                    }}
                                >
                                    <div className="absolute -top-4 -right-4 p-2 opacity-[0.03]">
                                        <Thermometer className="w-32 h-32 text-accent" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Shield className="text-accent w-4 h-4" />
                                            <h3 className="text-[11px] font-mono text-accent font-bold uppercase tracking-[0.2em]">CLINICAL_DECISION_SUPPORT</h3>
                                        </div>
                                        <p className="text-[13px] text-slate-300 italic leading-relaxed font-light">
                                            "{generateClinicalReport(results)}"
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

function ResultCard({ title, icon, children, customColor }: any) {
    return (
        <div className={`glass-panel p-5 border ${customColor || 'border-accent/30'} bg-white/[0.02] rounded-2xl space-y-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
            <div className="flex items-center gap-2 mb-2">
                <span className="p-2 bg-white/5 rounded-lg text-accent">{icon}</span>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">{title}</span>
            </div>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
}

function StatBar({ label, val, color = "bg-accent" }: any) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500 uppercase">{label}</span>
                <span className="text-white">{(val * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${val * 100}%` }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    );
}

function StatusItem({ label, status, info, color = "text-accent" }: any) {
    return (
        <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-slate-400">{label}</span>
            <div className="text-right">
                <span className={`${color}`}>{status}</span>
                <p className="text-[8px] text-slate-600 uppercase">{info}</p>
            </div>
        </div>
    );
}
