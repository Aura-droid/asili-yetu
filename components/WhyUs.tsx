"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Leaf, Users, Award, Star } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WhyUs() {
  const t = useTranslations("WhyUs");

  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: t("quality_title"),
      desc: t("quality_desc"),
      color: "bg-primary"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: t("responsible_title"),
      desc: t("responsible_desc"),
      color: "bg-emerald-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t("community_title"),
      desc: t("community_desc"),
      color: "bg-blue-500"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: t("authentic_title"),
      desc: t("authentic_desc"),
      color: "bg-purple-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t("professional_title"),
      desc: t("professional_desc"),
      color: "bg-rose-500"
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block"
          >
            The Asili Advantage
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-foreground italic uppercase tracking-tighter leading-none mb-6"
          >
            {t("title")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/60 text-lg md:text-xl font-medium max-w-2xl"
          >
            {t("sub")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2.5rem] bg-foreground/5 border border-foreground/5 hover:border-primary/30 transition-all duration-500 group"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tight italic">{feature.title}</h3>
              <p className="text-foreground/50 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
