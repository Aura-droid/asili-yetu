"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);

  // Delay the appearance so it doesn't distract from the hero entrance
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  // [TESTING_PHASE_ONLY]: Currently using the dev's testing number +255746204634
  // [PRODUCTION_REMINDER]: Swap this to +49 175 1159881 (491751159881) for live.
  const companyPhone = "255746204634"; 
  const defaultMessage = "Jambo! I'm interested in planning a safari with Asili Yetu.";

  return (
    <motion.a
      href={`https://wa.me/${companyPhone}?text=${encodeURIComponent(defaultMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-[90] flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] cursor-pointer group"
    >
      <MessageCircle className="w-7 h-7" />
      
      {/* Tooltip */}
      <span className="absolute right-16 bg-foreground text-background text-xs font-bold py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-foreground/10">
        Chat with a Guide
      </span>
      
      {/* Pulse effect */}
      <span className="absolute w-full h-full rounded-full bg-[#25D366] opacity-40 animate-ping -z-10" />
    </motion.a>
  );
}
