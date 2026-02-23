"use client";

import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AlertBannerProps {
    message: string;
    visible?: boolean;
}

export default function AlertBanner({ message, visible = true }: AlertBannerProps) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-critical/10 border-b border-critical/20 py-2 px-8 flex items-center justify-center gap-3"
                >
                    <div className="bg-critical size-5 rounded-full flex items-center justify-center animate-pulse">
                        <AlertTriangle size={12} className="text-white" />
                    </div>
                    <p className="text-[11px] font-black text-critical uppercase tracking-tighter">
                        Critical Alert: {message}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
