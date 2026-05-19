"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, LucideIcon } from "lucide-react";

type Highlight = {
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  className: string;
  iconClassName: string;
  chipClassName: string;
};

export default function CultureHighlights({ highlights }: { highlights: Highlight[] }) {
  return (
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
  );
}
