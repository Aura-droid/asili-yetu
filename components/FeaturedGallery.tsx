"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, Camera, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedGallery({ items }: { items: any[] }) {
  const [index, setIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  if (!items || items.length === 0) return null;

  // Auto-slide logic
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  React.useEffect(() => {
    if (containerRef.current) {
      const scrollAmount = index * (containerRef.current.offsetWidth / (typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3));
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [index, items.length]);

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 text-center mb-20">
         <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-6">
            <Compass className="w-4 h-4" /> Visual Masterpieces
         </span>
         <h2 className="text-6xl md:text-8xl font-black text-foreground italic uppercase tracking-tighter leading-[0.8] mb-8">
            Caught in <br/> <span className="text-amber-500 italic">Infinity</span>
         </h2>
         <div className="flex gap-2 justify-center mb-12">
            {items.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 transition-all duration-700 rounded-full ${index === i ? 'w-12 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'w-2 bg-foreground/10'}`} 
              />
            ))}
         </div>
      </div>

      <div 
        ref={containerRef}
        className="flex gap-4 px-6 overflow-x-hidden hide-scrollbar pb-20 snap-x snap-mandatory scroll-smooth"
      >
         {items.map((item, idx) => (
           <motion.div 
             key={item.id}
             className="min-w-full md:min-w-[calc(33.333%-1rem)] h-[500px] relative rounded-[4rem] overflow-hidden group shadow-2xl snap-center"
           >
              <div className="absolute top-8 left-8 z-20">
                 <div className="bg-amber-500/20 backdrop-blur-md border border-amber-500/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span className="text-[8px] font-black uppercase text-amber-500 tracking-widest">Masterpiece Selection</span>
                 </div>
              </div>

              <Image 
                src={item.url} 
                alt={item.caption || "Gallery Masterpiece"} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute inset-x-8 bottom-8 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                 <p className="text-white text-xs font-bold italic leading-relaxed line-clamp-3 mb-6">
                    {item.caption || "A moment of pure immersion in the heart of the wild."}
                 </p>
                 <Link href="/gallery" className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5" />
                 </Link>
              </div>
           </motion.div>
         ))}
      </div>
    </section>
  );
}
