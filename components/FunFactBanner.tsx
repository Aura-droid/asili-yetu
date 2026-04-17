"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { BookOpen, Sparkles } from "lucide-react";

export default function FunFactBanner() {
  const t = useTranslations("FunFact");
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.3, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  const [isMounted, setIsMounted] = useState(false);
  const [currentSelection, setCurrentSelection] = useState({ fact: "", image: "/destinations/tarangire-1.jpg" });

  useEffect(() => {
    setIsMounted(true);
    
    // Character-perfect randomizer
    try {
      const facts = t.raw("facts") as string[];
      const images = [
        "/destinations/ngorongoro-1.jpg", // Ngorongoro
        "/destinations/tarangire-2.jpg",   // Migration (approx)
        "/destinations/tarangire-1.jpg",   // Elephant
        "/destinations/kilimanjaro-1.jpg", // Kilimanjaro
        "/destinations/tarangire-2.jpg"    // Baobab
      ];

      const randomIndex = Math.floor(Math.random() * facts.length);
      setCurrentSelection({
        fact: facts[randomIndex],
        image: images[randomIndex] || images[0]
      });
    } catch (e) {
      console.error("FunFact Registry Failure", e);
    }
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[60vh] min-h-[500px] overflow-hidden flex items-center justify-center my-24 shadow-2xl">
      {/* Deep parallax background */}
      <motion.img 
        style={{ y }}
        src={currentSelection.image} 
        alt="African Safari Background"
        className="absolute inset-0 w-full h-[140%] object-cover -top-[20%] z-0 grayscale-[30%]"
      />
      
      {/* Heavy vignette overlays to make text readable */}
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 z-0" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        <motion.div 
           initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
           whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
           viewport={{ once: true }}
           transition={{ type: "spring", stiffness: 200, damping: 20 }}
           className="w-16 h-16 rounded-3xl bg-primary/20 backdrop-blur-md flex items-center justify-center mb-6 border border-primary/30 shadow-[0_0_30px_rgba(250,204,21,0.2)]"
        >
          <BookOpen className="w-8 h-8 text-primary" />
        </motion.div>
        
        <h3 className="text-xs md:text-sm font-black text-primary uppercase tracking-[0.4em] mb-6 flex items-center justify-center gap-2 drop-shadow-md">
          <Sparkles className="w-4 h-4" /> {t("label")}
        </h3>
        
        <motion.p 
          style={{ opacity, scale }}
          className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-[1.3] drop-shadow-2xl"
        >
          {currentSelection.fact || t("facts.0")}
        </motion.p>
      </div>
    </section>
  );
}
