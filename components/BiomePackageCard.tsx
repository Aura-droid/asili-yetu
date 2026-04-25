"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { MapPin, Clock, DollarSign, X, Compass, Layers, Thermometer, Zap } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useTranslations } from "next-intl";
import RustlingButton from "./RustlingButton";
import StarRating from "./StarRating";
import ShareButton from "./ShareButton";
import ItineraryMap from "./ItineraryMap";
import PackageReviewModal from "./PackageReviewModal";
import BookingFunnel from "./BookingFunnel";

export default function BiomePackageCard({ pkg }: { pkg: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [userRating, setUserRating] = useState(0);

  // Parallax calculations
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  
  // Intersection Observer for Biome Shifting
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) {
      const biome = (pkg.biome_orientation || "").toLowerCase();
      const name = (pkg.destinations?.name || pkg.title || "").toLowerCase();
      
      if (biome.includes("jungle") || name.includes("gorilla") || name.includes("bwindi") || name.includes("mahale") || name.includes("forest") || name.includes("jungle")) {
        setTheme("jungle");
      } else {
        setTheme("standard"); // Savannah mode
      }
    }
  }, [isInView, pkg, setTheme]);

  // Default itinerary if none exists
  const defaultItinerary = [
    { day: 1, destination: "Moshi", accommodation: "Springlands Hotel", lat: -3.3349, lng: 37.3404 },
    { day: 2, destination: "Lake Manyara NP", accommodation: "Highview Hotel", lat: -3.35, lng: 35.83 },
    { day: 3, destination: "Central Serengeti NP", accommodation: "Serengeti Safari Lodge", lat: -2.33, lng: 34.83 },
    { day: 4, destination: "Serengeti NP", accommodation: "Serengeti Safari Lodge", lat: -2.15, lng: 34.68 },
    { day: 5, destination: "Ngorongoro Crater", accommodation: "Highview Hotel", lat: -3.24, lng: 35.48 },
    { day: 6, destination: "Moshi", accommodation: "Springlands Hotel", lat: -3.3349, lng: 37.3404 },
    { day: 7, destination: "Kilimanjaro Int. Airport", accommodation: "No accommodation", lat: -3.43, lng: 37.07 }
  ];

  const itinerary = pkg.itinerary?.length > 0 ? pkg.itinerary : defaultItinerary;

  const pt = useTranslations("Packages");
  
  return (
    <>
      <motion.div 
        ref={ref}
        id={`expedition-${pkg.id}`}
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-10%" }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[80vh] min-h-[600px] mb-32 rounded-[3rem] overflow-hidden group shadow-2xl scroll-mt-32"
      >
        {/* Background Parallax Image */}
        <div className="absolute inset-0 z-0 bg-background/5 overflow-hidden">
          <motion.img 
            style={{ y }}
            src={pkg.main_image || pkg.destinations?.image_url || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"} 
            alt={pkg.title}
            className="w-[100%] h-[140%] object-cover object-center absolute -top-[20%]"
          />
          {/* Gradient overlays for cinematic effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent opacity-80" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-16 lg:p-24">
          {pkg.is_featured && (
            <div className="mb-4 inline-block bg-primary text-[#0f172a] text-sm font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg w-fit">
              {pt("masterpiece_edition")}
            </div>
          )}

          {pkg.discount_price && (
            <div className="mb-4 inline-block bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg w-fit animate-pulse">
              Special Offer: -{Math.round(((pkg.price_usd - pkg.discount_price) / pkg.price_usd) * 100)}%
            </div>
          )}
          
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-[1.1] drop-shadow-lg">
              {pkg.title}
            </h2>

            <div className="mb-8">
              <StarRating 
                 interactive
                 onRate={(r) => {
                   setUserRating(r);
                   setShowReviewModal(true);
                 }}
                 rating={pkg.avg_rating || (4.5 + Math.random() * 0.5)} 
                 reviewsCount={pkg.review_count || Math.floor(Math.random() * 80 + 20)} 
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base font-medium mb-12">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{pkg.destinations?.name || "Tanzania"}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <Clock className="w-5 h-5 text-primary" />
                <span>{pkg.duration_days} {pt("days")} / {pkg.duration_days - 1} {pt("nights")}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <span className="font-bold tracking-widest uppercase text-xs text-primary">{pkg.difficulty_level}</span>
              </div>
              {pkg.biome_orientation && (
                  <div className="hidden md:flex items-center gap-2 bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full border border-primary/30">
                    <Layers className="w-4 h-4 text-primary" />
                    <span className="font-bold uppercase text-[10px] tracking-widest text-white">{pkg.biome_orientation}</span>
                  </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pt-8 border-t border-white/20 mt-auto">
            <div>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">{pt("investment")}</p>
              <div className="flex items-center text-white">
                <DollarSign className="w-6 h-6 text-primary -ml-1" />
                {pkg.discount_price ? (
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black line-through text-white/40 mb-[-4px]">${pkg.price_usd}</span>
                    <div className="flex items-center">
                      <span className="text-5xl font-black text-primary">{pkg.discount_price}</span>
                      <span className="text-white/50 ml-2 font-medium">/ {pt("per_person")}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-5xl font-black">{pkg.price_usd}</span>
                    <span className="text-white/50 ml-2 font-medium">/ {pt("per_person")}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <ShareButton 
                title={pkg.title} 
                text={`Check out this ${pkg.duration_days}-day expedition: ${pkg.title}. Highly rated (${(pkg.avg_rating || 5.0).toFixed(1)} ★) on Asili Yetu!`}
                url={typeof window !== 'undefined' ? `${window.location.origin}/packages?expedition=${pkg.id}#expedition-${pkg.id}` : undefined}
              />
              <RustlingButton 
                onClick={() => setIsOpen(true)}
                className="bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform w-full sm:w-auto text-center shrink-0"
              >
                {pt("explore_itinerary")}
              </RustlingButton>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ITINERARY MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-3xl p-4 md:p-12 overflow-y-auto"
          >
             <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                   <div>
                      <h2 className="text-4xl md:text-6xl font-black text-foreground italic uppercase tracking-tighter leading-none mb-2">
                         {pt("expedition")} <span className="text-primary italic">{pt("dossier")}</span>
                      </h2>
                      <p className="text-foreground/50 font-bold uppercase tracking-[0.3em] text-[10px]">{pkg.title}</p>
                   </div>
                   <button 
                     onClick={() => setIsOpen(false)}
                     className="w-16 h-16 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
                   >
                      <X className="w-8 h-8" />
                   </button>
                </div>

                <div className="mb-24">
                   <ItineraryMap itinerary={itinerary} />
                </div>

                <div className="max-w-4xl">
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                       <div className="flex items-center gap-3 bg-foreground/5 px-6 py-3 rounded-2xl border border-foreground/10">
                          <Layers className="w-5 h-5 text-primary" />
                          <div>
                             <p className="text-[8px] font-black text-foreground/30 uppercase tracking-[0.2em] leading-none mb-1">Biome</p>
                             <p className="text-sm font-bold text-foreground leading-none">{pkg.biome_orientation || "Savannah Majesty"}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 bg-foreground/5 px-6 py-3 rounded-2xl border border-foreground/10">
                          <Thermometer className="w-5 h-5 text-primary" />
                          <div>
                             <p className="text-[8px] font-black text-foreground/30 uppercase tracking-[0.2em] leading-none mb-1">Thermal profile</p>
                             <p className="text-sm font-bold text-foreground leading-none">{pkg.temperature_profile || "Warm & Sun-drenched"}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 bg-foreground/5 px-6 py-3 rounded-2xl border border-foreground/10">
                          <Zap className="w-5 h-5 text-primary" />
                          <div>
                             <p className="text-[8px] font-black text-foreground/30 uppercase tracking-[0.2em] leading-none mb-1">Momentum</p>
                             <p className="text-sm font-bold text-foreground leading-none">{pkg.intensity_vibe || "Balanced Flow"}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                          <Compass className="w-6 h-6" />
                       </div>
                       <h3 className="text-xl font-bold uppercase tracking-widest text-foreground/40 italic">{pt("concept")}</h3>
                    </div>
                   <p className="text-xl md:text-2xl font-medium text-foreground/80 leading-relaxed mb-12">
                      {pkg.description}
                   </p>
                   <RustlingButton 
                      onClick={() => setShowBooking(true)}
                      className="bg-primary text-black px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                    >
                      {pt("book_masterpiece")}
                   </RustlingButton>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
         {showBooking && (
            <BookingFunnel 
              itinerary={{
                recommendedTitle: pkg.title,
                rationale: pkg.description,
                dailyBreakdown: itinerary
              }} 
              onClose={() => setShowBooking(false)} 
            />
         )}
      </AnimatePresence>

      <PackageReviewModal 
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        packageTitle={pkg.title}
        rating={userRating}
      />
    </>
  );
}

