import { supabase } from "@/lib/supabase";
import React from "react";
import FleetShowroom from "@/components/FleetShowroom";
import { getLocale, getTranslations } from "next-intl/server";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Fleet" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";

  return {
    title: t("meta_title"),
    description: t("meta_description"),
    alternates: {
      canonical: `${baseUrl}/${locale}/fleet`,
      languages: {
        en: `${baseUrl}/en/fleet`,
        sw: `${baseUrl}/sw/fleet`,
        es: `${baseUrl}/es/fleet`,
        fr: `${baseUrl}/fr/fleet`,
        de: `${baseUrl}/de/fleet`,
        zh: `${baseUrl}/zh/fleet`,
        ar: `${baseUrl}/ar/fleet`,
        "x-default": `${baseUrl}/en/fleet`,
      }
    }
  };
}

export default async function FleetPage() {
  const t = await getTranslations("Fleet");
  const locale = await getLocale();
  const { data: fleet, error } = await supabase.from("vehicles").select("*");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <StructuredData
        type="BreadcrumbList"
        data={getBreadcrumbSchema(baseUrl, [
          { name: "Home", item: `/${locale}` },
          { name: "Fleet", item: `/${locale}/fleet` },
        ])}
      />
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.9] mb-8 uppercase">
             {t.rich("title", {
               p: (chunks) => <span className="bg-linear-to-r from-primary via-amber-300 to-primary bg-clip-text text-transparent animate-shimmer italic">{chunks}</span>
             })}
          </h1>
          <p className="text-foreground/50 text-base md:text-lg max-w-2xl mx-auto font-medium tracking-tight">
            {t("sub")}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium">
            Error loading fleet: {error.message}
          </div>
        )}

        {!error && <FleetShowroom fleet={fleet || []} />}
      </div>
    </div>
  );
}
