import { supabase } from "@/lib/supabase";
import { Compass } from "lucide-react";
import React from "react";
import SafariExplorer from "@/components/SafariExplorer";
import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from 'next';
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";

export async function generateMetadata({ searchParams, params }: { searchParams: Promise<{ expedition?: string }>, params: Promise<{ locale: string }> }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";
  const { locale } = await params;
  const { expedition } = await searchParams;

  if (expedition) {
    const { data } = await supabase
      .from("packages")
      .select("*, destinations(name, image_url)")
      .eq('id', expedition)
      .single();

    if (data) {
      return {
        title: `${data.title} | Asili Yetu Safaris`,
        description: `Experience the wild with our ${data.duration_days}-day expedition. Rated ${data.avg_rating || '5.0'} stars. Professional local guides and luxury camps included.`,
        alternates: {
          canonical: `${baseUrl}/${locale}/packages?expedition=${expedition}`,
          languages: {
            'en': `${baseUrl}/en/packages?expedition=${expedition}`,
            'sw': `${baseUrl}/sw/packages?expedition=${expedition}`,
            'es': `${baseUrl}/es/packages?expedition=${expedition}`,
            'fr': `${baseUrl}/fr/packages?expedition=${expedition}`,
            'de': `${baseUrl}/de/packages?expedition=${expedition}`,
            'zh': `${baseUrl}/zh/packages?expedition=${expedition}`,
            'ar': `${baseUrl}/ar/packages?expedition=${expedition}`,
            'x-default': `${baseUrl}/en/packages?expedition=${expedition}`,
          },
        },
        openGraph: {
          title: data.title,
          description: data.description?.slice(0, 160),
          images: [data.main_image || data.destinations?.image_url || ''],
        },
      };
    }
  }

  return {
    title: "Eco-Expeditions & Private Safaris | Asili Yetu",
    description: "Discover curated safari masterpieces across the Serengeti and Tanzania. Private, luxury, and eco-friendly expeditions tailored to your needs.",
    alternates: {
      canonical: `${baseUrl}/${locale}/packages`,
      languages: {
        'en': `${baseUrl}/en/packages`,
        'sw': `${baseUrl}/sw/packages`,
        'es': `${baseUrl}/es/packages`,
        'fr': `${baseUrl}/fr/packages`,
        'de': `${baseUrl}/de/packages`,
        'zh': `${baseUrl}/zh/packages`,
        'ar': `${baseUrl}/ar/packages`,
        'x-default': `${baseUrl}/en/packages`,
      }
    }
  };
}

export default async function PackagesPage({ searchParams }: { searchParams: Promise<{ expedition?: string }> }) {
  const t = await getTranslations("Packages");
  const locale = await getLocale();
  const { expedition } = await searchParams;
  const { data: packages, error } = await supabase.from("packages").select("*, destinations(name, image_url)");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";

  const jsonLd = packages?.map(pkg => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pkg.title,
    description: pkg.description,
    image: pkg.main_image,
    offers: {
      '@type': 'Offer',
      price: pkg.price_usd,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '124',
    },
  })) || [];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 transition-colors duration-1000">
      <StructuredData
        type="BreadcrumbList"
        data={getBreadcrumbSchema(baseUrl, [
          { name: "Home", item: `/${locale}` },
          { name: "Safaris", item: `/${locale}/packages` },
        ])}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-extrabold text-foreground tracking-tight mb-6">{t("title")}</h1>
          <p className="text-foreground/70 text-xl md:text-2xl max-w-3xl mx-auto font-medium">
            {t("subtitle")}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium mb-12">
            Error loading packages: {error.message}
          </div>
        )}

        {!packages?.length && !error ? (
          <div className="text-center py-32 bg-foreground/5 rounded-[3rem] border border-foreground/10 shadow-inner">
            <Compass className="w-20 h-20 mx-auto mb-6 text-foreground/20" />
            <h3 className="text-3xl font-black text-foreground">{t("no_packages")}</h3>
            <p className="text-foreground/60 mt-3 text-lg">{t("check_back")}</p>
          </div>
        ) : (
          <SafariExplorer packages={packages || []} />
        )}
      </div>
    </div>
  );
}
