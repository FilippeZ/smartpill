"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import AlertBanner from "@/components/AlertBanner";
import HUDHeader from "@/components/live-feed/HUDHeader";
import HUDOverlay from "@/components/live-feed/HUDOverlay";
import InterventionConsole from "@/components/live-feed/InterventionConsole";
import PropulsionControl from "@/components/live-feed/PropulsionControl";
import BiomarkerPanel from "@/components/live-feed/BiomarkerPanel";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_TELEMETRY = {
    ph: 7.2,
    temperature: 37.1,
    uptime: 4500,
    battery: 88,
    ox: 99,
    depth: 12.4
};

export default function LiveFeedDashboard() {
    const [telemetry, setTelemetry] = useState<any>(MOCK_TELEMETRY);
    const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'demo'>('connecting');

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/telemetry");

        const timeout = setTimeout(() => {
            if (ws.readyState !== WebSocket.OPEN) {
                console.log("WebSocket timeout. Falling back to DEMO mode.");
                setConnectionState('demo');
            }
        }, 3000);

        ws.onopen = () => {
            clearTimeout(timeout);
            setConnectionState('connected');
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setTelemetry(data);
            } catch (e) {
                console.error("Failed to parse telemetry", e);
            }
        };

        ws.onclose = () => {
            setConnectionState('demo');
        };

        return () => {
            clearTimeout(timeout);
            ws.close();
        };
    }, []);

    // Simulated data update for demo mode
    useEffect(() => {
        if (connectionState === 'demo') {
            const interval = setInterval(() => {
                setTelemetry((prev: any) => ({
                    ...prev,
                    ph: prev.ph + (Math.random() * 0.1 - 0.05),
                    temperature: prev.temperature + (Math.random() * 0.2 - 0.1),
                    uptime: prev.uptime + 1
                }));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [connectionState]);

    return (
        <div className="flex h-screen overflow-hidden bg-background-dark selection:bg-accent/30">
            <Sidebar />

            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Connection Status Overlay */}
                <AnimatePresence>
                    {connectionState === 'connecting' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-background-dark/80 backdrop-blur-md"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="size-16 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                                <p className="font-mono text-accent animate-pulse tracking-widest text-sm">
                                    ESTABLISHING_SECURE_TELEMETRY...
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AlertBanner
                    message={
                        connectionState === 'demo' ? "OFFLINE MODE - SIMULATED TELEMETRY ACTIVE" :
                            telemetry?.ph < 3 ? "CRITICAL ACIDITY DETECTED - POTENTIAL CORROSION" :
                                "NOMINAL OPERATION - PILL STATUS: ACTIVE"
                    }
                />

                <HUDHeader telemetry={telemetry} />

                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.05)_0%,transparent_60%)] relative">
                    {/* Grid Background Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

                    <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 relative z-10">

                        {/* Left Column: Digital Twin & Interventions */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="col-span-12 lg:col-span-3 space-y-6"
                        >
                            <InterventionConsole telemetry={telemetry} />
                        </motion.div>

                        {/* Center Stage: Live Video Feed */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="col-span-12 lg:col-span-6 flex flex-col justify-center gap-8 relative"
                        >
                            <div className="absolute -inset-10 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
                            <HUDOverlay telemetry={telemetry} />

                            <div className="flex items-center justify-center gap-4 pointer-events-none">
                                <span className="size-2 bg-accent rounded-full animate-ping" />
                                <div className="hud-text text-[10px] text-accent/60 font-bold">
                                    LATENCY: {connectionState === 'demo' ? 'SIMULATED' : '14ms'} |
                                    UPTIME: {Math.floor(telemetry?.uptime / 3600)}h {Math.floor((telemetry?.uptime % 3600) / 60)}m |
                                    CORE_TEMP: {telemetry?.temperature?.toFixed(1)}°C
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Controls & AI */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                            className="col-span-12 lg:col-span-3 space-y-6"
                        >
                            <PropulsionControl />
                        </motion.div>

                        {/* Bottom Panel: Biomarkers */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="col-span-12"
                        >
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent mb-8" />
                            <BiomarkerPanel telemetry={telemetry} />
                        </motion.div>
                    </div>
                </div>

                {/* Technical HUD Details (Corner Overlays) */}
                <div className="absolute bottom-6 right-6 pointer-events-none hidden md:block">
                    <div className="flex flex-col items-end gap-1 opacity-40">
                        <p className="hud-text text-white">PROC_NODE: 742-X</p>
                        <p className="hud-text text-accent font-black">ENCRYPTION: AES-256-GCM</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
