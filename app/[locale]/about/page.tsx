import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";

  return {
    title: "About Asili Yetu Safaris | Tanzanian Roots, Global Standards",
    description: "Learn the story, values, mission, and responsible travel philosophy behind Asili Yetu Safaris, a locally rooted safari company based in Arusha, Tanzania.",
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
      title: "About Asili Yetu Safaris",
      description: "Discover the roots, values, and safari philosophy behind Asili Yetu Safaris in Tanzania.",
      url: `${baseUrl}/${locale}/about`,
    }
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
