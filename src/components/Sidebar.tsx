"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Activity,
    History,
    Users,
    Settings,
    ShieldCheck,
    Power,
    Pill,
    Dna
} from "lucide-react";

const navItems = [
    { name: "Live Feed", href: "/dashboard", icon: Activity, badge: "Active" },
    { name: "DNA Analysis", href: "/analysis", icon: Dna },
    { name: "Clinical AI", href: "/clinical", icon: ShieldCheck },
    { name: "Mission History", href: "/missions", icon: History },
    { name: "Patient Records", href: "/patients", icon: Users },
    { name: "System Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 flex flex-col glass-panel border-r border-slate-800/50 h-screen sticky top-0 z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="size-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Pill className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-sm font-black tracking-tight uppercase text-white">SmartPill</h1>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                        Command v2.4
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-4 mt-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center justify-between px-3 py-3 text-slate-400 hover:text-white transition-all rounded-lg group",
                            pathname === item.href && "bg-white/5 border border-white/10 text-white neon-border"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={18} className={cn(
                                "transition-colors",
                                pathname === item.href ? "text-accent" : "group-hover:text-primary"
                            )} />
                            <span className="text-sm font-semibold">{item.name}</span>
                        </div>
                        {item.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-accent/20 text-accent rounded uppercase animate-pulse">
                                {item.badge}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

            <div className="p-4 mt-auto space-y-4">
                <button className="w-full py-4 bg-critical text-white rounded-xl font-black text-sm uppercase tracking-tighter shadow-xl shadow-critical/20 hover:scale-[0.98] active:scale-[0.95] transition-all flex items-center justify-center gap-2 group">
                    <Power size={20} className="group-hover:animate-pulse" />
                    Emergency Stop
                </button>

                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div
                        className="size-10 rounded-lg bg-cover bg-center border border-white/10"
                        style={{
                            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDuxQ1TWOdZj7FxcdGI65IMpMlx4F-wdfoKyrnMgPCuWsPiCktKXPMz5k1EF_8WSvcfptPTqVw3tAYTsE5SAEjDyYroyd30u2WMxx6NBngXjTtfoHQg7zKXTYJ8Siaf_vt4ZgaL3wNxvr5Zoe36L_sL4ovyGVCQhMeekdcBvQREwpGoKlJEKxMy64fjo0cUn3dehYrHDVfJaY1_JyUzos430PtY9KxTcVuACcIACQg6DI_0E_uoYzV9WpXygu3lJqakYOfpWQ_izII')`,
                        }}
                    ></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">Dr. Julian Smith</p>
                        <p className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-widest leading-none mt-1">
                            Sr. Operator
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
