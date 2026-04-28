"use client";

import React from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Binoculars, Languages, Award, Map as MapIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

import { useLocale, useTranslations } from "next-intl";

export default function GuidesRoster({ guides }: { guides: any[] }) {
  const locale = useLocale();
  const t = useTranslations("Guides");

  const getLocalizedGuide = (g: any) => {
    if (!g.translations?.[locale]) return { role: g.role, specialty: g.specialty, bio: g.bio };
    const raw = g.translations[locale];
    // Payload: "Role: [ROLE]. Specialty: [SPECIALTY]. Bio: [BIO]"
    const roleMatch = raw.match(/Role:\s*(.*?)\.\s*Specialty:/);
    const specMatch = raw.match(/Specialty:\s*(.*?)\.\s*Bio:/);
    const bioMatch = raw.match(/Bio:\s*(.*)/);

    return {
      role: roleMatch ? roleMatch[1] : g.role,
      specialty: specMatch ? specMatch[1] : g.specialty,
      bio: bioMatch ? bioMatch[1] : g.bio
    };
  };

  const controls = useAnimationControls();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % (guides.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [guides.length]);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      controls.set({ x: 0 });
      return;
    }
    controls.start({ 
      x: `calc(-${index * 100}% - ${index * 2}rem)`,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    });
  }, [index, controls]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 selection:bg-primary selection:text-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-primary font-bold tracking-widest uppercase text-sm mb-6"
          >
            <Binoculars className="w-5 h-5" /> {t("badge")}
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
            className="text-xl text-foreground/70 font-medium leading-relaxed"
          >
            {t("sub")}
          </motion.p>
        </div>

        {/* Guides Grid - Marquee on Mobile, Grid on Desktop */}
        <div className="relative md:overflow-visible -mx-6 px-6 md:mx-0 md:px-0">
          <div className="overflow-hidden md:overflow-visible">
            <motion.div 
              animate={controls}
              drag="x"
              dragConstraints={{ right: 0, left: -(guides.length - 1) * 350 }} // Approximation for drag
              onDragEnd={(_, info) => {
                if (info.offset.x < -50 && index < guides.length - 1) setIndex(index + 1);
                if (info.offset.x > 50 && index > 0) setIndex(index - 1);
              }}
              className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 w-full touch-pan-y"
            >
              {guides.map((guide) => {
                const local = getLocalizedGuide(guide);
                return (
                  <motion.div 
                    key={guide.id} 
                    variants={itemVariants}
                    className="group relative bg-foreground/5 rounded-[2rem] overflow-hidden border border-foreground/10 hover:border-primary/50 transition-colors duration-500 flex flex-col w-full shrink-0 md:shrink md:w-auto"
                  >
                    {/* Image Header */}
                    <div className="relative w-full aspect-[4/5] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                      <Image 
                        src={guide.image_url || guide.image || "/brand/asili-yetu-brand.jpg"} 
                        alt={guide.name} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
                      />
                      
                      {/* Overlay Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
                        <p className="text-primary font-black uppercase tracking-widest text-xs mb-2">{local.role || t("active_guide")}</p>
                        <h3 className="text-3xl font-black">{guide.name}</h3>
                      </div>
                    </div>
  
                    {/* Body Details */}
                    <div className="p-8 flex-1 flex flex-col">
                      <p className="text-foreground/70 mb-8 leading-relaxed font-medium line-clamp-4">
                        {local.bio}
                      </p>
  
                      <div className="space-y-4 mt-auto">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-foreground shrink-0 border border-foreground/5">
                            <Award className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">{t("experience_label")}</p>
                            <p className="font-bold text-foreground">{t("years_in_field", { years: guide.experience_years || 0 })}</p>
                          </div>
                        </div>
  
                        <div className="flex items-center gap-4 text-sm">
                          <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-foreground shrink-0 border border-foreground/5">
                            <MapIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">{t("specialty_label")}</p>
                            <p className="font-bold text-foreground">{local.specialty || 'General Safari Expert'}</p>
                          </div>
                        </div>
  
                        <div className="flex items-center gap-4 text-sm pb-2">
                          <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-foreground shrink-0 border border-foreground/5">
                            <Languages className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">{t("languages_label")}</p>
                            <p className="font-bold text-foreground truncate max-w-[150px]">
                              {Array.isArray(guide.languages) ? guide.languages.join(", ") : (guide.languages || 'English, Swahili')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Marquee Indicators (Mobile Only) */}
          <div className="flex md:hidden justify-center gap-2 mt-8">
            {guides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 transition-all duration-500 rounded-full ${i === index ? 'w-8 bg-primary' : 'w-2 bg-foreground/10'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 max-w-4xl mx-auto bg-primary rounded-3xl p-12 md:p-16 text-center text-black relative overflow-hidden shadow-2xl shadow-primary/20"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 blur-3xl rounded-full pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 relative z-10">
            {t("cta_title")}
          </h2>
          <p className="text-black/70 font-medium text-lg mb-10 max-w-xl mx-auto relative z-10">
            {t("cta_sub")}
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-3 bg-black text-white px-8 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all outline-none border border-black/10 relative z-10 shadow-xl"
          >
            {t("cta_btn")} <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
