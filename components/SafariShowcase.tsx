"use client";

import React from "react";
import { motion, useAnimationControls } from "framer-motion";
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

  const controls = useAnimationControls();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
       setIndex(0);
       return;
    }
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % highlightItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [highlightItems.length]);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      controls.set({ x: 0 });
      return;
    }
    // We move by the width of one card + gap. 
    // On mobile we'll assume a consistent width for items.
    controls.start({ 
      x: `calc(-${index * 100}% - ${index * 2}rem)`,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    });
  }, [index, controls]);

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

        {/* Discovery Grid - Marquee on Mobile, Grid on Desktop */}
        <div className="relative overflow-hidden md:overflow-visible -mx-6 px-6 md:mx-0 md:px-0">
          <motion.div 
            animate={controls}
            className="flex md:grid md:grid-cols-3 gap-8 md:gap-8 w-full"
          >
            {highlightItems.map((item, i) => (
              <Link 
                href={item.link} 
                key={i}
                className="group relative h-[500px] w-full shrink-0 md:shrink md:w-auto rounded-[3rem] overflow-hidden border border-foreground/5 shadow-sm hover:shadow-2xl transition-all duration-700 active:scale-95"
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
          </motion.div>
        </div>
        
        {/* Animated Marquee Strip Overlay */}
        <div className="mt-20 py-8 border-y border-foreground/5 flex overflow-hidden group/marquee">
            <motion.div 
              animate={{ x: [0, -300, -300, -600, -600, -900, -900, -1200] }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "easeInOut",
                times: [0, 0.1, 0.25, 0.35, 0.5, 0.6, 0.75, 1] 
              }}
              className="flex gap-24 whitespace-nowrap text-foreground/[0.08] font-black text-8xl italic uppercase select-none transition-colors duration-1000 group-hover/marquee:text-primary/[0.15]"
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
