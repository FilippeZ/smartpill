"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
    Settings,
    Cpu,
    Brain,
    Shield,
    Wifi,
    Database,
    RefreshCcw,
    Sliders,
    Save
} from "lucide-react";
import { motion } from "framer-motion";

export default function SystemSettings() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8000/api/settings")
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch("http://localhost:8000/api/settings", {
                method: "POST", // The backend uses POST for sync/save
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });
            // Show some success feedback if needed
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-background-dark text-accent font-mono animate-pulse">SYNCHRONIZING_CORE_PARAMS...</div>;

    return (
        <div className="flex h-screen bg-background-dark">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header title="System Console" />

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <header className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-black text-white uppercase tracking-tighter">System Console_v2.4</h1>
                                <p className="text-sm text-white/40 font-medium">Core Calibration and Operational Limits</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-6 py-2 bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary/30 transition-all disabled:opacity-50"
                                >
                                    <Save size={14} /> {saving ? "SAVING..." : "COMMIT_CHANGES"}
                                </button>
                                <button className="px-4 py-2 bg-accent/20 text-accent border border-accent/20 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-accent/30 transition-all">
                                    <RefreshCcw size={14} /> Full Recalibration
                                </button>
                            </div>
                        </header>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Pill Calibration */}
                            <section className="glass-panel p-6 rounded-2xl space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-accent/10 text-accent">
                                        <Sliders size={18} />
                                    </div>
                                    <h3 className="text-sm font-black text-white uppercase">Operational Thresholds</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between hud-text">
                                            <span className="text-white/40">Critical pH Level</span>
                                            <span className="text-accent">{settings.alert_thresholds.ph.min}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="7" step="0.1"
                                            value={settings.alert_thresholds.ph.min}
                                            onChange={(e) => setSettings({ ...settings, alert_thresholds: { ...settings.alert_thresholds, ph: { ...settings.alert_thresholds.ph, min: parseFloat(e.target.value) } } })}
                                            className="w-full accent-accent bg-slate-800 rounded-lg cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between hud-text">
                                            <span className="text-white/40">Encryption Status</span>
                                            <span className="text-stable">Active</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full w-[100%] bg-stable shadow-[0_0_10px_#10B981]" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Network / Privacy */}
                            <section className="glass-panel p-6 rounded-2xl space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Shield size={18} />
                                    </div>
                                    <h3 className="text-sm font-black text-white uppercase">Security Protocol</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-xs font-bold text-white/60">Edge Computing (On-Pill)</span>
                                        <input
                                            type="checkbox"
                                            checked={settings.privacy_settings.edge_encryption}
                                            onChange={(e) => setSettings({ ...settings, privacy_settings: { ...settings.privacy_settings, edge_encryption: e.target.checked } })}
                                            className="accent-primary"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-xs font-bold text-white/60">Auto-Label Anomaly</span>
                                        <input
                                            type="checkbox"
                                            checked={settings.proscan_settings.auto_label}
                                            onChange={(e) => setSettings({ ...settings, proscan_settings: { ...settings.proscan_settings, auto_label: e.target.checked } })}
                                            className="accent-primary"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* AI Parameters */}
                            <section className="col-span-2 glass-panel p-6 rounded-2xl space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-warning/10 text-warning">
                                        <Brain size={18} />
                                    </div>
                                    <h3 className="text-sm font-black text-white uppercase">ProScan AI Sensitivity</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between hud-text">
                                            <span className="text-white/40">Confidence Threshold</span>
                                            <span className="text-warning">{settings.proscan_settings.confidence_threshold * 100}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="1" step="0.01"
                                            value={settings.proscan_settings.confidence_threshold}
                                            onChange={(e) => setSettings({ ...settings, proscan_settings: { ...settings.proscan_settings, confidence_threshold: parseFloat(e.target.value) } })}
                                            className="w-full accent-warning bg-slate-800 rounded-lg cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
