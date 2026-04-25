"use client";
import { motion } from "framer-motion";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";
import NewsletterCapture from "./NewsletterCapture";
import { useEffect, useState } from "react";
import { useLoading } from "@/providers/LoadingProvider";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();
  const locale = useLocale();
  const { setIsLoading } = useLoading();
  
  // Official Production Identity
  const whatsappNumber = "491751159881"; 
  const email = "info@asiliyetusafaris.com";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
     <footer className="bg-background border-t border-foreground/10 pt-20 pb-10 min-h-[400px]"></footer>
  );

  return (
    <footer className="bg-background border-t border-foreground/10 pt-20 pb-10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-24">
           <NewsletterCapture />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-1 flex flex-col items-start">
            <Link href="/" className="flex flex-col items-start mb-8">
              <Image 
                src="/brand/asili-yetu-brand-no-bg.png" 
                alt="Asili Yetu Safaris" 
                width={180} 
                height={60} 
                className="w-48 h-auto object-contain mb-2 -ml-2" 
              />
            </Link>
            <p className="text-foreground/60 text-sm leading-loose mb-6 font-medium">
              {t("Hero.subtitle")}
            </p>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com/asiliyetusafaris/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-black transition-all border border-foreground/10 group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-110 transition-transform"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61574287724283" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-black transition-all border border-foreground/10 group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-110 transition-transform"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-black uppercase tracking-widest text-xs mb-6">{t("Footer.expeditions")}</h4>
            <ul className="space-y-4 text-sm font-semibold text-foreground/60">
              <li><Link href="/packages" onClick={() => setIsLoading(true)} className="hover:text-primary transition-colors">{t("Navbar.safaris")}</Link></li>
              <li><Link href="/destinations" onClick={() => setIsLoading(true)} className="hover:text-primary transition-colors">{t("Navbar.destinations")}</Link></li>
              <li><Link href="/gallery" onClick={() => setIsLoading(true)} className="hover:text-primary transition-colors">{t("Navbar.gallery")}</Link></li>
              <li><Link href="/about" onClick={() => setIsLoading(true)} className="hover:text-primary transition-colors">{t("Navbar.about")}</Link></li>
              <li><Link href="/fleet" onClick={() => setIsLoading(true)} className="hover:text-primary transition-colors">{t("Navbar.fleet")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-black uppercase tracking-widest text-xs mb-6">{t("Footer.contact_base")}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-foreground/60 text-sm font-semibold">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{t("Footer.address")}<br/>{t("Footer.region")}</span>
              </li>
              <li className="flex items-center gap-3 text-foreground/60 text-sm font-semibold">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">{email}</a>
              </li>
              <li className="flex items-center gap-3 text-foreground/60 text-sm font-semibold">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:+${whatsappNumber}`} className="hover:text-primary transition-colors">+49 175 1159881</a>
              </li>
            </ul>
          </div>

          <div className="bg-foreground/5 p-6 rounded-3xl border border-foreground/10 flex flex-col justify-center items-start">
             <h4 className="text-foreground font-black text-lg mb-2">{t("Footer.whatsapp_title")}</h4>
             <p className="text-foreground/60 text-sm font-medium mb-6 italic">
                {t("Footer.whatsapp_desc")}
             </p>
             <motion.a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello! I'm interested in an Asili Yetu Safari. [Signal Context: Language - ${locale.toUpperCase()}]`)}`}
                target="_blank"
                rel="noopener noreferrer"
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(var(--primary), 0)",
                    "0 0 30px rgba(var(--primary), 0.6)",
                    "0 0 0px rgba(var(--primary), 0)"
                  ]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-full relative overflow-hidden bg-primary text-background font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg group"
             >
                {/* Continuous Shimmer Layer */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
                
                {/* Secondary Sparkle Layer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_70%)] transition-opacity duration-300 pointer-events-none" />

                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current relative z-10"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg> 
                <span className="relative z-10">{t("Footer.whatsapp_btn")}</span>
             </motion.a>
          </div>
        </div>

        <div className="border-t border-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1.5">
             <p className="text-foreground/40 text-[10px] md:text-xs font-bold tracking-widest uppercase text-center md:text-left">
               &copy; {new Date().getFullYear()} Asili Yetu Safaris Limited. {t("Footer.rights")}
             </p>
             <a href="/about/Brela-Certificate.pdf" target="_blank" rel="noopener noreferrer" className="text-[9px] md:text-[10px] text-foreground/30 hover:text-primary transition-colors uppercase tracking-[0.2em] font-black flex items-center gap-1.5 border border-foreground/10 px-3 py-1 rounded-full">
               <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
               Licensed & Registered BRELA Firm (Tanzania)
             </a>
          </div>
          <div className="flex items-center gap-6 text-xs font-bold text-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest cursor-pointer">
            {t("Footer.privacy")} • {t("Footer.terms")}
          </div>
        </div>
      </div>
    </footer>
  );
}
