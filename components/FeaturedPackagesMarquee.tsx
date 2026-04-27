"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ArrowRight, Compass, Sparkles, User, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import BookingFunnel from "./BookingFunnel";

interface FeaturedPackagesMarqueeProps {
  packages: any[];
}

export default function FeaturedPackagesMarquee({ packages }: FeaturedPackagesMarqueeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Packages");
  const locale = useLocale();
  const [activeBooking, setActiveBooking] = useState<any | null>(null);

  if (!packages || packages.length === 0) return null;

  return (
    <section className="relative py-12 md:py-24 overflow-hidden bg-background">
      {/* ... decorative elements ... */}
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
             className="group flex items-center gap-3 text-foreground/40 hover:text-primary transition-colors font-black uppercase text-[10px] tracking-[0.3em]"
           >
              View Full Register <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
           </Link>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative group">
         <div 
           ref={scrollRef}
           className="flex gap-6 px-6 md:px-[10%] overflow-x-auto no-scrollbar snap-x snap-mandatory pb-12"
         >
            {packages.map((pkg, idx) => (
               <motion.div 
                 key={pkg.id}
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 whileInView={{ opacity: 1, scale: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="min-w-[320px] md:min-w-[600px] aspect-[4/5.5] md:aspect-[16/9] bg-foreground/5 rounded-[2.5rem] relative overflow-hidden snap-center group/card border border-foreground/10 hover:border-primary/30 transition-all duration-700 shadow-2xl"
               >
                  {/* Background Image with Blade of Light */}
                  <div className="absolute inset-0 z-0">
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

                  {/* Top Badges */}
                  <div className="absolute top-6 left-6 right-6 flex flex-wrap justify-between items-start z-10 gap-2">
                     <div className="flex gap-2">
                        <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                           <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                           <span className="text-[8px] font-black text-white uppercase tracking-widest">{pkg.biome_orientation || "Savannah"}</span>
                        </div>
                        <div className="bg-primary px-3 py-1.5 rounded-full border border-black/10 flex items-center gap-2 shadow-lg">
                           <User className="w-3 h-3 text-black" />
                           <span className="text-[8px] font-black text-black uppercase tracking-widest">
                              {pkg.people_count_text || (pkg.max_people ? `Up to ${pkg.max_people}` : "For 2-8 People")}
                           </span>
                        </div>
                     </div>
                     {pkg.discount_price && (
                        <div className="bg-red-500 px-3 py-1.5 rounded-full shadow-lg">
                           <span className="text-[8px] font-black text-white uppercase tracking-widest">Special Offer</span>
                        </div>
                     )}
                  </div>

                   {/* Content */}
                  <div className="absolute inset-0 p-5 md:p-10 flex flex-col justify-end z-10">
                     <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{pkg.destinations?.name || "Tanzania"}</span>
                     </div>
                     <h3 className="text-lg md:text-xl lg:text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-4 group-hover/card:text-primary transition-colors italic line-clamp-2 break-words">
                        {pkg.title}
                     </h3>
                     
                     <div className="flex flex-col gap-4 border-t border-white/10 pt-4">
                        <div className="grid grid-cols-3 md:flex md:items-center gap-2 md:gap-4">
                           <div className="flex flex-col">
                              <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Investment</span>
                              <span className="text-sm md:text-xl font-black text-white whitespace-nowrap">
                                 ${pkg.discount_price || pkg.price_usd}
                                 <span className="text-[8px] md:text-[10px] text-white/30 font-medium ml-1">/PP</span>
                              </span>
                           </div>
                           <div className="hidden md:block w-px h-6 bg-white/10" />
                           <div className="flex flex-col border-l md:border-l-0 border-white/10 pl-2 md:pl-0">
                              <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Duration</span>
                              <span className="text-[10px] md:text-sm font-black text-white uppercase whitespace-nowrap">{pkg.duration_days} Days</span>
                           </div>
                           <div className="hidden md:block w-px h-6 bg-white/10" />
                           <div className="flex flex-col border-l md:border-l-0 border-white/10 pl-2 md:pl-0">
                              <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Capacity</span>
                              <span className="text-[9px] md:text-xs font-black text-primary uppercase whitespace-nowrap">
                                 {pkg.people_count_text || (pkg.max_people ? `Max ${pkg.max_people}` : "2-8 People")}
                              </span>
                           </div>
                        </div>

                        <div className="flex items-center gap-2 w-full">
                           <button 
                             onClick={() => setActiveBooking(pkg)}
                             className="flex-1 bg-primary text-black px-4 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-102 transition-all shadow-lg flex items-center justify-center gap-2"
                           >
                              <ShoppingBag className="w-3 h-3" /> Book Now
                           </button>
                           <Link 
                             href={`/${locale}/packages?expedition=${pkg.id}#expedition-${pkg.id}`}
                             className="w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center group/btn hover:bg-white/20 transition-all border border-white/10 flex-shrink-0"
                           >
                              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                           </Link>
                        </div>
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>

         {/* Navigation Indicators (Custom Scrollbar UI) */}
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {packages.map((_, i) => (
               <div key={i} className="w-8 h-1 rounded-full bg-foreground/10 overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
               </div>
            ))}
         </div>
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
