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
      color: "from-primary/80 to-transparent",
      img: "/others/toyota-land-cruiser.jpg"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: t("responsible_title"),
      desc: t("responsible_desc"),
      color: "from-emerald-600/80 to-transparent",
      img: "/images/Gallery/Wildebeasts.jpeg"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t("community_title"),
      desc: t("community_desc"),
      color: "from-blue-600/80 to-transparent",
      img: "/images/Gallery/Zanzibar.jpeg"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: t("authentic_title"),
      desc: t("authentic_desc"),
      color: "from-purple-600/80 to-transparent",
      img: "/images/Gallery/Lion.jpeg"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t("professional_title"),
      desc: t("professional_desc"),
      color: "from-rose-600/80 to-transparent",
      img: "/images/Gallery/Twiga.jpeg"
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
            {t("advantage")}
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
              whileHover={{ y: -10, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-[450px] rounded-[3rem] overflow-hidden border border-foreground/5 shadow-2xl bg-black"
            >
              {/* Cinematic Background */}
              <div className="absolute inset-0 z-0">
                 <img 
                   src={feature.img} 
                   alt={feature.title} 
                   className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-110" 
                 />
                 <div className={`absolute inset-0 bg-linear-to-b ${feature.color} opacity-30 group-hover:opacity-50 transition-opacity`} />
              </div>

              {/* Tribal Pattern Border */}
              <div className="absolute bottom-0 left-0 right-0 h-3 opacity-30 group-hover:opacity-70 transition-opacity flex">
                 {Array.from({ length: 30 }).map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`flex-1 h-full ${idx % 2 === 0 ? 'bg-primary' : 'bg-white'} ${idx % 3 === 0 ? 'scale-y-150' : 'scale-y-100'} transition-transform duration-500`} 
                    />
                 ))}
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end z-10">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/20 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-xl">
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic drop-shadow-lg leading-none">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed font-bold text-lg drop-shadow-md">{feature.desc}</p>
              </div>

              {/* Interaction Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none bg-primary/5 blur-[80px]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
