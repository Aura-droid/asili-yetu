"use client";

import { motion } from "framer-motion";
import { TreePine, Diamond, ShieldCheck, HeartHandshake, Loader2 } from "lucide-react";
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

      {/* CEO Message Section */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-32 bg-primary/5 rounded-[4rem] my-24 border border-primary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[120px] -ml-48 -mb-48" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12 text-center relative z-10"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-3 text-primary font-bold tracking-widest uppercase text-sm border border-primary/20 px-6 py-2 rounded-full bg-primary/5">
               {t("ceo_badge")}
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-foreground tracking-tighter uppercase italic leading-none">
               {t.rich("ceo_title", {
                 p: (chunks) => <span className="text-primary italic font-serif">{chunks}</span>
               })}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-8 text-foreground/70 text-xl md:text-2xl leading-relaxed italic font-medium">
            {localized.ceo_message ? localized.ceo_message.map((p: string, i: number) => (
              <p key={i}>{p}</p>
            )) : (
              <>
                <p>{t("ceo_p1")}</p>
                <p>{t("ceo_p2")}</p>
                <p>{t("ceo_p3")}</p>
              </>
            )}
          </div>

          <div className="pt-8 flex flex-col items-center gap-4">
             <div className="w-24 h-1 bg-primary" />
             <p className="text-2xl font-black text-foreground tracking-tight">{t("ceo_signature")}</p>
          </div>
        </motion.div>
      </div>

      {/* Philosophy & Presence (Remaining) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
           <div className="p-12 rounded-[2.5rem] bg-foreground text-background shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/40 transition-colors" />
              <h3 className="text-3xl font-black mb-6 flex items-center gap-4 text-primary">
                 <div className="w-1.5 h-8 bg-primary" /> {t("mission_title")}
              </h3>
              <p className="text-xl leading-relaxed opacity-90">{t("mission_desc")}</p>
           </div>

           <div className="p-12 rounded-[2.5rem] bg-background border border-foreground/10 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />
              <h3 className="text-3xl font-black mb-6 flex items-center gap-4 text-primary">
                 <div className="w-1.5 h-8 bg-primary" /> {t("vision_title")}
              </h3>
              <p className="text-xl leading-relaxed text-foreground/70">{t("vision_desc")}</p>
           </div>
        </div>

        {/* Arusha & Köln */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div className="flex flex-col md:flex-row gap-8 items-center bg-background p-8 rounded-[2rem] border border-foreground/5 shadow-sm">
               <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Image src="https://flagcdn.com/tz.svg" alt="Tanzania" width={40} height={30} className="rounded" />
               </div>
               <div>
                  <h4 className="text-2xl font-black text-foreground mb-2">{t("presence_arusha_title")}</h4>
                  <p className="text-foreground/60 leading-relaxed font-medium">{t("presence_arusha")}</p>
               </div>
           </div>

           <div className="flex flex-col md:flex-row gap-8 items-center bg-background p-8 rounded-[2rem] border border-foreground/5 shadow-sm">
               <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Image src="https://flagcdn.com/de.svg" alt="Germany" width={40} height={30} className="rounded" />
               </div>
               <div>
                  <h4 className="text-2xl font-black text-foreground mb-2">{t("presence_koln_title")}</h4>
                  <p className="text-foreground/60 leading-relaxed font-medium">{t("presence_koln")}</p>
               </div>
           </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 border-t border-foreground/5 mb-32">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">{t("values_title")}</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
              {[ "auth", "integ", "prof", "resp", "sust" ].map((v) => (
                <div key={v} className="flex flex-col items-center gap-4 group">
                    <div className="w-1 w-1 bg-primary/30 group-hover:w-full group-hover:h-0.5 transition-all duration-500 rounded-full" />
                    <span className="text-xl md:text-3xl font-black text-foreground/40 group-hover:text-primary transition-colors cursor-default">
                      {t(`v_${v}`)}
                    </span>
                    <div className="w-1 w-1 bg-primary/30 group-hover:w-full group-hover:h-0.5 transition-all duration-500 rounded-full" />
                </div>
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
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-background/5 p-10 rounded-3xl border border-background/10 hover:bg-background/10 transition-colors"
            >
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-8">
                <Diamond className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("p_lux")}</h3>
              <p className="text-background/70 leading-relaxed font-medium">{t("p_lux_sub")}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-background/5 p-10 rounded-3xl border border-background/10 hover:bg-background/10 transition-colors"
            >
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-8">
                <ShieldCheck className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("p_safe")}</h3>
              <p className="text-background/70 leading-relaxed font-medium">{t("p_safe_sub")}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-background/5 p-10 rounded-3xl border border-background/10 hover:bg-background/10 transition-colors"
            >
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-8">
                <HeartHandshake className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("p_cons")}</h3>
              <p className="text-background/70 leading-relaxed font-medium">{t("p_cons_sub")}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

