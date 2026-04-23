"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedDestinations({ destinations }: { destinations: any[] }) {
  const [index, setIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  if (!destinations || destinations.length === 0) return null;

  // Auto-slide logic
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % destinations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [destinations.length]);

  React.useEffect(() => {
    if (containerRef.current) {
      const scrollAmount = index * (containerRef.current.offsetWidth / (typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 2));
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [index]);

  return (
    <section className="py-24 bg-background overflow-hidden border-t border-foreground/5">
      <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-4 block">Destinations Atlas</span>
          <h2 className="text-4xl md:text-6xl font-black text-foreground italic uppercase tracking-tighter leading-none">Elite <span className="text-amber-500 italic">Territories</span></h2>
        </div>
        <div className="flex gap-2">
           {destinations.map((_, i) => (
             <div 
               key={i} 
               className={`h-1 transition-all duration-500 rounded-full ${index === i ? 'w-8 bg-amber-500' : 'w-2 bg-foreground/10'}`} 
             />
           ))}
        </div>
      </div>

      <div className="relative">
        <div 
          ref={containerRef}
          className="flex gap-8 px-6 overflow-x-hidden pb-12 hide-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {destinations.map((dest, idx) => (
            <motion.div 
              key={dest.id}
              className="min-w-full md:min-w-[calc(50%-1rem)] aspect-[16/10] relative rounded-[3rem] overflow-hidden group snap-center border border-foreground/5 shadow-2xl"
            >
              <Image 
                src={dest.image_url || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"}
                alt={dest.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-6 right-6">
                 <div className="bg-amber-500/20 backdrop-blur-md border border-amber-500/30 p-2 rounded-full">
                    <MapPin className="w-4 h-4 text-amber-500" />
                 </div>
              </div>

              <div className="absolute inset-x-8 bottom-8">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 block">{dest.type}</span>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">{dest.name}</h3>
                <Link href="/destinations" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-amber-500 transition-colors">
                   Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
