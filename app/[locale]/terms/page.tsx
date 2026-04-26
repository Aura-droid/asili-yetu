import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Scale, FileText, AlertCircle, Users } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Terms' });
  
  return {
    title: t.raw('title').replace(/<[^>]*>/g, ''),
    description: t('sub')
  };
}

export default function TermsPage() {
  const t = useTranslations("Terms");

  return (
    <div className="flex flex-col w-full bg-background min-h-screen pb-24">
      {/* Premium Header */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 skew-y-3 origin-left transform scale-110" />
        <div className="relative z-10 container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 backdrop-blur-sm">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Expedition Protocol</span>
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
                  <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
                  <AlertCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
                  <Users className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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

          <div className="mt-24 p-12 rounded-[3rem] bg-primary text-primary-foreground text-center relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[0.4em] font-bold mb-4 opacity-80">Acknowledgment</p>
              <p className="text-3xl font-black mb-6 leading-tight">By proceeding, you honor the ancient rhythms and modern standards of the Tanzanian wilderness.</p>
              <div className="h-1 w-24 bg-white/30 mx-auto rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
