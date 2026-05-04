"use client";

import { motion } from "framer-motion";
import { ServerOff, RefreshCcw, Activity, ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function AdminOfflinePage() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Blueprint Grid Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 max-w-lg w-full"
      >
        <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-10 shadow-2xl overflow-hidden relative">
          {/* Top Alert Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 animate-pulse" />
          
          <div className="flex flex-col items-center text-center">
            {/* System Icon */}
            <div className="relative w-24 h-24 mb-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-red-500/30 rounded-full"
              />
              <div className="absolute inset-2 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <ServerOff className="w-10 h-10 text-red-500" />
              </div>
            </div>

            {/* Title */}
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">System Link Failure</span>
            </div>
            
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">
              Admin Console <span className="text-red-500 italic">Offline</span>
            </h1>
            
            <p className="text-white/50 text-sm font-medium leading-relaxed mb-10">
              The administrative relay has been lost. Real-time data synchronization and database write operations are currently suspended.
            </p>

            {/* Diagnostics */}
            <div className="w-full space-y-3 mb-10">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-white/20" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Network Status</span>
                </div>
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">Down</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <RefreshCcw className="w-4 h-4 text-white/20" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Auto-Reconnect</span>
                </div>
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Attempting...</span>
              </div>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full py-5 bg-red-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-red-500/20 flex items-center justify-center gap-3"
            >
              <RefreshCcw className="w-4 h-4" /> Reload Admin Console
            </button>
          </div>
        </div>

        {/* Console Footer */}
        <div className="mt-8 flex items-center justify-between px-6 opacity-30">
          <div className="flex items-center gap-2">
            <Image src="/brand/logo-mark-no-bg.png" alt="Asili Yetu" width={20} height={20} className="grayscale" />
            <span className="text-[8px] font-bold uppercase tracking-widest text-white">Asili Admin V2.0</span>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-white">Error Code: ERR_CONN_INTERRUPTED</span>
        </div>
      </motion.div>
    </div>
  );
}
