"use client";

import { motion } from "framer-motion";
import { TreePine, Diamond, ShieldCheck, HeartHandshake } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getAboutContent } from "@/app/actions/content";
import { useParams } from "next/navigation";

export default function AboutPage() {
  const t = useTranslations("About");
  const params = useParams();
  const locale = params.locale as string;
  const [dbContent, setDbContent] = useState<any>(null);
  const [heroSrc, setHeroSrc] = useState<string | null>(null);
  const [legacySrc, setLegacySrc] = useState<string | null>(null);

  useEffect(() => {
    getAboutContent().then(res => {
      console.log("About Content Fetched:", res);
      setDbContent(res);
      if (res?.hero_image) setHeroSrc(res.hero_image);
      if (res?.legacy_image) setLegacySrc(res.legacy_image);
    }).catch(err => {
      console.error("About Content Fetch Error:", err);
    });
  }, []);

  // Merging Logic: Database data with Fallback to Translations
  const content = dbContent || {};
  const localized = content[locale] || {};

  const defaultHero = "/hero/ngorongoro-hero.jpg";
  const defaultLegacy = "https://images.unsplash.com/photo-1616527027589-91307b2ab138?auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-black">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroSrc || defaultHero}
            alt="Tanzanian Heritage"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-background" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mt-32">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-6 [text-shadow:0_10px_30px_rgb(0_0_0/40%)]"
          >
            {t.rich("title", {
              p: (chunks) => <span className="text-primary italic font-serif">{chunks}</span>
            })}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-3xl text-white font-bold leading-relaxed [text-shadow:0_5px_15px_rgb(0_0_0/40%)] max-w-3xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
        </div>
      </div>

      {/* New Content Sections */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 space-y-32">
        {/* Who We Are & Origin */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 text-primary font-bold tracking-widest uppercase text-sm border border-primary/30 px-4 py-1.5 rounded-full bg-primary/5">
              <TreePine className="w-4 h-4" /> {t("legacy_badge")}
            </div>
            <p className="text-lg md:text-xl font-bold text-foreground/80 leading-relaxed">
              {t("who_we_are")}
            </p>
            <p className="text-foreground/70 text-xl leading-relaxed font-medium">
              {t("origin")}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-4/5 rounded-[3rem] overflow-hidden border border-foreground/5 shadow-2xl"
          >
            <Image 
              src={content.story_image_1 || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"}
              alt="Tanzania Wild"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Name Meaning & Roots */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 relative aspect-video rounded-[3rem] overflow-hidden border border-foreground/5 shadow-2xl"
          >
            <Image 
              src={content.story_image_2 || "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&q=80"}
              alt="Roots"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 space-y-8"
          >
            <p className="text-lg md:text-xl font-bold text-foreground/80 leading-relaxed">
              {t("name_meaning")}
            </p>
            <p className="text-foreground/70 text-lg leading-relaxed font-medium">
              {t("specialization")}
            </p>
            <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10 italic text-foreground/80 text-lg">
              "{t("storytellers")}"
            </div>
          </motion.div>
        </div>

        {/* Responsibility */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-foreground text-background p-16 md:p-24 rounded-[4rem] text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
             <Image 
               src={legacySrc || defaultLegacy}
               alt="Legacy Background"
               fill
               className="object-cover opacity-20 grayscale"
               unoptimized
             />
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] -mr-48 -mt-48" />
          <p className="text-lg md:text-xl font-bold text-background/90 leading-relaxed max-w-3xl mx-auto italic relative z-10">
            {t("responsibility")}
          </p>
          <div className="w-20 h-1 bg-primary mx-auto relative z-10" />
        </motion.div>
      </div>

      {/* Leadership Message Section - 100% DB driven */}
      {(content.leader_message_paragraphs?.length > 0 || content.en?.leader_message?.length > 0 || content.leader_name) && (
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-32 bg-primary/5 rounded-[4rem] my-24 border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[120px] -ml-48 -mb-48" />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12 text-center relative z-10"
          >
            {/* Leader photo if provided */}
            {content.leader_photo && (
              <div className="flex justify-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl">
                  <img src={content.leader_photo} alt={content.leader_name || "Leadership"} className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Message paragraphs */}
            <div className="max-w-3xl mx-auto space-y-8 text-foreground/70 text-xl md:text-2xl leading-relaxed italic font-medium">
              {(localized.leader_message || []).map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Leader name & role - only shown if filled in */}
            {(content.leader_name || content.leader_role) && (
              <div className="pt-8 flex flex-col items-center gap-2">
                <div className="w-24 h-1 bg-primary mb-4" />
                {content.leader_name && (
                  <p className="text-2xl font-black text-foreground tracking-tight">{content.leader_name}</p>
                )}
                {content.leader_role && (
                  <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">{content.leader_role}</p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Philosophy & Presence (Remaining) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
           <div className="p-12 rounded-[3rem] bg-foreground text-background shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                 <Image 
                   src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80" 
                   alt="Mission" 
                   fill 
                   className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-1000" 
                 />
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32 group-hover:bg-primary/40 transition-colors" />
              <div className="relative z-10">
                <h3 className="text-4xl font-black mb-6 flex items-center gap-4 text-primary italic uppercase tracking-tighter">
                   <div className="w-2 h-10 bg-primary" /> {t("mission_title")}
                </h3>
                <p className="text-2xl leading-relaxed opacity-90 font-medium drop-shadow-md">{t("mission_desc")}</p>
              </div>
           </div>

           <div className="p-12 rounded-[3rem] bg-background border border-foreground/10 shadow-lg relative overflow-hidden group min-h-[400px] flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                 <Image 
                   src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80" 
                   alt="Vision" 
                   fill 
                   className="object-cover opacity-5 group-hover:opacity-10 transition-opacity duration-1000" 
                 />
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32 group-hover:bg-primary/20 transition-colors" />
              <div className="relative z-10">
                <h3 className="text-4xl font-black mb-6 flex items-center gap-4 text-primary italic uppercase tracking-tighter">
                   <div className="w-2 h-10 bg-primary" /> {t("vision_title")}
                </h3>
                <p className="text-2xl leading-relaxed text-foreground/70 font-medium">{t("vision_desc")}</p>
              </div>
           </div>
        </div>

        {/* Arusha & Köln */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div className="group relative flex flex-col md:flex-row gap-8 items-center bg-background p-10 rounded-[3rem] border border-foreground/5 shadow-xl overflow-hidden">
               <div className="absolute inset-0 z-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80" 
                    alt="Arusha" 
                    fill 
                    className="object-cover opacity-0 group-hover:opacity-10 transition-opacity duration-1000" 
                  />
               </div>
               <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 relative z-10 shadow-inner group-hover:bg-primary transition-colors">
                  <Image src="https://flagcdn.com/tz.svg" alt="Tanzania" width={50} height={35} className="rounded shadow-lg" />
               </div>
               <div className="relative z-10">
                  <h4 className="text-3xl font-black text-foreground mb-2 italic uppercase tracking-tighter">{t("presence_arusha_title")}</h4>
                  <p className="text-foreground/60 text-lg leading-relaxed font-medium">{t("presence_arusha")}</p>
               </div>
           </div>

           <div className="group relative flex flex-col md:flex-row gap-8 items-center bg-background p-10 rounded-[3rem] border border-foreground/5 shadow-xl overflow-hidden">
               <div className="absolute inset-0 z-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&q=80" 
                    alt="Köln" 
                    fill 
                    className="object-cover opacity-0 group-hover:opacity-10 transition-opacity duration-1000" 
                  />
               </div>
               <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 relative z-10 shadow-inner group-hover:bg-primary transition-colors">
                  <Image src="https://flagcdn.com/de.svg" alt="Germany" width={50} height={35} className="rounded shadow-lg" />
               </div>
               <div className="relative z-10">
                  <h4 className="text-3xl font-black text-foreground mb-2 italic uppercase tracking-tighter">{t("presence_koln_title")}</h4>
                  <p className="text-foreground/60 text-lg leading-relaxed font-medium">{t("presence_koln")}</p>
               </div>
           </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 border-t border-foreground/5 mb-32">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">{t("values_title")}</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-x-16 gap-y-12">
              {[ "auth", "integ", "prof", "resp", "sust" ].map((v, i) => (
                <motion.div 
                  key={v} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group cursor-default"
                >
                    {/* Tribal Shield Motif */}
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-all scale-150" />
                    
                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-y-[10] group-hover:bg-amber-400 transition-all duration-500" />
                        <span className="text-3xl md:text-5xl font-black text-foreground/30 group-hover:text-primary transition-all duration-500 uppercase tracking-tighter italic">
                          {t(`v_${v}`)}
                        </span>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-y-[10] group-hover:bg-amber-400 transition-all duration-500" />
                    </div>

                    {/* Animated Underline */}
                    <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
          </div>
      </div>

      {/* The Pillars */}
      <div className="bg-foreground text-background py-32 rounded-[3rem] mx-4 mb-24 mt-12 relative overflow-hidden">
        {/* Decorative background typography */}
        <div className="absolute -top-10 left-0 right-0 text-center opacity-5 whitespace-nowrap pointer-events-none overflow-hidden flex justify-center">
            <span className="text-[15vw] font-black tracking-tighter">ASILI YETU</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">{t("pillars_title")}</h2>
            <p className="text-background/70 text-lg">{t("pillars_sub")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                key: "lux", 
                icon: <Diamond className="w-6 h-6 text-black" />, 
                img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80",
                color: "from-primary/80 to-transparent"
              },
              { 
                key: "safe", 
                icon: <ShieldCheck className="w-6 h-6 text-black" />, 
                img: "https://images.unsplash.com/photo-1533241242371-d60232230302?auto=format&fit=crop&q=80",
                color: "from-blue-500/80 to-transparent"
              },
              { 
                key: "cons", 
                icon: <HeartHandshake className="w-6 h-6 text-black" />, 
                img: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&q=80",
                color: "from-green-500/80 to-transparent"
              }
            ].map((pillar, i) => (
              <motion.div 
                key={pillar.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -15, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-[500px] rounded-[3rem] overflow-hidden border border-background/10 shadow-2xl bg-black"
              >
                {/* Immersive Background */}
                <Image 
                  src={pillar.img}
                  alt={t(`p_${pillar.key}`)}
                  fill
                  className="object-cover opacity-50 group-hover:opacity-70 transition-all duration-700 group-hover:scale-110"
                />
                
                {/* Color Gradient Overlay */}
                <div className={`absolute inset-0 bg-linear-to-b ${pillar.color} opacity-40 group-hover:opacity-60 transition-opacity`} />
                
                {/* Tribal Pattern Border (Maasai-inspired) */}
                <div className="absolute bottom-0 left-0 right-0 h-4 opacity-40 group-hover:opacity-80 transition-opacity flex">
                   {Array.from({ length: 40 }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`flex-1 h-full ${idx % 2 === 0 ? 'bg-primary' : 'bg-white'} ${idx % 3 === 0 ? 'scale-y-150' : 'scale-y-100'} transition-transform duration-500`} 
                      />
                   ))}
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-10 flex flex-col justify-end z-20">
                   <motion.div 
                     className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20 group-hover:rotate-[360deg] transition-transform duration-1000"
                   >
                     {pillar.icon}
                   </motion.div>
                   
                   <h3 className="text-3xl font-black mb-4 text-white drop-shadow-lg italic uppercase tracking-tighter">
                     {t(`p_${pillar.key}`)}
                   </h3>
                   <p className="text-white/80 leading-relaxed font-bold text-lg drop-shadow-md">
                     {t(`p_${pillar.key}_sub`)}
                   </p>
                </div>

                {/* Subtle Glow Pulse */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                   <div className="absolute inset-0 bg-primary/10 blur-[60px]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

