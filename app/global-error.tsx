"use client";

import { motion } from "framer-motion";
import { ShieldAlert, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <div className="min-h-screen flex items-center justify-center p-8 bg-[#0a0a0a]">
          {/* Pulsing Grid Aura */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>

          <div className="relative z-10 max-w-lg w-full text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full -mr-24 -mt-24 blur-3xl animate-pulse" />
              
              <div className="w-20 h-20 rounded-full bg-red-600/10 flex items-center justify-center mb-8 mx-auto">
                 <ShieldAlert className="w-10 h-10 text-red-600" />
              </div>
              
              <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-2">Platform <span className="text-red-500">Compromised</span></h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Critical Environmental Desync Intercepted</p>
              
              <button 
                onClick={() => reset()}
                className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all active:scale-95"
              >
                <RefreshCcw className="w-5 h-5" /> REBOOT COMMAND CENTER
              </button>
              
              <p className="mt-8 text-white/10 text-[8px] font-black uppercase tracking-widest">
                ID: {error.digest || "SYSTEM_FLARE_000"} • ADMIN SENTINEL ACTIVE
              </p>
            </motion.div>
          </div>
        </div>
      </body>
    </html>
  );
}
