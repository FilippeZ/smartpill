"use client";

import { Wifi, Battery, Clock, Activity, Zap, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HUDHeader({ telemetry }: { telemetry: any }) {
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="grid grid-cols-6 gap-px bg-slate-800/30 border-b border-white/5">
            {[
                { label: "Subject ID", val: "PX-99284", icon: <Users size={12} className="text-white/40" /> },
                { label: "Pill Location", val: telemetry?.location || "Unknown", icon: <Activity size={12} className="text-accent" /> },
                { label: "Connection", val: `STABLE ${telemetry?.connection_strength}%`, icon: <Wifi size={12} className="text-stable" />, status: "stable" },
                { label: "Battery", val: `${Math.floor(telemetry?.battery)}%`, icon: <Battery size={12} className="text-warning" /> },
                { label: "System Uptime", val: formatTime(telemetry?.uptime || 0), icon: <Clock size={12} className="text-white/40" /> },
                { label: "Energy Harvest", val: "4.2mW", icon: <Zap size={12} className="text-accent" /> },
            ].map((item, i) => (
                <div key={i} className="p-4 glass-panel border-none bg-transparent hover:bg-white/5 transition-colors group">
                    <p className="hud-text text-[9px] text-slate-500 font-bold mb-1 flex items-center gap-2">
                        {item.icon}
                        {item.label}
                    </p>
                    <p className={cn(
                        "text-sm font-black tracking-tighter uppercase",
                        item.status === 'stable' ? "text-stable" : "text-white group-hover:text-accent transition-colors"
                    )}>
                        {item.val}
                    </p>
                </div>
            ))}
        </div>
    );
}
