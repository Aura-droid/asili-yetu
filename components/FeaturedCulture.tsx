"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedCulture({ stories }: { stories: any[] }) {
  const [index, setIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  if (!stories || stories.length === 0) return null;

  // Auto-slide logic
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % stories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [stories.length]);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: index * containerRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  }, [index]);

  return (
    <section className="py-24 bg-foreground rounded-[4rem] mx-4 md:mx-12 overflow-hidden text-background border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
           <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Cultural Masterpieces</span>
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
                 The Soul of <br/> <span className="text-primary italic">Heritage</span>
              </h2>
           </div>
           <div className="flex gap-2">
              {stories.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 transition-all duration-1000 rounded-full ${index === i ? 'w-16 bg-primary' : 'w-2 bg-white/10'}`} 
                />
              ))}
           </div>
        </div>

        <div 
          ref={containerRef}
          className="flex overflow-x-hidden snap-x snap-mandatory hide-scrollbar scroll-smooth"
        >
          {stories.map((story, idx) => (
            <motion.div 
              key={story.id} 
              className="min-w-full snap-center grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
               <div className="w-full h-[500px] rounded-[3.5rem] overflow-hidden relative border border-white/10 flex-shrink-0 group">
                  <Image 
                    src={story.image_url} 
                    alt={story.title} 
                    fill 
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-2" 
                    style={{ background: story.accent_color }}
                  />
                  <div className="absolute top-10 left-10">
                     <span className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                        Heritage Piece #{idx + 1}
                     </span>
                  </div>
               </div>
               
               <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                     <ShieldCheck className="w-6 h-6 text-primary" />
                     <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">{story.category}</span>
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                    {story.title}
                  </h3>
                  <p className="text-background/40 text-xl font-medium italic leading-relaxed mb-12 border-l-2 border-primary/30 pl-8">
                    "{story.description}"
                  </p>
                  <Link href="/culture" className="inline-flex items-center gap-4 text-sm font-black uppercase tracking-[0.3em] text-white hover:text-primary transition-all group">
                     Archives <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
