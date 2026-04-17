"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: 'en', name: 'English', flag: (
    <svg className="w-5 h-5 rounded-full overflow-hidden shadow-sm" viewBox="0 0 640 480">
      <path fill="#012169" d="M0 0h640v480H0z"/><path fill="#FFF" d="M75 0l244 181L562 0h78v62L400 240l240 178v62h-78L320 300 75 480H0v-62l240-178L0 62V0h75z"/><path d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 190l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" fill="#C8102E"/><path fill="#FFF" d="M240 0v480h160V0H240zM0 160v160h640V160H0z"/><path fill="#C8102E" d="M280 0v480h80V0h-80zM0 200v80h640v-80H0z"/>
    </svg>
  )},
  { code: 'sw', name: 'Swahili', flag: (
    <svg className="w-5 h-5 rounded-full overflow-hidden shadow-sm border border-white/10" viewBox="0 0 640 480">
      <path fill="#1eb53a" d="M0 0h640v480H0z"/><path fill="#fcd116" d="M0 480L640 0H411L0 308v172zM229 0L640 308v172L411 480l229-172V0H229z"/><path d="M0 480L640 0h-77L0 422v58zM77 0L640 422V0H77z" fill="#000"/>
      <path fill="#fcd116" d="M0 480L640 0h-77L563 0 0 422v58z"/>
      <path d="M0 480L640 0h-34L0 454v26zM34 0L640 454V0H34z" fill="#000"/>
    </svg>
  )},
  { code: 'es', name: 'Español', flag: (
    <svg className="w-5 h-5 rounded-full overflow-hidden shadow-sm border border-white/10" viewBox="0 0 640 480">
      <path fill="#c60b1e" d="M0 0h640v480H0z"/><path fill="#ffc400" d="M0 120h640v240H0z"/>
    </svg>
  )},
  { code: 'fr', name: 'Français', flag: (
    <svg className="w-5 h-5 rounded-full overflow-hidden shadow-sm border border-white/10" viewBox="0 0 640 480">
      <path fill="#fff" d="M0 0h640v480H0z"/><path fill="#002395" d="M0 0h213.3v480H0z"/><path fill="#ed2939" d="M426.7 0H640v480H426.7z"/>
    </svg>
  )},
  { code: 'de', name: 'Deutsch', flag: (
    <svg className="w-5 h-5 rounded-full overflow-hidden shadow-sm border border-white/10" viewBox="0 0 640 480">
      <path d="M0 0h640v480H0z"/><path fill="#d00" d="M0 160h640v160H0z"/><path fill="#ffce00" d="M0 320h640v160H0z"/>
    </svg>
  )},
  { code: 'zh', name: '中文', flag: (
    <svg className="w-5 h-5 rounded-full overflow-hidden shadow-sm border border-white/10" viewBox="0 0 640 480">
      <path fill="#ee1c25" d="M0 0h640v480H0z"/><path fill="#ffff00" d="M118 64l14 44 46 2-36 28 12 44-36-25-36 25 12-44-36-28 46-2 14-44zm86 16l3 21 18 11-20 4-5 21-8-20-21-2 17-13-2-21 18 10zm45 52l10 18 21 2-15 15 5 21-19-10-18 11 3-21-15-16 21-2zm-5 77l20 10 3 21-14-17-19-11 18-10-2-21 16 16 21-3-43 15zm-59 47l18-9-2-21 17 14 21-4-13 18 5 21-19-10-19 11 3-21z"/>
    </svg>
  )},
  { code: 'ar', name: 'العربية', flag: (
    <svg className="w-5 h-5 rounded-full overflow-hidden shadow-sm border border-white/10" viewBox="0 0 640 480">
      <path fill="#00732f" d="M0 0h640v480H0z"/><path d="M125 0l400 240-400 240z" fill="#fff"/>
    </svg>
  )}
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLanguage = (newLocale: string) => {
    setIsOpen(false);
    // router.replace automatically handles the [locale] prefix using next-intl
    router.replace(pathname, { locale: newLocale });
  };

  const activeLang = languages.find(l => l.code === currentLocale) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/30 hover:bg-foreground/10 transition-all bg-background/50 backdrop-blur-md text-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group"
      >
        <div className="text-lg leading-none transition-transform group-hover:rotate-12 duration-500">{activeLang.flag}</div>
        <span className="hidden sm:inline text-[10px] font-black uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity">{activeLang.name}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-4 w-56 bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-[2rem] shadow-2xl overflow-hidden z-50"
          >
            <div className="py-2">
              {languages.map((lang) => (
                 <button
                   key={lang.code}
                   onClick={() => switchLanguage(lang.code)}
                   className={`w-full flex items-center gap-4 px-5 py-4 text-sm text-left transition-all group ${currentLocale === lang.code ? 'bg-primary/10 text-primary font-black' : 'text-foreground/80 font-bold hover:bg-foreground/5'}`}
                 >
                   <span className="text-xl group-hover:scale-125 transition-transform duration-500">{lang.flag}</span>
                   <span className="uppercase tracking-[0.15rem] text-[10px] whitespace-nowrap">{lang.name}</span>
                   {currentLocale === lang.code && <div className="ml-auto w-1 h-1 rounded-full bg-primary animate-pulse" />}
                 </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
