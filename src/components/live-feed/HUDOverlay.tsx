"use client";

import { motion } from "framer-motion";
import { Maximize2, Play, SkipBack, SkipForward, Info } from "lucide-react";

export default function HUDOverlay({ telemetry }: { telemetry: any }) {
    return (
        <div className="relative aspect-square max-h-[600px] w-full mx-auto bg-black rounded-full overflow-hidden border-2 border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.8)] group">
            {/* Circular Endoscopic View Simulation */}
            <video
                src="/live_feed.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-[#1a0a0a]/30 to-[#0a1a0a]/40 mixes-blend-overlay" />

            {/* HUD Markers */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Crosshairs */}
                <div className="w-48 h-px bg-accent/20" />
                <div className="w-px h-48 bg-accent/20 absolute" />

                {/* Depth Indicators */}
                <div className="absolute top-1/4 right-1/4 w-8 h-px bg-accent/40" />
                <div className="absolute bottom-1/4 left-1/4 w-8 h-px bg-accent/40" />
            </div>

            {/* Terminal Overlay */}
            <div className="absolute top-8 left-8 p-4 glass-panel rounded-lg border-white/5 pointer-events-none flex flex-col gap-1">
                <p className="hud-text text-accent font-black">AI_ACTION_LOG_v4.0</p>
                <div className="h-[2px] w-full bg-accent/20 mb-1" />
                <p className="hud-text text-[8px] text-white/60 select-none">SCANNING_MUCOSA... OK</p>
                <p className="hud-text text-[8px] text-accent/80 select-none">ANOMALY_DETECTED: P4-B</p>
                <p className="hud-text text-[8px] text-white/60 select-none">AUTO_VECTOR_CORRECTION... 14ms</p>
            </div>

            {/* Telemetry Labels */}
            <div className="absolute bottom-8 right-12 text-right pointer-events-none">
                <p className="hud-text text-white/40 mb-1">Orientation</p>
                <p className="hud-text text-accent font-black text-xl leading-none">P: 14.2°</p>
                <p className="hud-text text-accent font-black text-xl leading-none">Y: -2.1°</p>
                <p className="hud-text text-accent font-black text-xl leading-none">R: 0.4°</p>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-4 px-6 py-3 glass-panel rounded-full shadow-2xl border-white/10">
                    <button className="text-white/60 hover:text-white transition-colors"><SkipBack size={18} /></button>
                    <button className="bg-accent size-10 rounded-full flex items-center justify-center text-black shadow-lg shadow-accent/20 hover:scale-110 transition-transform">
                        <Play size={20} fill="currentColor" />
                    </button>
                    <button className="text-white/60 hover:text-white transition-colors"><SkipForward size={18} /></button>
                    <div className="w-px h-4 bg-white/10" />
                    <button className="text-white/60 hover:text-white transition-colors"><Maximize2 size={18} /></button>
                </div>
            </div>

            {/* Vignette & Grain */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_100%)]" />
        </div>
    );
}
