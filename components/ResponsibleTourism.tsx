"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, Recycle, Heart, Globe, Footprints } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ResponsibleTourism() {
  const t = useTranslations("ResponsibleTourism");

  const commitments = [
    { icon: <Leaf className="w-5 h-5" />, label: t("env") },
    { icon: <Recycle className="w-5 h-5" />, label: t("waste") },
    { icon: <Globe className="w-5 h-5" />, label: t("economy") },
    { icon: <Heart className="w-5 h-5" />, label: t("wildlife") },
    { icon: <Footprints className="w-5 h-5" />, label: t("ethical") },
  ];

  return (
    <section className="py-24 bg-foreground text-background rounded-[3rem] mx-6 md:mx-12 my-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[120px] -ml-48 -mb-48" />

      <div className="container mx-auto px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block"
            >
              Our Ethical Promise
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-8"
            >
              {t("title")}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-background/60 text-xl font-medium leading-relaxed mb-12"
            >
              {t("sub")}
            </motion.p>

            <div className="space-y-4">
              <h4 className="text-primary font-black uppercase tracking-widest text-xs mb-6">{t("commitments_title")}</h4>
              <div className="flex flex-wrap gap-4">
                {commitments.map((c, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 bg-background/5 border border-background/10 px-6 py-4 rounded-full"
                  >
                    <span className="text-primary">{c.icon}</span>
                    <span className="font-bold text-sm tracking-tight">{c.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-primary/5 p-12 rounded-[3rem] border border-background/5 text-center relative group"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <h3 className="text-5xl md:text-8xl font-black text-primary mb-6 italic tracking-tighter">100%</h3>
            <p className="text-2xl font-bold mb-8 uppercase tracking-widest leading-tight">{t("impact")}</p>
            <div className="w-16 h-1 bg-primary mx-auto" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
