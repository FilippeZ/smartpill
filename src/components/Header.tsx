"use client";

import { Search, Bell, ChevronRight } from "lucide-react";

export default function Header({ title }: { title?: string }) {
    return (
        <header className="h-16 border-b border-border-dark flex items-center justify-between px-8 bg-background-dark/80 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span>Missions</span>
                    <ChevronRight size={12} />
                    <span className="text-slate-100">{title || "Live Dashboard"}</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative group">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 group-focus-within:text-primary transition-colors">
                        <Search size={18} />
                    </span>
                    <input
                        className="bg-surface-dark border-border-dark focus:ring-primary focus:border-primary rounded-lg pl-10 pr-4 py-1.5 text-sm w-80 transition-all outline-none"
                        placeholder="Search Patient ID, Date or Diagnosis..."
                        type="text"
                    />
                </div>

                <div className="h-6 w-[1px] bg-border-dark"></div>

                <div className="flex items-center gap-4">
                    <button className="relative text-slate-400 hover:text-white transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 size-2 bg-primary rounded-full ring-2 ring-background-dark"></span>
                    </button>

                    <div className="flex items-center gap-3 pl-2 border-l border-border-dark">
                        <div className="text-right">
                            <p className="text-xs font-bold leading-none">Dr. Sarah Chen</p>
                            <p className="text-[10px] text-slate-500 font-medium">Chief Operator</p>
                        </div>
                        <div
                            className="size-9 rounded-lg bg-cover bg-center border border-border-dark"
                            style={{
                                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBBC8SuGHIm0zdlZsgfpeJDdWySFf2VcbA-nYRq3c0Qwh1FFzgT9-YbvaR2Br6698O_g7qIFMkHJ2SyeeKu-78d8gVwl_w1MnCIMoYhLybZv1qEZVCPbfDiRcWIJSWIDX0rgNLN0NVU82Umk4g1sK5fR_VRp_KVyW_xu2ZR7ruTyHNSOBDlCK6Kagsvn6ksCwgGyX0m7-Y6aQKekoB5NgYUSDeIjEUY8cIr-UJWUjSzYv4XFss5bhbKDsNAfii6lrpKZDWck2yw7C4')`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </header>
    );
}
