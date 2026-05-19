import { getDestinations } from "@/app/actions/destinations";
import DestinationsClient from "./DestinationsClient";
import { getLocale, getTranslations } from "next-intl/server";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Destinations" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";
  
  return {
    title: t("meta_title"),
    description: t("meta_description"),
    alternates: {
      canonical: `${baseUrl}/${locale}/destinations`,
      languages: {
        'en': `${baseUrl}/en/destinations`,
        'sw': `${baseUrl}/sw/destinations`,
        'es': `${baseUrl}/es/destinations`,
        'fr': `${baseUrl}/fr/destinations`,
        'de': `${baseUrl}/de/destinations`,
        'zh': `${baseUrl}/zh/destinations`,
        'ar': `${baseUrl}/ar/destinations`,
        'x-default': `${baseUrl}/en/destinations`,
      }
    }
  };
}

export default async function DestinationsPage() {
  const t = await getTranslations("Destinations");
  const locale = await getLocale();
  const { data: dbDestinations } = await getDestinations();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";
  
  const staticDestinations = [
    {
      id: "serengeti",
      name: t("Data.serengeti.name"),
      type: t("Data.serengeti.type"),
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80",
      description: t("Data.serengeti.desc"),
      best_time: t("Data.serengeti.time"),
      key_wildlife: t("Data.serengeti.wildlife"),
      size: "14,763 sq km",
      latitude: -2.3333,
      longitude: 34.8333
    },
    {
      id: "ngorongoro",
      name: t("Data.ngorongoro.name"),
      type: t("Data.ngorongoro.type"),
      image: "/destinations/ngorongoro-1.jpg",
      description: t("Data.ngorongoro.desc"),
      best_time: t("Data.ngorongoro.time"),
      key_wildlife: t("Data.ngorongoro.wildlife"),
      size: "260 sq km",
      latitude: -3.2442,
      longitude: 35.5862
    },
    {
      id: "tarangire",
      name: t("Data.tarangire.name"),
      type: t("Data.tarangire.type"),
      image: "/destinations/tarangire-1.jpg",
      description: t("Data.tarangire.desc"),
      best_time: t("Data.tarangire.time"),
      key_wildlife: t("Data.tarangire.wildlife"),
      size: "2,850 sq km",
      latitude: -3.9531,
      longitude: 35.9619
    },
    {
      id: "kilimanjaro",
      name: t("Data.kilimanjaro.name"),
      type: t("Data.kilimanjaro.type"),
      image: "/destinations/kilimanjaro-1.jpg",
      description: t("Data.kilimanjaro.desc"),
      best_time: t("Data.kilimanjaro.time"),
      key_wildlife: t("Data.kilimanjaro.wildlife"),
      size: "5,895 meters (Peak)",
      latitude: -3.0674,
      longitude: 37.3556
    },
    {
      id: "manyara",
      name: t("Data.manyara.name"),
      type: t("Data.manyara.type"),
      image: "https://images.unsplash.com/photo-1547407139-3c921a661958?auto=format&fit=crop&q=80",
      description: t("Data.manyara.desc"),
      best_time: t("Data.manyara.time"),
      key_wildlife: t("Data.manyara.wildlife"),
      size: "330 sq km",
      latitude: -3.4287,
      longitude: 35.8083
    },
    {
      id: "zanzibar",
      name: t("Data.zanzibar.name"),
      type: t("Data.zanzibar.type"),
      image: "/destinations/zanzibar-1.jpg",
      description: t("Data.zanzibar.desc"),
      best_time: t("Data.zanzibar.time"),
      key_wildlife: t("Data.zanzibar.wildlife"),
      size: "2,462 sq km",
      latitude: -6.1659,
      longitude: 39.2026
    }
  ];

  // Use DB destinations if available, otherwise fallback to static for zero-downtime transition
  const displayDestinations = (dbDestinations && dbDestinations.length > 0 
    ? dbDestinations 
    : staticDestinations).sort((a: any, b: any) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

  return (
    <>
      <StructuredData
        type="BreadcrumbList"
        data={getBreadcrumbSchema(baseUrl, [
          { name: "Home", item: `/${locale}` },
          { name: "Destinations", item: `/${locale}/destinations` },
        ])}
      />
      <DestinationsClient destinations={displayDestinations} />
    </>
  );
}
