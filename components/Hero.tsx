"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Calendar, Users, Sparkles, X, Car } from "lucide-react";
import { generateItinerary } from "@/app/actions";
import RustlingButton from "./RustlingButton";
import BookingFunnel from "./BookingFunnel";
import { useLoading } from "@/providers/LoadingProvider";
import Image from "next/image";
import Link from "next/link";

function FallingLeaves() {
  const [leaves, setLeaves] = useState<Array<{ id: number, x: number }>>([]);

  useEffect(() => {
    const newLeaves = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute top-[-50px] w-5 h-5 rounded-[50%] bg-[#4ade80]/40"
          initial={{ y: -50, x: `${leaf.x}vw`, rotate: 0 }}
          animate={{
            y: "120vh",
            x: [`${leaf.x}vw`, `${leaf.x + (Math.random() * 15 - 7.5)}vw`, `${leaf.x}vw`],
            rotate: 360,
          }}
          transition={{
            duration: 8 + Math.random() * 12,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
          style={{
             clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 0 50%, 50% 0)' 
          }}
        />
      ))}
    </div>
  );
}

export default function Hero({ featuredPackages = [] }: { featuredPackages?: any[] }) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("Hero");
  
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
             <Image 
                src={currentFeatured?.main_image || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"} 
                alt={currentFeatured?.title || "Safari Background"}
                fill
                priority
                className="w-full h-full object-cover filter brightness-[0.8]"
             />
           </motion.div>
         </AnimatePresence>
      </div>

      {theme === "jungle" && <FallingLeaves />}

      <div className="relative z-30 container mx-auto px-6 text-center text-foreground flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative mb-8"
        >
          {currentFeatured ? (
             <div className="flex flex-col items-center gap-4">
                <span className="px-5 py-2 rounded-full border border-amber-500/40 text-[10px] font-black text-amber-500 bg-black/40 backdrop-blur-xl uppercase tracking-[0.4em] shadow-2xl flex items-center gap-2">
                   <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Masterpiece Selection
                </span>
                <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none mb-2 drop-shadow-2xl">
                   {currentFeatured.title}
                </h2>
                <div className="flex items-center gap-6 text-white/60 text-xs font-bold tracking-widest uppercase">
                   <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md italic">
                      {currentFeatured.duration_days} Days of Immersion
                   </span>
                   <Link href={`/packages?expedition=${currentFeatured.id}`} className="text-amber-500 border-b border-amber-500 pb-0.5 hover:text-white hover:border-white transition-all">
                      View Expedition Details
                   </Link>
                </div>
             </div>
          ) : (
             <span className="px-5 py-2 rounded-full border border-primary/40 text-sm font-semibold text-primary inline-block bg-background/50 backdrop-blur-md uppercase tracking-widest shadow-sm">
                {theme === 'jungle' ? t("venture_jungle") : t("venture")}
             </span>
          )}
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 max-w-5xl leading-[1.1] drop-shadow-lg"
        >
          {t.rich("title", {
             p: (chunks) => <span className="text-primary inline-block transition-colors duration-500">{chunks}</span>
          })}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-xl md:text-2xl mb-14 max-w-3xl text-foreground font-medium drop-shadow-md"
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
