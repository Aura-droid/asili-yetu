"use client";

import { motion } from "framer-motion";
import { TreePine, Diamond, ShieldCheck, HeartHandshake } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getAboutContent } from "@/app/actions/content";
import { useParams } from "next/navigation";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";

export default function AboutClient() {
  const t = useTranslations("About");
  const params = useParams();
  const locale = params.locale as string;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";
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

  const content = dbContent || {};
  const localized = content[locale] || {};

  const defaultHero = "/hero/ngorongoro-hero.jpg";
  const defaultLegacy = "https://images.unsplash.com/photo-1616527027589-91307b2ab138?auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-black">
      <StructuredData
        type="BreadcrumbList"
        data={getBreadcrumbSchema(baseUrl, [
          { name: "Home", item: `/${locale}` },
          { name: "About", item: `/${locale}/about` },
        ])}
      />
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

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 space-y-32">
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
            {content.leader_photo && (
              <div className="flex justify-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl">
                  <img src={content.leader_photo} alt={content.leader_name || "Leadership"} className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            <div className="max-w-3xl mx-auto space-y-8 text-foreground/70 text-xl md:text-2xl leading-relaxed italic font-medium">
              {(localized.leader_message || []).map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>

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

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
           <div className="p-12 rounded-[3rem] bg-foreground text-background shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                 <Image
                   src="/images/Gallery/Lion-2.jpeg"
                   alt="Mission"
                   fill
                   className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
                 />
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">{t("mission_title")}</p>
                 <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-4">{t("mission_title")}</h3>
                 <p className="text-background/70 text-lg leading-relaxed">{t("mission_desc")}</p>
              </div>
           </div>

           <div className="p-12 rounded-[3rem] bg-primary/5 border border-primary/10 shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                 <Image
                   src="/images/Gallery/Zebra-1.jpeg"
                   alt="Vision"
                   fill
                   className="object-cover opacity-10 group-hover:scale-105 transition-transform duration-700"
                 />
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">{t("vision_title")}</p>
                 <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-4 text-foreground">{t("vision_title")}</h3>
                 <p className="text-foreground/70 text-lg leading-relaxed">{t("vision_desc")}</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="p-10 rounded-[3rem] border border-foreground/10 bg-white shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">{t("presence_arusha_title")}</p>
            <p className="text-foreground/70 text-lg leading-relaxed">{t("presence_arusha")}</p>
          </div>
          <div className="p-10 rounded-[3rem] border border-foreground/10 bg-white shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">{t("presence_koln_title")}</p>
            <p className="text-foreground/70 text-lg leading-relaxed">{t("presence_koln")}</p>
          </div>
        </div>

        <div className="text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">{t("values_title")}</p>
          <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-foreground">{t("pillars_title")}</h3>
          <p className="text-foreground/50 text-lg max-w-3xl mx-auto mt-6">{t("pillars_sub")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-10 rounded-[3rem] bg-white border border-foreground/10 shadow-xl">
            <Diamond className="w-10 h-10 text-primary mb-6" />
            <h4 className="text-2xl font-black uppercase tracking-tight mb-4">{t("p_lux")}</h4>
            <p className="text-foreground/60 leading-relaxed">{t("p_lux_sub")}</p>
          </div>
          <div className="p-10 rounded-[3rem] bg-white border border-foreground/10 shadow-xl">
            <ShieldCheck className="w-10 h-10 text-primary mb-6" />
            <h4 className="text-2xl font-black uppercase tracking-tight mb-4">{t("p_safe")}</h4>
            <p className="text-foreground/60 leading-relaxed">{t("p_safe_sub")}</p>
          </div>
          <div className="p-10 rounded-[3rem] bg-white border border-foreground/10 shadow-xl">
            <HeartHandshake className="w-10 h-10 text-primary mb-6" />
            <h4 className="text-2xl font-black uppercase tracking-tight mb-4">{t("p_cons")}</h4>
            <p className="text-foreground/60 leading-relaxed">{t("p_cons_sub")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
