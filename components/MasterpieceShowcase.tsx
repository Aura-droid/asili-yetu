"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowUpRight, Compass, ShieldCheck, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MasterpieceShowcaseProps {
  destinations: any[];
  stories: any[];
  gallery: any[];
}

export default function MasterpieceShowcase({ destinations, stories, gallery }: MasterpieceShowcaseProps) {
  const allMasterpieces = [
    ...destinations.map(d => ({ ...d, type: 'destination', link: '/destinations' })),
    ...stories.map(s => ({ ...s, type: 'culture', link: '/culture' })),
    ...gallery.map(g => ({ ...g, type: 'gallery', link: '/gallery' }))
  ];

  if (allMasterpieces.length === 0) return null;

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
           <div className="max-w-2xl">
              <span className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.5em] mb-6">
                <Star className="w-4 h-4 fill-primary" /> Curated Collection
              </span>
              <h2 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.85]">
                The <span className="text-primary italic">Masterpiece</span> <br/> Collection
              </h2>
           </div>
           <p className="text-white/40 text-sm font-medium max-w-sm border-l border-white/10 pl-8 leading-relaxed italic">
             A handpicked selection of Tanzania's most profound experiences, from hidden sanctuary peaks to ancestral stories etched in time.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {allMasterpieces.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="group relative"
              >
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 hover:border-primary/50">
                  <Image 
                    src={item.image_url || item.url || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"}
                    alt={item.name || item.title || "Masterpiece"}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-8 left-8">
                    <div className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2">
                       {item.type === 'destination' && <MapPin className="w-3 h-3 text-primary" />}
                       {item.type === 'culture' && <ShieldCheck className="w-3 h-3 text-primary" />}
                       {item.type === 'gallery' && <Compass className="w-3 h-3 text-primary" />}
                       <span className="text-[9px] font-black uppercase tracking-widest text-white/80">{item.type}</span>
                    </div>
                  </div>

                  <div className="absolute inset-x-8 bottom-8">
                    <h3 className="text-3xl font-black text-white italic tracking-tighter mb-4 leading-tight uppercase">
                      {item.name || item.title || item.caption}
                    </h3>
                    <div className="flex items-center justify-between">
                       <Link 
                        href={item.link}
                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors"
                       >
                         Explore Journey <ArrowUpRight className="w-4 h-4" />
                       </Link>
                       <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-500">
                          <Star className="w-4 h-4" />
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative Gradient Strip */}
      <div className="mt-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
}
