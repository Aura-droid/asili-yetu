"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Megaphone, Tag, AlertTriangle } from "lucide-react";
import { useLocale } from "next-intl";

export type NoticeType = 'info' | 'discount' | 'alert';

export interface Notice {
  id: string;
  message: string;
  type: NoticeType;
  is_active: boolean;
  translations?: Record<string, string>;
}

export default function GlobalNoticeBanner({ initialNotice }: { initialNotice: Notice | null }) {
  const [isVisible, setIsVisible] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const locale = useLocale();

  // Determine localized message
  const displayMessage = notice?.translations?.[locale] || notice?.message;

  useEffect(() => {
    if (!initialNotice) return;
    
    // Check localStorage to ensure we don't annoy users who already dismissed this specific notice
    const dismissedNotices = JSON.parse(localStorage.getItem('dismissedNotices') || '[]');
    if (initialNotice.is_active && !dismissedNotices.includes(initialNotice.id)) {
      setNotice(initialNotice);
      // A small delay provides a smooth entrance after the rest of the UI has settled
      setTimeout(() => setIsVisible(true), 2500); 
    }
  }, [initialNotice]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (notice) {
      // Save their preference so this specific notice doesn't haunt them everywhere
      const dismissedNotices = JSON.parse(localStorage.getItem('dismissedNotices') || '[]');
      localStorage.setItem('dismissedNotices', JSON.stringify([...dismissedNotices, notice.id]));
    }
  };

  if (!notice) return null;

  const bgColors = {
    info: "bg-blue-600",
    discount: "bg-gradient-to-r from-[#166534] to-emerald-600", // Smooth jungle green gradient
    alert: "bg-gradient-to-r from-red-600 to-rose-700" // Urgent alert gradient
  };

  const icons = {
    info: <Megaphone className="w-5 h-5 text-white shrink-0" />,
    discount: <Tag className="w-5 h-5 text-white shrink-0" />,
    alert: <AlertTriangle className="w-5 h-5 text-white shrink-0" />
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={`fixed top-0 left-0 right-0 z-[100] ${bgColors[notice.type]} shadow-2xl`}
        >
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               {icons[notice.type]}
               <p className="text-white font-medium text-sm md:text-base drop-shadow-sm tracking-wide">
                 {displayMessage}
               </p>
            </div>
            <button 
              onClick={handleDismiss}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 transition-colors text-white"
              title="Dismiss Notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
