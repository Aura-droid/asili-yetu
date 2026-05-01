"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { MapPin, Clock, ArrowRight, Compass, Sparkles, User, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import BookingFunnel from "./BookingFunnel";

interface FeaturedPackagesMarqueeProps {
  packages: any[];
}

const PACKAGE_TIER_META: Record<string, { label: string; className: string }> = {
  budget: { label: "Budget", className: "bg-emerald-500/90 text-white" },
  mid_range: { label: "Mid Range", className: "bg-amber-400 text-black" },
  luxury: { label: "Luxury", className: "bg-fuchsia-500/90 text-white" },
};

export default function FeaturedPackagesMarquee({ packages }: FeaturedPackagesMarqueeProps) {
  const controls = useAnimationControls();
  const [index, setIndex] = useState(0);
  const t = useTranslations("Packages");
  const locale = useLocale();
  const [activeBooking, setActiveBooking] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIndex(0);
      return;
    }
    const interval = setInterval(() => {
      if (!activeBooking) {
        setIndex((prev) => (prev + 1) % (packages.length || 1));
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [packages.length, activeBooking]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      controls.set({ x: 0 });
      return;
    }
    controls.start({ 
      x: `calc(-${index * 100}% - ${index * 1.5}rem)`,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    });
  }, [index, controls]);

  if (!packages || packages.length === 0) return null;

  return (
    <section className="relative py-12 md:py-24 overflow-hidden bg-background">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="flex items-center gap-2 mb-4"
           >
              <div className="w-10 h-1px bg-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">{t("masterpiece_edition")}</span>
           </motion.div>
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter italic leading-none"
           >
              Featured <span className="text-primary">Expeditions</span>
           </motion.h2>
        </div>
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
           <Link 
             href={`/${locale}/packages`}
             className="group inline-flex items-center justify-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-6 py-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary transition-all hover:bg-primary hover:text-black hover:shadow-lg hover:shadow-primary/20"
           >
              See All Packages <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </Link>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative group overflow-hidden md:overflow-visible -mx-6 px-6 md:mx-0 md:px-0">
         <motion.div 
            animate={controls}
            drag="x"
            dragConstraints={{ right: 0, left: -(packages.length - 1) * 350 }} 
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 && index < packages.length - 1) setIndex(index + 1);
              if (info.offset.x > 50 && index > 0) setIndex(index - 1);
            }}
            className="flex md:grid md:grid-cols-1 2xl:grid-cols-2 gap-6 md:px-[16%] xl:px-[12%] 2xl:px-[9%] w-full touch-pan-y"
         >
            {packages.map((pkg, idx) => {
               const tierMeta = PACKAGE_TIER_META[pkg.package_tier || "mid_range"] || PACKAGE_TIER_META.mid_range;
               return (
               <motion.div 
                 key={pkg.id}
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 whileInView={{ opacity: 1, scale: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="min-w-full md:min-w-0 aspect-[4/5.5] md:aspect-[16/10.8] xl:aspect-[16/10.4] 2xl:aspect-[16/10] bg-foreground/5 rounded-[2.5rem] relative overflow-hidden md:overflow-visible group/card border border-foreground/10 hover:border-primary/30 transition-all duration-700 shadow-2xl shrink-0"
               >
                  {/* Background Image with Blade of Light */}
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
                     <Image 
                       src={pkg.main_image || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"} 
                       alt={pkg.title}
                       fill
                       className="object-cover group-hover/card:scale-110 transition-transform duration-1000"
                     />
                     <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                     
                     {/* Blade of Light */}
                     <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Top Rail */}
                  <div className="absolute top-5 left-5 right-5 md:hidden z-10 flex items-start gap-2">
                     <div className="flex flex-wrap items-center gap-2 max-w-[78%]">
                        <div className="bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
                           <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                           <span className="text-[8px] font-black text-white uppercase tracking-[0.24em]">
                              {pkg.biome_orientation || "Savannah"}
                           </span>
                        </div>
                        <div className={`px-3 py-1.5 rounded-full border border-black/10 shadow-lg ${tierMeta.className}`}>
                           <span className="text-[8px] font-black uppercase tracking-[0.24em]">{tierMeta.label}</span>
                        </div>
                     </div>
                     {pkg.discount_price && (
                        <div className="ml-auto mr-1 bg-red-500/95 px-3 py-1.5 rounded-full shadow-lg shrink-0">
                           <span className="text-[8px] font-black text-white uppercase tracking-[0.22em]">Special</span>
                        </div>
                     )}
                  </div>

                  <div className="absolute inset-0 hidden md:grid md:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1.05fr)_350px] 2xl:grid-cols-[minmax(0,1.12fr)_370px] z-10">
                     <div className="flex flex-col justify-end px-7 pb-7 xl:px-8 xl:pb-8 2xl:px-10 2xl:pb-10 min-w-0">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                           <div className="bg-black/45 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
                              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                              <span className="text-[10px] font-black text-white uppercase tracking-[0.22em]">
                                 {pkg.biome_orientation || "Savannah Majesty"}
                              </span>
                           </div>
                           <div className={`px-4 py-2 rounded-full border border-black/10 shadow-lg ${tierMeta.className}`}>
                              <span className="text-[10px] font-black uppercase tracking-[0.22em]">{tierMeta.label}</span>
                           </div>
                           {pkg.discount_price && (
                              <div className="bg-red-500/95 px-4 py-2 rounded-full shadow-lg">
                                 <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Special Offer</span>
                              </div>
                           )}
                        </div>

                         <div className="max-w-[20rem] xl:max-w-[22rem] 2xl:max-w-[24rem]">
                           <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-3.5 h-3.5 text-primary" />
                              <span className="text-[10px] font-bold text-white/65 uppercase tracking-[0.28em]">
                                 {pkg.destinations?.name || "Tanzania"}
                              </span>
                           </div>
                           <h3 className="text-[1.95rem] xl:text-[2.1rem] 2xl:text-[2.3rem] font-black text-white uppercase tracking-tighter leading-[0.88] group-hover/card:text-primary transition-colors italic drop-shadow-lg line-clamp-4 break-words">
                              {pkg.title}
                           </h3>
                         </div>
                     </div>

                     <div className="flex items-end justify-end p-6 pb-14 xl:p-7 xl:pb-15 2xl:p-8 2xl:pb-16">
                        <div className="relative w-full rounded-[2.2rem] bg-black/30 backdrop-blur-2xl border border-white/10 px-5 pb-6 pt-20 xl:px-5 xl:pb-6 xl:pt-20 2xl:px-6 2xl:pb-7 2xl:pt-22 shadow-[0_30px_70px_rgba(0,0,0,0.38)]">
                           <div className="absolute -top-9 right-5 xl:-top-9 xl:right-5 2xl:-top-10 2xl:right-7 rotate-[1.5deg]">
                              <div className="absolute left-7 top-[-18px] h-5 w-px bg-primary/70" />
                              <div className="absolute left-[22px] top-[-24px] h-3 w-3 rounded-full border border-primary/60 bg-black/60" />
                              <div className="rounded-[1.5rem] border border-primary/35 bg-primary px-4 py-3 2xl:px-5 text-black shadow-[0_20px_45px_rgba(237,170,55,0.38)]">
                                 <div className="absolute inset-0 rounded-[1.5rem] bg-linear-to-br from-white/18 via-transparent to-black/10 pointer-events-none" />
                                 <p className="relative text-[9px] font-black uppercase tracking-[0.22em] text-black/60">{t("investment")}</p>
                                 <div className="relative flex items-end gap-1.5">
                                    <span className="text-[2rem] xl:text-[2rem] 2xl:text-[2.25rem] font-black leading-none whitespace-nowrap">
                                       ${pkg.discount_price || pkg.price_usd}
                                    </span>
                                    <span className="pb-1 text-[11px] font-bold text-black/55">/PP</span>
                                 </div>
                              </div>
                           </div>

                           <div className="ml-auto flex w-[46%] min-w-[132px] 2xl:w-[42%] flex-col rounded-[1.5rem] bg-white/6 px-4 py-4">
                              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Duration</span>
                              <span className="text-[0.95rem] xl:text-base 2xl:text-lg font-black text-white uppercase leading-none">{pkg.duration_days} Days</span>
                           </div>

                           <div className="mt-4 flex items-center gap-2 rounded-[1.5rem] bg-primary/12 border border-primary/20 px-4 py-4">
                              <User className="w-4 h-4 text-primary shrink-0" />
                              <span className="text-[11px] font-black text-primary uppercase tracking-[0.14em] leading-tight">
                                 {pkg.people_count_text || (pkg.max_people ? `Up to ${pkg.max_people} People` : "For 2-8 People")}
                              </span>
                           </div>

                           <div className="mt-5 flex items-center gap-3">
                              <button
                                onClick={() => setActiveBooking(pkg)}
                                className="flex-1 min-w-0 bg-primary text-black px-4 py-4 rounded-full font-black uppercase text-[10px] 2xl:text-[11px] tracking-[0.14em] hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-2"
                              >
                                 <ShoppingBag className="w-3.5 h-3.5" /> Book Now
                              </button>
                              <Link
                                href={`/${locale}/packages?expedition=${pkg.id}#expedition-${pkg.id}`}
                                className="w-14 h-14 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center group/btn hover:bg-white/20 transition-all border border-white/10 flex-shrink-0"
                              >
                                 <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                              </Link>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="absolute left-6 right-6 top-24 z-10 hidden">
                     <div className="max-w-[52%] lg:max-w-[50%]">
                        <div className="flex items-center gap-2 mb-3">
                           <MapPin className="w-3.5 h-3.5 text-primary" />
                           <span className="text-[10px] font-bold text-white/65 uppercase tracking-[0.28em]">
                              {pkg.destinations?.name || "Tanzania"}
                           </span>
                        </div>
                        <h3 className="text-[1.9rem] lg:text-[1.7rem] 2xl:text-[1.85rem] font-black text-white uppercase tracking-tighter leading-[0.92] group-hover/card:text-primary transition-colors italic drop-shadow-lg">
                           {pkg.title}
                        </h3>
                     </div>
                  </div>

                   {/* Content */}
                  <div className="absolute inset-x-5 bottom-5 z-10 flex md:hidden">
                     <div className="w-full rounded-[2rem] bg-black/28 backdrop-blur-xl border border-white/10 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                     <div className="flex items-center gap-2 mb-2 md:hidden">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{pkg.destinations?.name || "Tanzania"}</span>
                     </div>
                     <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-[1.05] mb-5 group-hover/card:text-primary transition-colors italic line-clamp-3 break-words max-w-[20ch]">
                        {pkg.title}
                     </h3>
                     
                     <div className="flex flex-col gap-4 border-t border-white/10 pt-4">
                        <div className="grid grid-cols-2 gap-2 lg:grid-cols-2 lg:gap-3">
                           <div className="flex flex-col rounded-2xl bg-white/6 px-3 py-3">
                              <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{t("investment")}</span>
                              <span className="text-sm md:text-xl font-black text-white whitespace-nowrap">
                                 ${pkg.discount_price || pkg.price_usd}
                                 <span className="text-[8px] md:text-[10px] text-white/30 font-medium ml-1">/PP</span>
                              </span>
                           </div>
                           <div className="flex flex-col rounded-2xl bg-white/6 px-3 py-3">
                              <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Duration</span>
                              <span className="text-[10px] md:text-sm font-black text-white uppercase whitespace-nowrap">{pkg.duration_days} Days</span>
                           </div>
                           <div className="col-span-2 flex items-center gap-2 rounded-2xl bg-primary/12 border border-primary/20 px-3 py-3">
                              <User className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.14em] leading-tight">
                                 {pkg.people_count_text || (pkg.max_people ? `Up to ${pkg.max_people} People` : "For 2-8 People")}
                              </span>
                           </div>
                        </div>

                        <div className="flex items-center gap-2 w-full pt-1">
                           <button 
                             onClick={() => setActiveBooking(pkg)}
                             className="flex-1 bg-primary text-black px-4 py-3.5 rounded-full font-black uppercase text-[10px] tracking-[0.18em] hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-2"
                           >
                              <ShoppingBag className="w-3 h-3" /> Book Now
                           </button>
                           <Link 
                              href={`/${locale}/packages?expedition=${pkg.id}#expedition-${pkg.id}`}
                             className="w-12 h-12 md:w-13 md:h-13 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center group/btn hover:bg-white/20 transition-all border border-white/10 flex-shrink-0"
                           >
                              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                           </Link>
                        </div>
                     </div>
                     </div>
                  </div>
               </motion.div>
               );
            })}
         </motion.div>

         {/* Navigation Indicators */}
         <div className="flex md:hidden justify-center gap-2 mt-8">
            {packages.map((_, i) => (
               <button
                 key={i}
                 onClick={() => setIndex(i)}
                 className={`h-1.5 transition-all duration-500 rounded-full ${i === index ? 'w-8 bg-primary' : 'w-2 bg-foreground/10'}`}
                 aria-label={`Go to slide ${i + 1}`}
               />
            ))}
         </div>
      </div>

      <div className="container mx-auto px-6 mt-10 flex justify-center md:hidden">
         <Link
           href={`/${locale}/packages`}
           className="inline-flex w-full max-w-sm items-center justify-center gap-3 rounded-full bg-foreground px-6 py-4 text-[10px] font-black uppercase tracking-[0.28em] text-background transition-all hover:bg-primary hover:text-black"
         >
           See All Packages <ArrowRight className="w-4 h-4" />
         </Link>
      </div>

      <AnimatePresence>
         {activeBooking && (
            <BookingFunnel 
               itinerary={{
                  recommendedTitle: activeBooking.title,
                  rationale: activeBooking.description,
                  dailyBreakdown: activeBooking.itinerary
               }} 
               packagePrice={activeBooking.price_usd}
               packageDiscount={activeBooking.discount_price}
               peopleCountText={activeBooking.people_count_text || (activeBooking.max_people ? `For up to ${activeBooking.max_people} people` : "For 2-8 people")}
               maxPeople={activeBooking.max_people || 8}
               onClose={() => setActiveBooking(null)} 
            />
         )}
      </AnimatePresence>
    </section>
  );
}
