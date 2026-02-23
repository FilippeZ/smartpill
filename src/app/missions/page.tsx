"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
    History,
    Search,
    Download,
    ChevronRight,
    Clock,
    Target
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function MissionHistory() {
    const [missions, setMissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/api/missions")
            .then(res => res.json())
            .then(data => {
                setMissions(data);
                setLoading(false);
            })
            .catch(err => console.error("Failed to fetch missions", err));
    }, []);

    const stats = [
        { label: "Total Missions", val: missions.length.toString(), icon: History, color: "text-accent" },
        { label: "Avg Mission Duration", val: "06:14:02", icon: Clock, color: "text-primary" },
        { label: "AI Detection Accuracy", val: "99.8%", icon: Target, color: "text-stable" },
    ];

    return (
        <div className="flex h-screen bg-background-dark">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header title="Mission History" />

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-6">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:neon-border transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-3 rounded-lg bg-white/5", stat.color)}>
                                            <stat.icon size={24} />
                                        </div>
                                        <div>
                                            <p className="hud-text text-white/40 text-[10px]">{stat.label}</p>
                                            <p className="text-2xl font-black text-white">{stat.val}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Missions Table */}
                        <div className="glass-panel rounded-2xl overflow-hidden border-white/5">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-lg font-black text-white uppercase tracking-tighter">Mission Archive_v2.4</h2>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search size={14} className="absolute inset-y-0 left-3 mt-2.5 text-white/40" />
                                        <input className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:neon-border outline-none" placeholder="Search Archives..." />
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 text-accent rounded-lg text-xs font-bold hover:bg-accent/30 transition-all">
                                        <Download size={14} /> Export CSV
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="p-20 text-center hud-text text-white/20 animate-pulse">FETCHING_REMOTE_ARCHIVES...</div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 hud-text text-[10px] text-white/40">
                                        <tr>
                                            <th className="px-6 py-4 font-black">Mission ID</th>
                                            <th className="px-6 py-4 font-black">Date & Time</th>
                                            <th className="px-6 py-4 font-black">Type</th>
                                            <th className="px-6 py-4 font-black">Clinical Findings</th>
                                            <th className="px-6 py-4 font-black">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {missions.map((m, i) => (
                                            <tr key={m.id} className="group hover:bg-white/5 transition-all">
                                                <td className="px-6 py-5 font-mono text-xs text-white group-hover:text-accent transition-colors">{m.id.split('-')[0]}</td>
                                                <td className="px-6 py-5">
                                                    <p className="text-xs font-bold text-white">{new Date(m.timestamp).toLocaleDateString()}</p>
                                                    <p className="text-[10px] text-white/40">{new Date(m.timestamp).toLocaleTimeString()}</p>
                                                </td>
                                                <td className="px-6 py-5 text-xs text-white/60">{m.type}</td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="size-2 rounded-full bg-stable shadow-[0_0_8px_#10B981]" />
                                                        <span className="text-xs font-medium text-white/80">Source: {m.source}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <button className="flex items-center gap-1 text-[10px] font-black text-accent uppercase hover:scale-110 transition-transform">
                                                        View Report <ChevronRight size={12} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
