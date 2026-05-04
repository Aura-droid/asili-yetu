"use client";

import { motion } from "framer-motion";
import { WifiOff, Map, RefreshCcw, Compass } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function OfflinePage() {
  const t = useTranslations("Offline");

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale opacity-20" />
      </div>

      {/* Scanning Lines Effect */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-20 max-w-xl w-full text-center"
      >
        {/* Signal Icon */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute inset-0 bg-red-500 rounded-full blur-2xl"
          />
          <div className="relative w-full h-full bg-white/5 backdrop-blur-xl rounded-full border border-white/10 flex items-center justify-center shadow-2xl">
            <WifiOff className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Branding */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Image 
            src="/brand/logo-mark-no-bg.png" 
            alt="Asili Yetu" 
            width={40} 
            height={40} 
            className="opacity-50 grayscale"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">
            Mission Sentinel Offline
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-6 uppercase italic">
          {t.rich("title", {
            p: (chunks) => <span className="text-white/50">{chunks}</span>
          })}
        </h1>
        
        <p className="text-white/60 text-lg font-medium leading-relaxed mb-12 max-w-md mx-auto">
          {t("sub")}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-primary transition-all active:scale-95 shadow-2xl"
          >
            <RefreshCcw className="w-4 h-4" /> {t("retry")}
          </button>
          <button 
            className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white/60 border border-white/10 rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
          >
            <Map className="w-4 h-4" /> {t("view_saved")}
          </button>
        </div>

        {/* Footer Telemetry */}
        <div className="mt-16 flex items-center justify-center gap-8 border-t border-white/5 pt-8">
           <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Uplink Status</span>
              <span className="text-[10px] font-bold text-red-500/80 uppercase">Disconnected</span>
           </div>
           <div className="w-px h-8 bg-white/5" />
           <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Last Telemetry</span>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{new Date().toLocaleTimeString()}</span>
           </div>
           <div className="w-px h-8 bg-white/5" />
           <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Sentinel ID</span>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">ASY-99</span>
           </div>
        </div>
      </motion.div>

      {/* Decorative Compass */}
      <div className="absolute -bottom-32 -right-32 opacity-5 pointer-events-none">
        <Compass className="w-96 h-96 text-white" />
      </div>
    </div>
  );
}
