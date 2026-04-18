"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import Image from "next/image";

export default function JungleTransitionOverlay() {
  const { theme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevTheme, setPrevTheme] = useState(theme);

  useEffect(() => {
    if (theme === "jungle" && prevTheme !== "jungle") {
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 2200); // Overlay duration
    }
    setPrevTheme(theme);
  }, [theme, prevTheme]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ y: "100%", borderTopLeftRadius: "50%", borderTopRightRadius: "50%" }}
          animate={{ y: "0%", borderTopLeftRadius: "0%", borderTopRightRadius: "0%" }}
          exit={{ y: "-100%", borderBottomLeftRadius: "50%", borderBottomRightRadius: "50%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d1b11] overflow-hidden"
        >
           {/* Decorative SVG Vines/Leaves effect inside the overlay */}
           <motion.div 
             initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
             animate={{ scale: 1.5, rotate: 0, opacity: 1 }}
             exit={{ scale: 2, opacity: 0 }}
             transition={{ delay: 0.3, duration: 1 }}
             className="absolute opacity-50"
           >
              <svg width="300" height="300" viewBox="0 0 24 24" fill="#166534" stroke="#4ade80" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                 <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, scale: 0.8, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 1.2 }}
             transition={{ delay: 0.4, duration: 0.6 }}
             className="relative z-20 mb-6 drop-shadow-2xl"
           >
              <Image 
                src="/logo.png" 
                alt="Asili Yetu Safaris and Tours" 
                width={120} 
                height={120} 
                className="w-24 h-24 object-contain"
                priority
              />
           </motion.div>
           
           <motion.h2 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0 }}
             transition={{ delay: 0.5, duration: 0.5 }}
             className="relative z-10 text-4xl md:text-6xl font-black text-[#4ade80] tracking-widest uppercase drop-shadow-xl flex flex-col items-center gap-4"
           >
             <span>Jungle Mode</span>
             <span className="text-xl text-white/70 font-medium tracking-normal lowercase">unlocked</span>
           </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
