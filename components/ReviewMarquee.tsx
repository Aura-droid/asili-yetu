"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { getReviews } from "@/app/actions/reviews";
import { Star, Quote } from "lucide-react";
import { useTranslations } from "next-intl";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function ReviewMarquee() {
  const t = useTranslations("Reviews");
  const [reviews, setReviews] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isSubscribed = true;

    async function fetchReviews() {
      const { data } = await getReviews();
      if (!isSubscribed) return;
      
      if (data && data.length > 0) {
        setReviews([...data, ...data]);
      } else {
        setReviews([]);
      }
    }

    fetchReviews();
    return () => { isSubscribed = false; };
  }, []);

  const controls = useAnimationControls();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reviews.length === 0) return;
    const itemsCount = reviews.length / 2;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % itemsCount);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  useEffect(() => {
    if (reviews.length === 0) return;
    const itemsCount = reviews.length / 2;
    
    // Snap logic for infinite loop
    if (index === 0) {
      // If we just wrapped around, we might want to snap, but let's see how simple works
    }

    controls.start({
      x: -(index * 432),
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    });
  }, [index, reviews.length, controls]);

  if (!mounted || reviews.length === 0) return null;

  return (
    <div className="py-24 bg-foreground/5 overflow-hidden border-y border-foreground/5 relative">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex items-center justify-between">
         <div>
            <h2 className="text-3xl font-black text-foreground tracking-tighter italic uppercase">Voices from the <span className="text-primary italic">Wild</span></h2>
            <p className="text-foreground/50 text-sm font-medium">Stories of transformation from our global explorers.</p>
         </div>
         <div className="hidden md:flex items-center gap-2 text-primary">
            <Star className="w-5 h-5 fill-primary" />
            <span className="font-black text-xl">4.9/5</span>
         </div>
      </div>

      <div className="relative flex">
        <motion.div
          animate={controls}
          className="flex gap-8 px-4"
        >
          {reviews.map((review, i) => (
            <div 
              key={i} 
              className="w-[400px] flex-shrink-0 bg-white p-10 rounded-[2.5rem] border border-foreground/10 shadow-sm relative group hover:shadow-xl transition-all duration-500"
            >
              <Quote className="absolute top-8 right-10 w-12 h-12 text-foreground/5 opacity-20 group-hover:text-primary/20 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < (review.rating || 5) ? 'text-primary fill-primary' : 'text-foreground/10'}`} />
                ))}
              </div>

              <p className="text-slate-700 text-lg font-medium leading-relaxed mb-8 italic">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-4 border-t border-foreground/5 pt-6">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary text-xs tracking-tighter">
                     {review.source === 'instagram' ? <InstagramIcon className="w-5 h-5" /> : (review.user_name || "AT").split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-900">{review.source === 'instagram' ? `@${review.user_name}` : review.user_name}</h4>
                     <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                       {review.source === 'instagram' ? (
                         <span className="text-[#E1306C] flex items-center gap-1">{t("ig_label")}</span>
                       ) : t("verified_label")}
                     </p>
                  </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Side Fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
    </div>
  );
}
