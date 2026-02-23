"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
    Users,
    Search,
    ChevronRight,
    Smartphone,
    CheckCircle2,
    Heart,
    Thermometer,
    ClipboardList,
    History
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PatientsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/api/patients")
            .then(res => res.json())
            .then(data => {
                setPatients(data);
                setSelectedPatient(data[0]);
                setLoading(false);
            })
            .catch(err => console.error("Failed to fetch patients", err));
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-dark font-mono text-accent animate-pulse">
                RETRIEVING_PATIENT_RECORDS...
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 bg-background-dark">
                <Header title="Patient Records" />

                <div className="flex-1 flex min-h-0 overflow-hidden">
                    {/* Left: Patient Directory */}
                    <section className="w-80 border-r border-border-dark flex flex-col shrink-0 glass-panel">
                        <div className="p-4 border-b border-border-dark">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Directory</h2>
                                <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{patients.length} Total</span>
                            </div>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input className="w-full bg-surface-dark border-border-dark rounded-lg pl-10 py-2 text-xs focus:ring-primary text-slate-100 outline-none" placeholder="Filter patients..." type="text" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {patients.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedPatient(p)}
                                    className={`p-4 border-b border-border-dark/50 cursor-pointer transition-colors ${selectedPatient?.id === p.id ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-surface-dark'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-slate-700 border border-border-dark shrink-0 overflow-hidden flex items-center justify-center">
                                            <Users size={20} className="text-white/20" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-sm font-bold truncate ${selectedPatient?.id === p.id ? 'text-slate-100' : 'text-slate-400'}`}>{p.name}</p>
                                            <p className="text-[11px] text-slate-500 font-mono truncate">ID: {p.id}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className={`block size-2 rounded-full ${p.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`}></span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Right: Detailed Profile */}
                    {selectedPatient && (
                        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="max-w-4xl mx-auto space-y-8">
                                {/* Profile Header */}
                                <div className="flex items-start gap-8 glass-panel p-6 rounded-2xl shadow-xl">
                                    <div className="size-32 rounded-2xl bg-slate-800 shrink-0 border-2 border-primary/20 flex items-center justify-center">
                                        <Users size={64} className="text-white/10" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">{selectedPatient.name}</h1>
                                            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                                                <CheckCircle2 size={14} /> {selectedPatient.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-slate-400 text-sm font-mono">
                                            <span className="flex items-center gap-1"><Smartphone size={14} /> ID: {selectedPatient.id}</span>
                                            <span className="flex items-center gap-1"><ClipboardList size={14} /> Exam Date: {selectedPatient.last_exam}</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 mt-6">
                                            <div className="bg-background-dark/50 p-3 rounded-xl border border-border-dark">
                                                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Age</p>
                                                <p className="text-lg font-bold text-slate-100">{selectedPatient.age}</p>
                                            </div>
                                            <div className="bg-background-dark/50 p-3 rounded-xl border border-border-dark">
                                                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Status</p>
                                                <p className="text-lg font-bold text-slate-100">{selectedPatient.status}</p>
                                            </div>
                                            <div className="col-span-2 bg-background-dark/50 p-3 rounded-xl border border-border-dark">
                                                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Latest Findings</p>
                                                <p className="text-sm font-bold text-slate-100 truncate">{selectedPatient.findings}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Vitals & History */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="glass-panel p-6 rounded-2xl">
                                            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                                                <History className="text-primary" /> Medical Notes
                                            </h3>
                                            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                                                <p>{selectedPatient.findings || "No specific findings recorded for this session."}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="glass-panel p-6 rounded-2xl">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Remote Biomarkers</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-3 bg-background-dark/50 rounded-xl">
                                                    <div className="flex items-center gap-2"><Heart className="text-rose-500" size={16} /><span className="text-xs text-slate-300">Heart Rate</span></div>
                                                    <span className="text-sm font-bold text-slate-100">-- BPM</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-background-dark/50 rounded-xl">
                                                    <div className="flex items-center gap-2"><Thermometer className="text-blue-500" size={16} /><span className="text-xs text-slate-300">Temp</span></div>
                                                    <span className="text-sm font-bold text-slate-100">-- °C</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}
