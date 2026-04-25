"use client";

import { useState } from "react";
import { Leaf, Sun, Menu, Compass, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useLoading } from "@/providers/LoadingProvider";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("Navbar");
  const { setIsLoading } = useLoading();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const menuLinks = [
    { href: "/packages", label: t("safaris") },
    { href: "/destinations", label: t("destinations") },
    { href: "/culture", label: t("culture") },
    { href: "/gallery", label: t("gallery") },
    { href: "/fleet", label: t("fleet") },
    { href: "/guides", label: t("guides") },
    { href: "/about", label: t("about") },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md border-b border-foreground/10 bg-background/50"
      >
        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left z-[70]"
          style={{ scaleX }}
        />

        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
             <Image 
               src="/brand/logo-mark-no-bg.png" 
               alt="Asili Yetu Safaris Logo" 
               width={40} 
               height={40} 
               className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-500"
               priority
             />
             <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-foreground hidden sm:block">
            Asili Yetu <span className="bg-linear-to-r from-primary via-amber-300 to-primary bg-clip-text text-transparent animate-shimmer italic">Safaris</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {menuLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsLoading(true)} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <button
            onClick={() => setTheme(theme === "standard" ? "jungle" : "standard")}
            className="p-2 rounded-full border border-foreground/20 hover:bg-foreground/10 transition flex items-center gap-2"
          >
            {theme === "standard" ? <Leaf className="w-4 h-4 text-green-600" /> : <Sun className="w-4 h-4 text-[#c08b5e]" />}
            <span className="hidden sm:inline text-xs font-semibold">{theme === 'standard' ? t('jungle_mode') : t('savannah_mode')}</span>
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[55] bg-background/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-start p-8 pt-32 overflow-y-auto"
          >
            <div className="flex flex-col items-center gap-8 w-full">
              {menuLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="w-full text-center"
                >
                  <Link 
                    href={link.href} 
                    onClick={() => {
                       setIsLoading(true);
                       setIsMenuOpen(false);
                    }}
                    className="text-3xl font-black text-foreground uppercase tracking-tighter hover:text-primary transition-colors block py-2"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 w-full pt-12 border-t border-foreground/10 flex flex-col items-center gap-6">
               <div className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 mb-2">Expedition Settings</div>
               <button
                  onClick={() => {
                    setTheme(theme === "standard" ? "jungle" : "standard");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-8 py-4 bg-foreground/5 rounded-2xl border border-foreground/10"
                >
                  {theme === "standard" ? <Leaf className="w-5 h-5 text-green-600" /> : <Sun className="w-5 h-5 text-primary" />}
                  <span className="text-sm font-black uppercase tracking-widest">{theme === 'standard' ? t('jungle_mode') : t('savannah_mode')}</span>
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
