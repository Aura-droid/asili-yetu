"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Heart, History, Music, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

type Highlight = {
  label: string;
  title: string;
  description: string;
  icon: "music" | "heart" | "history" | "shield";
  size: "wide" | "standard";
  className: string;
  iconClassName: string;
  chipClassName: string;
};

const iconMap = {
  music: Music,
  heart: Heart,
  history: History,
  shield: ShieldCheck,
} as const;

export default function CultureHighlights({ highlights }: { highlights: Highlight[] }) {
  const t = useTranslations("Culture");

  return (
    <div className="relative rounded-[2.5rem] border border-foreground/5 bg-white/80 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-5 xl:p-6">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mb-4 flex items-center justify-between px-2 pt-2 xl:mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary/70">{t("pillars_badge")}</p>
          <p className="mt-1 text-sm font-semibold text-foreground/45">{t("pillars_subtitle")}</p>
        </div>
        <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/8 text-primary md:flex">
          <ArrowUpRight className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-5">
        {highlights.map((highlight, index) => {
          const Icon = iconMap[highlight.icon];
          const desktopLayout =
            highlight.size === "wide"
              ? "md:col-span-2 xl:min-h-[260px]"
              : "xl:min-h-[320px]";

          return (
            <motion.article
              key={`${highlight.label}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className={`group relative overflow-hidden rounded-[2rem] border p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition-all duration-500 md:p-6 xl:p-7 ${desktopLayout} ${highlight.className}`}
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

                <h3 className={`text-2xl font-black uppercase tracking-tight text-foreground md:text-[2.15rem] xl:leading-[0.95] ${highlight.size === "wide" ? "max-w-[18ch]" : "max-w-[10ch]"}`}>
                  {highlight.title}
                </h3>

                <p className={`mt-3 text-sm leading-relaxed text-foreground/60 md:text-[15px] ${highlight.size === "wide" ? "max-w-[58ch]" : "max-w-[24ch]"}`}>
                  {highlight.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-foreground/35">
                  <span className="h-px flex-1 bg-foreground/10" />
                  {t("pillars_footer")}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
