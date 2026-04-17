"use client";

import { motion } from "framer-motion";
import { Radio, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-none">
       {/* Top Progress Bar - Tactical Gold */}
       <div className="fixed top-0 left-0 right-0 h-1.5 z-[10000]">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="h-full bg-primary shadow-[0_0_20px_rgba(225,185,85,1)]"
          />
       </div>

       <div className="relative">
          {/* Pulsing Grid Background for Admin Feel */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-5">
             <div className="w-[500px] h-[500px] border border-primary rounded-full animate-ping" />
          </div>

          <div className="relative flex flex-col items-center">
             <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mb-8 relative">
                <Radio className="w-10 h-10 text-primary animate-pulse" />
                <div className="absolute inset-0 rounded-full border border-primary animate-spin duration-[3000ms]" />
             </div>
             
             <div className="flex flex-col items-center gap-1">
                <h3 className="text-xl font-black italic text-foreground uppercase tracking-tighter">Command <span className="text-primary italic">Sync</span></h3>
                <div className="flex items-center gap-3">
                   <Loader2 className="w-3 h-3 text-primary animate-spin" />
                   <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em]">Fetching Intelligence...</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
