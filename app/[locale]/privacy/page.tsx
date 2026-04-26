import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Shield, Eye, Lock, Server } from "lucide-react";
import { motion } from "framer-motion";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Privacy' });
  
  return {
    title: t.raw('title').replace(/<[^>]*>/g, ''),
    description: t('sub')
  };
}

export default function PrivacyPage() {
  const t = useTranslations("Privacy");

  return (
    <div className="flex flex-col w-full bg-background min-h-screen pb-24">
      {/* Premium Header */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-right transform scale-110" />
        <div className="relative z-10 container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 backdrop-blur-sm">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Security Protocol</span>
          </div>
          
          <h1 
            className="text-5xl md:text-7xl font-black text-foreground tracking-tight mb-6"
            dangerouslySetInnerHTML={{ __html: t.raw("title") }}
          />
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed italic">
            "{t("sub")}"
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-6 mt-12">
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed mb-12 border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-xl">
            {t("intro")}
          </p>

          <div className="grid gap-12 mt-16">
            <section className="relative group">
              <div className="flex items-start gap-6">
                <div className="mt-1 w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Eye className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">{t("section1_title")}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("section1_desc")}
                  </p>
                </div>
              </div>
            </section>

            <section className="relative group">
              <div className="flex items-start gap-6">
                <div className="mt-1 w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Server className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">{t("section2_title")}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("section2_desc")}
                  </p>
                </div>
              </div>
            </section>

            <section className="relative group">
              <div className="flex items-start gap-6">
                <div className="mt-1 w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Lock className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">{t("section3_title")}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("section3_desc")}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-24 p-8 rounded-3xl bg-foreground/5 border border-foreground/10 text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Last Synchronized</p>
            <p className="text-2xl font-black">April 27, 2026</p>
            <p className="text-xs text-muted-foreground mt-4 italic">Asili Yetu Safaris Data Protection Office, Arusha, Tanzania</p>
          </div>
        </div>
      </div>
    </div>
  );
}
