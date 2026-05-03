"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center">
       {/* Top Progress Bar Intelligence */}
       <div className="fixed top-0 left-0 right-0 h-1 z-[10000]">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="h-full bg-primary shadow-[0_0_15px_rgba(225,185,85,0.8)]"
          />
       </div>

       <div className="relative w-48 h-48">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-primary rounded-full blur-3xl"
          />
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="relative w-full h-full flex flex-col items-center justify-center"
          >
            <Image 
              src="/brand/logo-mark-no-bg.png"
              alt="Asili Yetu"
              width={100}
              height={100}
              className="object-contain opacity-80"
              priority
            />
            
            <div className="mt-8 flex flex-col items-center gap-2">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/40 italic">
                  Expedition Syncing
               </span>
               <div className="flex gap-1.5">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div 
                      key={i}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay }}
                      className="w-1.5 h-1.5 bg-primary rounded-full"
                    />
                  ))}
               </div>
            </div>
          </motion.div>
       </div>
    </div>
  );
}
