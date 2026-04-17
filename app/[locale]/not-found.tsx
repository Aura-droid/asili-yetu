"use client";

import { motion } from "framer-motion";
import { Compass, Home, Map as MapIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Moving Particles for "Wandering" feel */}
      <div className="absolute inset-0 opacity-10">
         {[...Array(5)].map((_, i) => (
           <motion.div
             key={i}
             animate={{
               x: [0, 100, 0, -100, 0],
               y: [0, -100, 100, 0],
             }}
             transition={{
               duration: 20 + i * 5,
               repeat: Infinity,
               ease: "linear"
             }}
             className="absolute bg-white w-px h-px blur-sm shadow-[0_0_20px_white]"
             style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
           />
         ))}
      </div>

      <div className="relative z-10 max-w-xl w-full text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[4rem] p-12 md:p-20 shadow-2xl"
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-10 mx-auto relative group">
             <Compass className="w-12 h-12 text-primary animate-[spin_10s_linear_infinite]" />
             <div className="absolute inset-0 rounded-full border-2 border-primary/20 scale-125" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none mb-6">
             Off <span className="text-primary">Track</span>
          </h1>
          <p className="text-white/40 text-xs font-black uppercase tracking-[0.4em] mb-12 leading-relaxed">
             This coordinate does not exist in our regional database. You have ventured outside the documented savannah.
          </p>

          <div className="flex flex-col gap-4">
             <Link 
               href="/"
               className="w-full bg-primary text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-[0.98] shadow-xl shadow-primary/20 text-sm uppercase"
             >
                <Home className="w-5 h-5" /> Return to Base
             </Link>
             
             <Link 
               href="/destinations"
               className="w-full bg-white/5 border border-white/10 py-5 rounded-2xl text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-[10px]"
             >
                <MapIcon className="w-5 h-5 text-primary" /> View Intelligence Map <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
             </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
