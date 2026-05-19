import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutClient from "./AboutClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";

  return {
    title: t("meta_title"),
    description: t("meta_description"),
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
      languages: {
        en: `${baseUrl}/en/about`,
        sw: `${baseUrl}/sw/about`,
        es: `${baseUrl}/es/about`,
        fr: `${baseUrl}/fr/about`,
        de: `${baseUrl}/de/about`,
        zh: `${baseUrl}/zh/about`,
        ar: `${baseUrl}/ar/about`,
        "x-default": `${baseUrl}/en/about`,
      }
    },
    openGraph: {
      title: t("meta_title"),
      description: t("meta_description"),
      url: `${baseUrl}/${locale}/about`,
    }
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
