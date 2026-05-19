import React from "react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart, ShieldCheck, Music, History } from "lucide-react";
import ClientCultureView from "./ClientCultureView";
import { getCultureStories } from "@/app/actions/culture";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";

  return {
    title: "Cultural Immersion | Maasai Heritage & Tanzanian Traditions",
    description: "Discover Maasai heritage, cultural immersion, and the living traditions that add depth to an Asili Yetu safari in Tanzania.",
    alternates: {
      canonical: `${baseUrl}/${locale}/culture`,
      languages: {
        en: `${baseUrl}/en/culture`,
        sw: `${baseUrl}/sw/culture`,
        es: `${baseUrl}/es/culture`,
        fr: `${baseUrl}/fr/culture`,
        de: `${baseUrl}/de/culture`,
        zh: `${baseUrl}/zh/culture`,
        ar: `${baseUrl}/ar/culture`,
        "x-default": `${baseUrl}/en/culture`,
      }
    }
  };
}

export default async function CulturePage() {
  const t = await getTranslations("Culture");
  const locale = await getLocale();
  const stories = await getCultureStories();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";
  const highlights = [
    {
      label: t("ritual_label"),
      title: t("ritual_name"),
      description: t("story_1_desc"),
      icon: Music,
      className:
        "lg:col-span-5 bg-[radial-gradient(circle_at_top,rgba(225,161,42,0.18),transparent_58%),linear-gradient(180deg,#ffffff_0%,#fbf4e8_100%)] border-primary/20",
      iconClassName: "text-primary",
      chipClassName: "bg-primary/12 text-primary border-primary/20",
    },
    {
      label: t("kinship_label"),
      title: t("kinship_name"),
      description: t("subtitle"),
      icon: Heart,
      className:
        "lg:col-span-4 lg:translate-y-10 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.14),transparent_55%),linear-gradient(180deg,#fff8f8_0%,#ffffff_100%)] border-red-200/60",
      iconClassName: "text-red-500",
      chipClassName: "bg-red-500/10 text-red-500 border-red-200/70",
    },
    {
      label: t("v_ancestry_title"),
      title: t("story_2_title"),
      description: t("story_2_desc"),
      icon: History,
      className:
        "lg:col-span-3 bg-[radial-gradient(circle_at_top,rgba(104,78,52,0.16),transparent_60%),linear-gradient(180deg,#fffdf7_0%,#f6efe3_100%)] border-stone-300/70",
      iconClassName: "text-stone-600",
      chipClassName: "bg-stone-500/10 text-stone-600 border-stone-300/70",
    },
    {
      label: t("v_guardianship_title"),
      title: t("story_3_title"),
      description: t("story_3_desc"),
      icon: ShieldCheck,
      className:
        "lg:col-span-7 lg:-translate-y-6 bg-[radial-gradient(circle_at_top,rgba(166,124,55,0.16),transparent_58%),linear-gradient(180deg,#fffaf1_0%,#f7f1e8_100%)] border-amber-300/50",
      iconClassName: "text-amber-700",
      chipClassName: "bg-amber-500/10 text-amber-700 border-amber-300/60",
    },
  ];

  const renderTitle = (title: string) => {
    const normalized = title
      .replace(/&lt;br\s*\/?&gt;/gi, "<br />")
      .replace(/<BR\s*\/?>/g, "<br />");
    const lines = normalized.split(/<br\s*\/?>/i);

    return lines
      .map((line, index) => {
        const content = line
          .split(/(<p>.*?<\/p>)/gi)
          .filter(Boolean)
          .map((segment, segmentIndex) => {
            const match = segment.match(/^<p>(.*?)<\/p>$/i);

            if (match) {
              return (
                <span key={segmentIndex} className="text-primary italic">
                  {match[1]}
                </span>
              );
            }

            return <React.Fragment key={segmentIndex}>{segment}</React.Fragment>;
          });

        return (
          <React.Fragment key={index}>
            {content}
            {index < lines.length - 1 && <br />}
          </React.Fragment>
        );
      });
  };

   return (
    <main className="min-h-screen pt-32 pb-20 overflow-hidden bg-[#fafafa]">
       <StructuredData
         type="BreadcrumbList"
         data={getBreadcrumbSchema(baseUrl, [
           { name: "Home", item: `/${locale}` },
           { name: "Culture", item: `/${locale}/culture` },
         ])}
       />
       {/* Hero Section */}
       <div className="container mx-auto max-w-7xl px-6 mb-24 md:mb-32">
          <div className="flex flex-col lg:flex-row items-end gap-12">
             <div className="flex-1">
                <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block">{t("badge")}</span>
                <h1 className="text-6xl md:text-[7rem] font-black text-foreground italic uppercase tracking-tighter leading-[0.9] mb-8">
                    {renderTitle(t.raw("title"))}
                </h1>
                <p className="text-xl md:text-2xl text-foreground/50 font-medium max-w-xl leading-relaxed">
                   {t("subtitle")}
                </p>
             </div>
             
             <div className="w-full lg:w-[44%]">
                <div className="relative rounded-[2.5rem] border border-foreground/5 bg-white/80 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-5">
                   <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                   <div className="mb-4 flex items-center justify-between px-2 pt-2">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary/70">Cultural Pillars</p>
                         <p className="mt-1 text-sm font-semibold text-foreground/45">Four entry points into living heritage</p>
                      </div>
                      <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/8 text-primary md:flex">
                         <ArrowUpRight className="h-5 w-5" />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
                      {highlights.map((highlight, index) => {
                        const Icon = highlight.icon;

                        return (
                          <motion.article
                            key={`${highlight.label}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            whileHover={{ y: -6, scale: 1.01 }}
                            transition={{ duration: 0.45, delay: index * 0.06 }}
                            className={`group relative overflow-hidden rounded-[2rem] border p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition-all duration-500 md:p-6 ${highlight.className}`}
                          >
                            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-white/35 blur-2xl transition-transform duration-500 group-hover:scale-125" />
                            <div className="relative z-10 flex h-full flex-col">
                              <div className="mb-4 flex items-start justify-between gap-4">
                                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] ${highlight.chipClassName}`}>
                                  {highlight.label}
                                </div>
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/60 bg-white/70 shadow-sm backdrop-blur">
                                  <Icon className={`h-6 w-6 ${highlight.iconClassName}`} />
                                </div>
                              </div>

                              <h3 className="max-w-[14ch] text-2xl font-black uppercase tracking-tight text-foreground md:text-[2rem]">
                                {highlight.title}
                              </h3>

                              <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-foreground/60 md:text-[15px]">
                                {highlight.description}
                              </p>

                              <div className="mt-6 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-foreground/35">
                                <span className="h-px flex-1 bg-foreground/10" />
                                Living Story
                              </div>
                            </div>
                          </motion.article>
                        );
                      })}
                   </div>
                </div>
             </div>
          </div>
       </div>

       <ClientCultureView stories={stories} />
       
       {/* Cultural Values Section */}
       <section className="bg-foreground text-background py-32 mt-32 rounded-[4rem] mx-6">
          <div className="container mx-auto max-w-6xl px-6">
             <div className="text-center mb-24">
                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">{t("values_title")}</h2>
                <div className="w-24 h-1 bg-primary mx-auto opacity-50" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center group">
                   <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto mb-8 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:text-black transition-all">
                      <ShieldCheck className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-widest mb-4 italic">{t("v_guardianship_title")}</h3>
                   <p className="text-background/40 font-medium">{t("v_guardianship_desc")}</p>
                </div>

                <div className="text-center group">
                   <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto mb-8 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:text-black transition-all">
                      <History className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-widest mb-4 italic">{t("v_ancestry_title")}</h3>
                   <p className="text-background/40 font-medium">{t("v_ancestry_desc")}</p>
                </div>

                <div className="text-center group">
                   <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto mb-8 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:text-black transition-all">
                      <Music className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-widest mb-4 italic">{t("v_expression_title")}</h3>
                   <p className="text-background/40 font-medium">{t("v_expression_desc")}</p>
                </div>
             </div>
          </div>
       </section>
    </main>
  );
}
