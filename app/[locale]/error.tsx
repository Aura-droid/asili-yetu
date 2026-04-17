"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Technical logging remains in the console for your eyes only
    console.error("Sentinel Error Intercepted:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Visual Distortion Background */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/5 via-transparent to-transparent opacity-50" />
      
      <div className="relative z-10 max-w-xl w-full text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden"
        >
          {/* Pulsing Alert Orb */}
          <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-8 mx-auto relative">
             <div className="absolute inset-0 rounded-full border border-red-500/20 animate-ping" />
             <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[1.1] mb-4">
             Signal <span className="text-red-500">Lost</span>
          </h2>
          <p className="text-white/40 text-xs font-black uppercase tracking-[0.4em] mb-4 leading-relaxed">
             Our field intelligence has encountered a digital storm. The expedition route is temporarily obstructed.
          </p>
          <div className="mb-8 p-4 bg-red-500/10 rounded-xl border border-red-500/20 text-left">
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-2">Technical Logs:</p>
            <p className="text-white/80 text-xs font-mono break-all line-clamp-3">
              {error.message || "Unknown error occurred during transmission."}
            </p>
            {error.digest && (
              <p className="text-white/40 text-[9px] font-mono mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
             <button 
               onClick={() => reset()}
               className="w-full bg-white py-5 rounded-2xl text-black font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary transition-all active:scale-[0.98] shadow-lg"
             >
                <RefreshCw className="w-5 h-5" /> Attempt Re-Sync
             </button>
             
             <button 
               onClick={() => alert("Report Transmitted to Command Center. We are on it.")}
               className="w-full bg-white/5 border border-white/10 py-5 rounded-2xl text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-[10px]"
             >
                <MessageSquare className="w-5 h-5 text-red-500" /> Dispatch Intelligence Report
             </button>
          </div>

          <div className="mt-12 pt-12 border-t border-white/5">
             <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Return to Base
             </Link>
          </div>
        </motion.div>
        
        <p className="mt-8 text-white/10 text-[8px] font-black uppercase tracking-[0.5em]">
           Error ID: {error.digest || "EXPEDITION_DESYNC_01"} • Asili Yetu Command
        </p>
      </div>
    </div>
  );
}
