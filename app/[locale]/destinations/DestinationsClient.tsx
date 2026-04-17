"use client";

import { motion } from "framer-motion";
import { MapPin, Sun, Compass, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import SafariMap from "@/components/SafariMap";

export default function DestinationsClient({ destinations }: { destinations: any[] }) {
  const t = useTranslations("Destinations");

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 selection:bg-primary selection:text-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="max-w-4xl text-center mx-auto mb-20 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 text-primary font-bold tracking-widest uppercase text-sm mb-6"
          >
            <Compass className="w-5 h-5" /> {t("badge")}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[1.1] mb-8"
          >
            {t.rich("title", {
              p: (chunks) => <span className="text-foreground/50 italic font-serif">{chunks}</span>
            })}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-foreground/70 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            {t("sub")}
          </motion.p>
        </div>

        {/* Cinematic Map Discovery */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-32"
        >
           <SafariMap destinations={destinations} />
        </motion.div>

        {/* The Destinations */}
        <div className="space-y-12 md:space-y-24">
          {destinations.map((dest, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div 
                key={dest.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative group">
                   <div className="absolute inset-0 bg-primary/20 bg-blend-overlay rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border border-foreground/10 shadow-2xl">
                     <Image 
                        src={dest.image_url || dest.image || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"}
                        alt={dest.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                     <div className="absolute bottom-8 left-8 text-white">
                        <span className="bg-primary text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                          {dest.type}
                        </span>
                     </div>
                   </div>
                </div>

                {/* Text Side */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                   <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">{dest.name}</h2>
                   <p className="text-foreground/70 text-lg leading-relaxed mb-8 font-medium">
                     {dest.description}
                   </p>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                      <div className="bg-foreground/5 p-5 rounded-2xl border border-foreground/10">
                         <div className="flex items-center gap-3 text-primary mb-2">
                           <Sun className="w-5 h-5" /> <span className="font-bold text-xs uppercase tracking-widest text-foreground/50">Best Time</span>
                         </div>
                         <p className="text-foreground font-semibold">{dest.best_time || dest.bestTime}</p>
                      </div>
                      <div className="bg-foreground/5 p-5 rounded-2xl border border-foreground/10">
                         <div className="flex items-center gap-3 text-primary mb-2">
                           <Compass className="w-5 h-5" /> <span className="font-bold text-xs uppercase tracking-widest text-foreground/50">{t("wildlife")}</span>
                         </div>
                         <p className="text-foreground font-semibold">{dest.key_wildlife || dest.keyWildlife}</p>
                      </div>
                      <div className="bg-foreground/5 p-5 rounded-2xl border border-foreground/10 sm:col-span-2">
                         <div className="flex items-center gap-3 text-primary mb-2">
                           <MapPin className="w-5 h-5" /> <span className="font-bold text-xs uppercase tracking-widest text-foreground/50">{t("scale")}</span>
                         </div>
                         <p className="text-foreground font-semibold">{dest.size}</p>
                      </div>
                   </div>

                   <div>
                     <Link 
                       href={`/packages?destination=${dest.id}`}
                       className="inline-flex items-center gap-3 text-foreground font-bold hover:text-primary transition-colors group"
                     >
                       {t("view")} 
                       <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                     </Link>
                   </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
