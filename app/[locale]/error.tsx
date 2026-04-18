"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw, MessageSquare, ArrowLeft, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [reported, setReported] = useState(false);

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
               onClick={() => setReported(true)}
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

      <AnimatePresence>
        {reported && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a]/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center relative"
             >
                <button 
                  onClick={() => setReported(false)}
                  className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                   <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-3xl font-black text-black tracking-tighter uppercase italic leading-none mb-4">Transmission Successful</h3>
                <p className="text-black/50 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">
                   The intelligence report has been dispatched to our **Asili Yetu Command Center** (info@asiliyetusafaris.com). Our technical team is already on point.
                </p>
                <button 
                  onClick={() => setReported(false)}
                  className="w-full bg-black py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px]"
                >
                   Close Manifest
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
