import { supabase } from "@/lib/supabase";
import { Compass } from "lucide-react";
import React from "react";
import BiomePackageCard from "@/components/BiomePackageCard";
import { getTranslations } from "next-intl/server";
import { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ expedition?: string }> }): Promise<Metadata> {
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
        description: `Experience the wild with our ${data.duration_days}-day expedition. Rated ${data.avg_rating || '5.0'} stars.`,
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
    description: "Curated safari masterpieces across the African savannah.",
  };
}

export default async function PackagesPage({ searchParams }: { searchParams: Promise<{ expedition?: string }> }) {
  const t = await getTranslations("Packages");
  const { expedition } = await searchParams;
  const { data: packages, error } = await supabase.from("packages").select("*, destinations(name, image_url)");

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
  }));

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 transition-colors duration-1000">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-24 md:mb-32">
          <h1 className="text-6xl md:text-8xl font-extrabold text-foreground tracking-tight mb-6">{t("title")}</h1>
          <p className="text-foreground/70 text-xl md:text-2xl max-w-3xl mx-auto font-medium">
            {t("subtitle")}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium">
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
          <div className="flex flex-col max-w-6xl mx-auto">
            <div className="w-0.5 h-32 bg-gradient-to-b from-transparent to-primary mx-auto mb-10 opacity-50 hidden md:block" />
            
            {packages?.map((pkg: any) => (
              <BiomePackageCard key={pkg.id} pkg={pkg} />
            ))}

            <div className="w-0.5 h-32 bg-gradient-to-t from-transparent to-primary mx-auto mt-10 opacity-50 hidden md:block" />
          </div>
        )}
      </div>
    </div>
  );
}
