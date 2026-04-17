"use client";

import React from "react";
import { motion } from "framer-motion";
import { Car, Users, Map, ArrowRight, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function SafariShowcase() {
  const t = useTranslations("Ecosystem");

  const highlightItems = [
    {
      title: t("fleet_title"),
      sub: t("fleet_sub"),
      icon: <Car className="w-6 h-6" />,
      link: "/fleet",
      color: "from-purple-500/20 to-blue-500/20",
      image: "/others/toyota-land-cruiser.jpg"
    },
    {
      title: t("guides_title"),
      sub: t("guides_sub"),
      icon: <Users className="w-6 h-6" />,
      link: "/guides",
      color: "from-orange-500/20 to-red-500/20",
      image: "/destinations/kilimanjaro-1.jpg"
    },
    {
      title: t("destinations_title"),
      status: t("destinations_sub"),
      icon: <Map className="w-6 h-6" />,
      link: "/destinations",
      color: "from-green-500/20 to-emerald-500/20",
      image: "/destinations/ngorongoro-1.jpg"
    }
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
           <div className="max-w-xl">
             <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-4">
                <Zap className="w-4 h-4" /> {t("badge")}
             </div>
             <h2 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-[0.9] italic uppercase">
                {t.rich("title_main", {
                  p: (chunks) => <span className="text-primary italic">{chunks}</span>,
                  br: () => <br />
                })}
             </h2>
           </div>
           <p className="text-foreground/50 font-medium max-w-sm">
             {t("sub_main")}
           </p>
        </div>

        {/* Discovery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlightItems.map((item, i) => (
            <Link 
              href={item.link} 
              key={i}
              className="group relative h-[500px] rounded-[3rem] overflow-hidden border border-foreground/5 shadow-sm hover:shadow-2xl transition-all duration-700 active:scale-95"
            >
              <Image 
                src={item.image} 
                alt={item.title} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0 opacity-80"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} mix-blend-overlay`} />
              <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-black/40 to-transparent">
                 <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-primary mb-6 transform -rotate-12 group-hover:rotate-0 transition-transform">
                    {item.icon}
                 </div>
                 <h3 className="text-3xl font-black text-white italic tracking-tighter mb-2">{item.title}</h3>
                 <p className="text-white/60 font-medium text-sm flex items-center gap-2">
                    {item.sub || item.status} <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
                 </p>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 border-[6px] border-primary/0 group-hover:border-primary/20 rounded-[3rem] transition-all pointer-events-none" />
            </Link>
          ))}
        </div>
        
        {/* Animated Marquee Strip Overlay */}
        <div className="mt-20 py-8 border-y border-foreground/5 flex overflow-hidden group/marquee">
           <motion.div 
             animate={{ x: [0, -1000] }}
             transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
             className="flex gap-24 whitespace-nowrap text-foreground/[0.15] font-black text-8xl italic uppercase select-none transition-colors duration-1000 group-hover/marquee:text-primary/[0.2]"
           >
              <span>{t("marquee.fleet")}</span>
              <span>•</span>
              <span>{t("marquee.rangers")}</span>
              <span>•</span>
              <span>{t("marquee.lands")}</span>
              <span>•</span>
              <span>{t("marquee.discovery")}</span>
              <span>•</span>
              <span>{t("marquee.fleet")}</span>
              <span>•</span>
              <span>{t("marquee.rangers")}</span>
           </motion.div>
        </div>
      </div>
    </section>
  );
}
