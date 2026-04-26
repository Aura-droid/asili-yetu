"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { MapPin, Calendar, Users, Sparkles, X, Car, ArrowRight } from "lucide-react";
import { generateItinerary } from "@/app/actions";
import RustlingButton from "./RustlingButton";
import BookingFunnel from "./BookingFunnel";
import { useLoading } from "@/providers/LoadingProvider";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Snowflake } from "lucide-react";

function FallingLeaves() {
  const [leaves, setLeaves] = useState<Array<{ id: number, x: number, delay: number, duration: number, rotate: number, size: number }>>([]);
  useEffect(() => {
    setLeaves(Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 10,
      rotate: Math.random() * 360,
      size: 15 + Math.random() * 20
    })));
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{ y: -50, x: `${leaf.x}vw`, rotate: leaf.rotate, opacity: 0 }}
          animate={{ 
            y: "110vh", 
            x: [`${leaf.x}vw`, `${leaf.x + 5}vw`, `${leaf.x - 5}vw`, `${leaf.x}vw`],
            rotate: leaf.rotate + 720,
            opacity: [0, 0.4, 0.4, 0]
          }}
          transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: "linear" }}
          className="absolute text-primary/20"
        >
          <Leaf size={leaf.size} />
        </motion.div>
      ))}
    </div>
  );
}

function SavannahSpark() {
  const [sparks, setSparks] = useState<Array<{ id: number, x: number, y: number, delay: number }>>([]);
  useEffect(() => {
    setSparks(Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    })));
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{ duration: 3, delay: spark.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: `${spark.x}%`, top: `${spark.y}%` }}
          className="absolute w-1 h-1 bg-primary rounded-full blur-[1px] shadow-[0_0_10px_rgba(212,175,55,1)]"
        />
      ))}
    </div>
  );
}

