"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    LineChart,
    Line,
    Tooltip,
    PieChart,
    Pie,
    Cell
} from "recharts";

const phData = [
    { name: 'G1', val: 1.2 },
    { name: 'G2', val: 2.4 },
    { name: 'G3', val: 1.8 },
    { name: 'D1', val: 6.2 },
    { name: 'D2', val: 6.8 },
];

const gasData = Array.from({ length: 20 }).map((_, i) => ({
    time: i,
    h2s: Math.sin(i * 0.5) * 10 + 20,
    ch4: Math.cos(i * 0.3) * 5 + 15,
}));

const neurotransmitters = [
    { name: 'Sero', value: 85, color: '#10B981' },
    { name: 'Dopa', value: 15, color: '#1F2937' },
];

const neurotransmitters2 = [
    { name: 'Dopa', value: 65, color: '#0EA5E9' },
    { name: 'Empty', value: 35, color: '#1F2937' },
];

export default function BiomarkerPanel({ telemetry }: { telemetry: any }) {
    const phValue = telemetry?.ph || 6.5;
    const dynamicPhData = [
        ...phData.slice(1),
        { name: 'Live', val: phValue }
    ];

    return (
        <div className="grid grid-cols-4 gap-6 h-48">
            {/* Biochemical Sensors */}
            <div className="glass-panel p-4 rounded-xl flex flex-col">
                <h3 className="hud-text text-white/50 mb-3 text-[9px]">pH Levels</h3>
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dynamicPhData}>
                            <Bar dataKey="val" fill={phValue < 4 ? "#ef4444" : "#0EA5E9"} radius={[2, 2, 0, 0]} />
                            <XAxis dataKey="name" hide />
                            <YAxis hide domain={[0, 14]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                    <p className="hud-text text-[8px] text-white/40">Gastric Acidity Profile</p>
                    <p className={`hud-text font-black text-[10px] ${phValue < 4 ? 'text-red-500 animate-pulse' : 'text-accent'}`}>
                        pH: {phValue.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Gaseous Content */}
            <div className="glass-panel p-4 rounded-xl flex flex-col">
                <h3 className="hud-text text-white/50 mb-3 text-[9px]">Gaseous Content (H2S / CH4)</h3>
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={gasData}>
                            <Line type="monotone" dataKey="h2s" stroke="#22D3EE" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="ch4" stroke="#F59E0B" strokeWidth={2} dot={false} strokeDasharray="3 3" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <p className="hud-text text-center text-[8px] text-white/40 mt-2">Methane / Sulfide Variance</p>
            </div>

            {/* Neurotransmitters */}
            <div className="glass-panel p-4 rounded-xl flex flex-col">
                <h3 className="hud-text text-white/50 mb-3 text-[9px]">Neuro (Sero & Dopa)</h3>
                <div className="flex items-center justify-center gap-4 flex-1">
                    <div className="size-16 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={neurotransmitters} innerRadius={20} outerRadius={28} paddingAngle={0} dataKey="value">
                                    {neurotransmitters.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <span className="absolute inset-0 flex items-center justify-center hud-text text-[10px] font-black text-white">85%</span>
                    </div>
                    <div className="size-16 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={neurotransmitters2} innerRadius={20} outerRadius={28} paddingAngle={0} dataKey="value">
                                    {neurotransmitters2.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <span className="absolute inset-0 flex items-center justify-center hud-text text-[10px] font-black text-white">65%</span>
                    </div>
                </div>
                <p className="hud-text text-center text-[8px] text-white/40 mt-2">Local Receptor Activity</p>
            </div>

            {/* Bioimpedance Graph */}
            <div className="glass-panel p-4 rounded-xl flex flex-col relative overflow-hidden group">
                <div className="absolute top-3 right-3 px-1.5 py-0.5 bg-stable/20 text-stable rounded text-[8px] font-black uppercase tracking-tighter">
                    Tissue Density Nominal
                </div>
                <h3 className="hud-text text-white/50 mb-3 text-[9px]">Bioimpedance Graph</h3>
                <div className="flex-1 bg-black/20 rounded">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={gasData}>
                            <Line type="step" dataKey="h2s" stroke="#10B981" strokeWidth={1} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <p className="hud-text text-center text-[8px] text-white/40 mt-2">Spectroscopy Core_v2</p>
            </div>
        </div>
    );
}
