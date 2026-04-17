"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface RustlingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function RustlingButton({ children, className, ...props }: RustlingButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center justify-center overflow-hidden transition-all shadow-lg ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      <AnimatePresence>
        {isHovered && theme === "jungle" && (
          <>
            {/* Small decorative leaves that rustle on hover in Jungle Mode */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -20, x: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: [0, -10, 5, -5, 0], x: 0 }}
              exit={{ opacity: 0, scale: 0, x: -10 }}
              transition={{ duration: 0.5 }}
              className="absolute left-2 top-1 opacity-40 select-none pointer-events-none"
            >
              🍃
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: 20, x: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: [0, 15, -5, 10, 0], x: 0 }}
              exit={{ opacity: 0, scale: 0, x: 10 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="absolute right-3 bottom-1 opacity-40 select-none pointer-events-none"
            >
              🍃
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Background sweep effect */}
      <motion.div
        className="absolute inset-0 bg-black/10 z-0 pointer-events-none"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "0%" : "-100%" }}
        transition={{ duration: 0.3 }}
      />
    </button>
  );
}