function FloatingGlimmer() {
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, size: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/20 backdrop-blur-sm border border-white/10"
          initial={{ opacity: 0, x: `${p.x}vw`, y: `${p.y}vh` }}
          animate={{
            y: [`${p.y}vh`, `${p.y - 10}vh`, `${p.y}vh`],
            x: [`${p.x}vw`, `${p.x + 5}vw`, `${p.x}vw`],
            opacity: [0, 0.4, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

export default function Hero({ featuredPackages = [] }: { featuredPackages?: any[] }) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("Hero");
  const locale = useLocale();
  
  // Form State
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("");
  
  // Intelligent System State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFunnel, setShowFunnel] = useState(false);
  const { setIsLoading: setGlobalLoading } = useLoading();

  // Carousel Logic
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentFeatured = featuredPackages[currentIndex];

  useEffect(() => {
    if (featuredPackages.length <= 1) return;
    const interval = setInterval(() => {
       setCurrentIndex((prev) => (prev + 1) % featuredPackages.length);
    }, 8000); // 8 seconds per masterpiece
    return () => clearInterval(interval);
  }, [featuredPackages.length]);

  // Mouse Tracking for Interactive Glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handlePlanSafari = async () => {
    if (!location) return;
    setLoading(true);
    setGlobalLoading(true);
    setError(null);
    try {
      const res = await generateItinerary({ location, dates, guests });
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.error || "Failed to generate itinerary");
      }
    } catch(err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background transition-colors duration-700">
      {/* Background layer */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
         <div className={`absolute inset-0 ${theme === 'jungle' ? 'bg-[#0a140d]/80' : 'bg-[#e2d5c3]/60'} z-10 transition-colors duration-1000`} />
         <AnimatePresence mode="wait">
           <motion.div
             key={currentFeatured?.id || "default"}
             initial={{ opacity: 0, scale: 1.1 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.95 }}
             transition={{ duration: 2, ease: "easeInOut" }}
             className="absolute inset-0"
           >
             <motion.div
                className="absolute -inset-[20%]"
             >
                <Image 
                   src={currentFeatured?.main_image || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"} 
                   alt={currentFeatured?.title || "Safari Background"}
                   fill
                   priority
                   className="w-full h-full object-cover filter brightness-[0.8]"
                />
             </motion.div>
           </motion.div>
         </AnimatePresence>
      </div>

      {theme === "jungle" ? <FallingLeaves /> : <SavannahSpark />}

      <div className="relative z-30 container mx-auto px-6 text-center text-foreground flex flex-col items-center">
        {/* FLOATING MASTERPIECE BADGE (Minimized & Attention-Grabbing) */}
        {currentFeatured && (
           <motion.div 
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             className="fixed top-24 right-6 md:right-12 z-50 group hidden lg:block"
           >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer bg-black/40 backdrop-blur-2xl border border-primary/30 p-2 rounded-[2rem] shadow-[0_0_50px_rgba(212,175,55,0.15)] flex items-center gap-4 group-hover:border-primary transition-all duration-500 overflow-hidden"
                onClick={() => window.location.href = `/${locale}/packages?expedition=${currentFeatured.id}`}
              >
                 {/* Portal */}
                 <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shrink-0">
                    <Image 
                       src={currentFeatured.main_image || ""} 
                       alt="Portal"
                       fill
                       className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                 </div>

                 <div className="pr-6 max-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                       <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                       <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Masterpiece Edition</span>
                    </div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tighter truncate leading-none">
                       {currentFeatured.title}
                    </h4>
                    <p className="text-[9px] font-bold text-white/40 uppercase mt-1 tracking-widest">
                       {currentFeatured.duration_days} Days Immersion
                    </p>
                 </div>

                 {/* Shimmer Effect */}
                 <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.div>
           </motion.div>
        )}

        {/* Hero Branding / Subtle Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
           <span className="px-5 py-2 rounded-full border border-primary/20 text-[10px] font-black text-primary inline-block bg-black/10 backdrop-blur-md uppercase tracking-[0.4em] shadow-sm">
              {theme === 'jungle' ? "The Deep Exploration" : "Arusha Command Center"}
           </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 max-w-5xl leading-[1.1] drop-shadow-lg"
        >
          {t.rich("title", {
             p: (chunks) => <span className="bg-linear-to-r from-primary via-amber-300 to-primary bg-clip-text text-transparent animate-shimmer inline-block transition-colors duration-500">{chunks}</span>
          })}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg md:text-2xl mb-14 max-w-3xl text-foreground font-medium drop-shadow-md"
        >
          {t("subtitle")}
        </motion.p>

        {/* AI Booking Placeholder Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
          className="bg-background/90 backdrop-blur-2xl p-3 md:p-4 rounded-[2rem] md:rounded-full border border-foreground/15 shadow-2xl flex flex-col md:flex-row items-center gap-3 w-full max-w-4xl mx-auto relative z-30"
        >
           <div className="flex-1 flex items-center gap-3 w-full border-b md:border-b-0 md:border-r border-foreground/20 pb-4 md:pb-0 px-5 pt-3 md:pt-0">
              <MapPin className="text-primary w-6 h-6 flex-shrink-0" />
              <input 
                value={location} onChange={(e) => setLocation(e.target.value)}
                type="text" placeholder={t("where")} 
                className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-foreground/60 font-semibold focus:ring-0" 
              />
           </div>
           
           <div className="flex-1 flex items-center gap-3 w-full border-b md:border-b-0 md:border-r border-foreground/20 pb-4 md:pb-0 px-5">
              <Calendar className="text-primary w-6 h-6 flex-shrink-0" />
              <input 
                value={dates} onChange={(e) => setDates(e.target.value)}
                type="date" aria-label={t("dates")}
                className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-foreground/60 font-semibold focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 cursor-pointer" 
              />
           </div>
           
           <div className="flex-1 flex items-center gap-3 w-full pb-4 md:pb-0 px-5">
              <Users className="text-primary w-6 h-6 flex-shrink-0" />
              <input 
                value={guests} onChange={(e) => setGuests(e.target.value)}
                type="text" placeholder={t("guests")} 
                className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-foreground/60 font-semibold focus:ring-0" 
              />
           </div>
           
           <div className="flex flex-col items-center gap-3 w-full md:w-auto">
              <RustlingButton 
                 onClick={handlePlanSafari}
                 disabled={loading}
                 className="bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-[#0f172a] px-10 py-5 rounded-full font-bold text-lg w-full transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/30 flex items-center gap-2 justify-center"
              >
                 {loading ? (
                   <span className="flex items-center gap-2">
                     <motion.div
                       animate={{ y: [0, -3, 0, -1, 0], x: [0, 2, 4, 6, 8] }}
                       transition={{ repeat: Infinity, duration: 1.5 }}
                     >
                       <Car className="w-6 h-6" />
                     </motion.div>
                     <span className="hidden sm:inline">{t("gearing_up")}</span>
                   </span>
                 ) : (
                   t("plan_safari")
                 )}
              </RustlingButton>
              {error && (
                 <div className="absolute -bottom-8 md:-bottom-12 w-full text-center text-red-500 font-bold text-sm bg-red-100/10 px-4 py-2 rounded-full border border-red-500/20 backdrop-blur-md">
                    Error: {error}
                 </div>
              )}
           </div>
        </motion.div>
      </div>

      {/* AI Result Modal */}
      <AnimatePresence>
        {result && !showFunnel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-background text-foreground w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl p-8 relative"
            >
              <button 
                onClick={() => setResult(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 text-primary font-bold">
                <Sparkles className="w-6 h-6" />
                <span>{t("modal_title")}</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight mb-2">{result.recommendedTitle}</h2>
              <p className="text-foreground/80 mb-8 pb-6 border-b border-foreground/10 text-lg leading-relaxed">{result.rationale}</p>

              <div className="space-y-6">
                {result.dailyBreakdown?.map((day: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                        {day.day}
                      </div>
                      {i !== result.dailyBreakdown.length - 1 && (
                        <div className="w-0.5 h-full bg-primary/10 my-2" />
                      )}
                    </div>
                    <div className="pt-2 pb-6">
                      <p className="font-medium text-foreground">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <RustlingButton 
                onClick={() => {
                   setTheme("jungle");
                   setShowFunnel(true);
                }}
                className="mt-8 w-full bg-foreground text-background font-bold py-4 rounded-xl hover:opacity-90 transition-opacity"
              >
                {t("proceed")}
              </RustlingButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
         {showFunnel && (
            <BookingFunnel 
              itinerary={result} 
              initialGuests={guests}
              initialDates={dates}
              onClose={() => {
                setShowFunnel(false);
                setResult(null); // Clear everything only when done
              }} 
            />
         )}
      </AnimatePresence>
    </div>
  );
}
