"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Quote, Eye } from "lucide-react";

export default function ClientCultureView({ stories = [] }: { stories?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!stories || stories.length === 0) return null;

  return (
    <div ref={containerRef} className="py-24 space-y-48">
       {stories.map((story, index) => (
          <div key={story.id} className="container mx-auto max-w-7xl px-6">
             <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
                <div className="w-full lg:w-1/2 relative group">
                   <div 
                      className="absolute inset-0 rounded-[3rem] translate-y-4 shadow-2xl blur-2xl opacity-10"
                      style={{ background: story.accent_color || '#a3cc4c' }}
                   />
                   <motion.div 
                      whileInView={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 100 }}
                      className="rounded-[3rem] overflow-hidden shadow-2xl h-[600px] relative border border-foreground/5"
                   >
                      <img src={story.image_url} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" alt={story.title} />
                   </motion.div>
                </div>

                <div className="flex-1">
                   <div 
                      className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block px-4 py-1.5 rounded-full"
                      style={{ background: `${story.accent_color}20`, color: story.accent_color }}
                   >
                      {story.category}
                   </div>
                    <h3 className="text-4xl md:text-5xl font-black text-foreground italic uppercase tracking-tighter mb-6 leading-[0.9]">
                      {story.title?.split(/<br\s*\/?>/i).map((part: string, i: number, arr: any[]) => (
                        <React.Fragment key={i}>
                          {part}
                          {i < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </h3>
                   <p className="text-lg md:text-xl font-medium text-foreground/60 leading-relaxed mb-8">
                      {story.description}
                   </p>
                   <button 
                      className="flex items-center gap-3 group font-black uppercase tracking-[0.2em] text-[10px]"
                      style={{ color: story.accent_color }}
                   >
                      <div 
                         className="w-12 h-12 rounded-full border flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all"
                         style={{ borderColor: story.accent_color }}
                      >
                         <Star className="w-5 h-5" />
                      </div>
                      Explore Narrative
                   </button>
                </div>
             </div>
          </div>
       ))}
    </div>
  );
}
