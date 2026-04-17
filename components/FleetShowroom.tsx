"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Wind, Shield, ChevronLeft, MapPin, Search, Zap } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface Vehicle {
  id: string;
  is_available: boolean;
  image_url: string;
  model_name: string;
  capacity: number;
  features: string[];
  translations?: Record<string, string>;
}

interface FleetShowroomProps {
  fleet: Vehicle[];
}

export default function FleetShowroom({ fleet }: FleetShowroomProps) {
  const t = useTranslations("Fleet");
  const locale = useLocale();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedVehicle = fleet.find((v) => v.id === selectedId);
  
  // Logic to parse AI translations
  const getLocalizedVehicle = (v: Vehicle) => {
    if (!v.translations?.[locale]) return { name: v.model_name, features: v.features };
    const raw = v.translations[locale];
    const nameMatch = raw.match(/Machine:\s*(.*?)\.\s*Features:/);
    const featuresMatch = raw.match(/Features:\s*(.*)/);
    
    return {
      name: nameMatch ? nameMatch[1] : v.model_name,
      features: featuresMatch ? featuresMatch[1].split(',').map(f => f.trim()) : v.features
    };
  };

  const defaultHotspots = [
    { id: 1, top: "25%", left: "45%", title: "Pop-Up Roof", desc: "Unobstructed 360° views for photography and wildlife spotting." },
    { id: 2, top: "60%", left: "30%", title: "Heavy-Duty Suspension", desc: "Smooth ride across the toughest terrains." },
    { id: 3, top: "45%", left: "70%", title: "Comfortable Seating", desc: "Spacious window seats for every passenger." },
  ];

  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  return (
    <div className="relative w-full py-24 min-h-[80vh]">
      <AnimatePresence mode="wait" initial={false}>
        {!selectedId ? (
          // THE GARAGE VIEW
          <motion.div
            key="garage"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="w-full"
          >
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary text-center mb-12 uppercase tracking-[0.5em] text-[10px] font-black italic"
            >
              {t("select")}
            </motion.p>
            <div className="flex flex-nowrap overflow-x-auto gap-12 px-12 pb-24 snap-x snap-mandatory hide-scrollbar">
              {fleet.map((vehicle) => (
                <motion.div
                  layoutId={`vehicle-container-${vehicle.id}`}
                  key={vehicle.id}
                  onClick={() => setSelectedId(vehicle.id)}
                  whileHover={{ y: -20, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="snap-center shrink-0 w-80 md:w-[450px] cursor-pointer group"
                >
                  {(() => {
                    const local = getLocalizedVehicle(vehicle);
                    return (
                      <div className="relative h-96 rounded-[3rem] overflow-hidden bg-foreground/5 shadow-sm group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)] transition-all duration-700">
                        {!vehicle.is_available && (
                          <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl z-30 flex items-center justify-center">
                            <span className="bg-primary text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">Deployment Readying</span>
                          </div>
                        )}
                        <motion.img
                          layoutId={`vehicle-image-${vehicle.id}`}
                          src={vehicle.image_url || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"}
                          alt={local.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        <div className="absolute inset-x-0 bottom-0 p-10">
                          <motion.h3 
                            layoutId={`vehicle-title-${vehicle.id}`}
                            className="text-white text-3xl font-black italic tracking-tighter"
                          >
                            {local.name}
                          </motion.h3>
                          <div className="mt-4 flex gap-4">
                             <span className="text-white/60 text-[10px] font-black uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">Explorer Grade</span>
                             <span className="text-white/60 text-[10px] font-black uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">{vehicle.capacity} Seats</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          // THE STAGE VIEW
          <motion.div
            key="stage"
            className="w-full flex flex-col md:flex-row gap-16 px-12"
          >
             {/* Left: Interactive Image */}
             <motion.div 
               layoutId={`vehicle-container-${selectedVehicle?.id}`}
               initial={{ opacity: 0, x: -100 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, type: "spring" }}
               className="w-full md:w-2/3 h-[60vh] md:h-[80vh] rounded-[4rem] overflow-hidden relative shadow-[0_60px_120px_rgba(0,0,0,0.3)] bg-foreground/5 flex-shrink-0"
             >
                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                
                <button 
                  onClick={() => {
                    setSelectedId(null);
                    setActiveHotspot(null);
                  }}
                  className="absolute top-10 left-10 z-50 bg-white/20 hover:bg-white backdrop-blur-2xl border border-white/20 px-6 py-3 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-2xl active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" /> Exit Showroom
                </button>

                <motion.img
                  layoutId={`vehicle-image-${selectedVehicle?.id}`}
                  src={selectedVehicle?.image_url || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"}
                  alt={selectedVehicle?.model_name || "Vehicle"}
                  className="w-full h-full object-cover"
                />

                {/* Hotspots Overlay */}
                {defaultHotspots.map((spot) => (
                  <motion.div
                    key={spot.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring", bounce: 0.5 }}
                    className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ top: spot.top, left: spot.left }}
                  >
                    <button
                      onMouseEnter={() => setActiveHotspot(spot.id)}
                      onMouseLeave={() => setActiveHotspot(null)}
                      className="relative flex items-center justify-center group"
                    >
                      <span className="absolute inline-flex h-12 w-12 rounded-full bg-primary opacity-50 animate-ping" />
                      <span className="relative inline-flex rounded-full h-10 w-10 bg-primary text-black shadow-2xl border border-white/50 items-center justify-center">
                        <Search className="w-5 h-5" />
                      </span>
                    </button>

                    {/* Tooltip */}
                    <AnimatePresence>
                      {activeHotspot === spot.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute -top-4 left-16 w-80 bg-black/80 backdrop-blur-3xl p-8 rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-none"
                        >
                          <h4 className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-3">{spot.title}</h4>
                          <p className="text-white/60 text-sm leading-relaxed font-medium">{spot.desc}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
             </motion.div>

             {/* Right: Data Panel */}
             {(() => {
               const local = selectedVehicle ? getLocalizedVehicle(selectedVehicle) : { name: '', features: [] };
               return (
                 <motion.div
                   initial={{ opacity: 0, x: 50 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 1, delay: 0.3 }}
                   className="w-full md:w-1/3 flex flex-col justify-center"
                 >
                    <div className="flex items-center gap-3 text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-6">
                       <Shield className="w-4 h-4" /> Technical Dossier
                    </div>
                    
                    <motion.h3 
                      layoutId={`vehicle-title-${selectedVehicle?.id}`}
                      className="text-5xl md:text-7xl text-foreground font-black mb-8 leading-[0.9] tracking-tighter italic uppercase"
                    >
                      {local.name}
                    </motion.h3>

                    <div className="flex items-center gap-6 mb-12 pb-12 border-b border-foreground/5">
                       <div className="w-16 h-16 bg-foreground/5 rounded-3xl flex items-center justify-center text-primary shadow-sm">
                          <Users className="w-8 h-8" />
                       </div>
                       <div>
                          <span className="block text-[10px] uppercase font-black text-foreground/50 tracking-[0.2em] mb-1">Payload Capacity</span>
                          <span className="font-extrabold text-foreground text-3xl italic tracking-tighter">{selectedVehicle?.capacity || 6} Explorers</span>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-[10px] uppercase font-black text-primary tracking-[0.4em] mb-2">{t("specs")}</h4>
                       <div className="grid grid-cols-1 gap-4">
                         {local.features?.map((feature, i) => (
                           <motion.div 
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: 0.6 + i * 0.1 }}
                             key={i} 
                             className="flex items-center gap-5 bg-foreground/5 p-5 rounded-[1.5rem] border border-foreground/5"
                           >
                             <Zap className="w-5 h-5 text-primary" />
                             <span className="text-foreground font-bold tracking-tight">{feature}</span>
                           </motion.div>
                         ))}
                       </div>
                    </div>
                 </motion.div>
               );
             })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
