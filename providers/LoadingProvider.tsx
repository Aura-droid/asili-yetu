"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

interface LoadingContextType {
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  setIsLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Trigger loader on route changes
  useEffect(() => {
    setIsLoading(false); // Reset on completion
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ setIsLoading }}>
      {children}
      
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-2xl flex flex-col items-center justify-center pointer-events-auto"
          >
            {/* Top Progress Bar - The Digital Canopy */}
            <div className="fixed top-0 left-0 right-0 h-1 z-[10000]">
               <motion.div 
                 initial={{ width: "0%" }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 15, ease: "easeOut" }}
                 className="h-full bg-primary shadow-[0_0_15px_rgba(225,185,85,0.8)]"
               />
            </div>

            <div className="relative w-48 h-48">
               {/* Pulsing Aura */}
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                 transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                 className="absolute inset-0 bg-primary rounded-full blur-3xl"
               />
               
               {/* Content */}
               <motion.div
                 animate={{ y: [0, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                 className="relative w-full h-full flex flex-col items-center justify-center"
               >
                 <Image 
                   src="/brand/asili-yetu-brand-no-bg.png"
                   alt="Asili Yetu"
                   width={220}
                   height={220}
                   className="object-contain"
                   priority
                 />
                 
                 <div className="mt-8 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 italic">
                       Expedition
                    </span>
                    <div className="flex gap-1">
                       <motion.div 
                         animate={{ opacity: [0, 1, 0] }}
                         transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                         className="w-1.5 h-1.5 bg-primary rounded-full"
                       />
                       <motion.div 
                         animate={{ opacity: [0, 1, 0] }}
                         transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                         className="w-1.5 h-1.5 bg-primary rounded-full"
                       />
                       <motion.div 
                         animate={{ opacity: [0, 1, 0] }}
                         transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                         className="w-1.5 h-1.5 bg-primary rounded-full"
                       />
                    </div>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
}
