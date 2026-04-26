"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, CheckCircle2 } from "lucide-react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const t = useTranslations("Cookies");

  useEffect(() => {
    const consent = localStorage.getItem("asili-yetu-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("asili-yetu-cookie-consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("asili-yetu-cookie-consent", "declined");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[100] max-w-md w-[calc(100vw-3rem)]"
        >
          <div className="relative p-6 rounded-[2rem] bg-background/80 backdrop-blur-2xl border border-foreground/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden group">
            {/* Animated Glow */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Cookie className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-black tracking-tight text-lg">{t("title")}</h3>
                </div>
                <button 
                  onClick={() => setShow(false)}
                  className="p-1 rounded-full hover:bg-foreground/5 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("desc")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  onClick={handleAccept}
                  className="flex-1 rounded-xl h-12 font-bold bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all duration-300 shadow-lg shadow-primary/20 active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {t("accept")}
                </button>
                <button 
                  onClick={handleDecline}
                  className="flex-1 rounded-xl h-12 font-bold bg-foreground/5 hover:bg-foreground/10 text-foreground transition-all duration-300 active:scale-[0.98]"
                >
                  {t("decline")}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
