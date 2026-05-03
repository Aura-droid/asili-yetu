import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import JungleTransitionOverlay from "@/components/JungleTransitionOverlay";
import Spotlight from "@/components/Spotlight";
import GlobalNoticeBanner from "@/components/GlobalNoticeBanner";
import Footer from "@/components/Footer";
import PublicExpeditionWidget from "@/components/PublicExpeditionWidget";
import { getActiveNotice } from "@/app/actions/notices";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import LoadingProvider from "@/providers/LoadingProvider";
import CookieConsent from "@/components/CookieConsent";
import { getSettings } from "@/app/actions/settings";
import { getOrganizationSchema, getTravelAgencySchema } from "@/components/StructuredData";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  // This would ideally come from a translation file, but for the root layout, we provide a high-fidelity mapped default
  const descriptions: Record<string, string> = {
    en: "Experience premium safaris and authentic Tanzanian adventures with Asili Yetu.",
    sw: "Uzoefu wa safari za daraja la juu na matukio halisi ya Kitanzania na Asili Yetu.",
    es: "Experiencias de safari premium y auténticas aventuras tanzanas con Asili Yetu.",
    fr: "Expériences de safari premium et aventures tanzaniennes authentiques avec Asili Yetu Safaris.",
    de: "Premium-Safari-Erlebnisse und authentische tansanische Abenteuer mit Asili Yetu Safaris.",
    zh: "通过 Asili Yetu 获得优质的游猎体验和真实的坦桑尼亚冒险。",
    ar: "تجارب سفاري متميزة ومغامرات تنزانية أصيلة مع أسيلي يتو سفاريز."
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "Asili Yetu Safaris",
      template: "%s | Asili Yetu"
    },
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        sw: `${baseUrl}/sw`,
        es: `${baseUrl}/es`,
        fr: `${baseUrl}/fr`,
        de: `${baseUrl}/de`,
        zh: `${baseUrl}/zh`,
        ar: `${baseUrl}/ar`,
        'x-default': `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Asili Yetu Safaris",
      images: [
        {
          url: "/brand/asili-yetu-brand.jpg",
          width: 1200,
          height: 630,
          alt: "Asili Yetu Safaris - Premium Tanzanian Expeditions",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Asili Yetu Safaris",
      description: descriptions[locale] || descriptions.en,
      images: ["/brand/asili-yetu-brand.jpg"],
    },
    keywords: ["safari", "tanzania", "serengeti", "ngorongoro", "kilimanjaro", "luxury safari", "authentic safari", "asili yetu"],
  };
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<any>;
}) {
  const { children } = props;
  const params = await props.params;
  const locale = params?.locale || "en";

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();
  const activeNotice = await getActiveNotice();
  const { data: settings } = await getSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col transition-colors duration-500">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "WebSite",
                    "name": "Asili Yetu Safaris",
                    "url": baseUrl,
                    "potentialAction": {
                      "@type": "SearchAction",
                      "target": `${baseUrl}/${locale}/search?q={search_term_string}`,
                      "query-input": "required name=search_term_string"
                    }
                  },
                  getOrganizationSchema(baseUrl),
                  getTravelAgencySchema(baseUrl),
                  {
                    "@type": "ItemList",
                    "name": "Primary Navigation",
                    "itemListElement": [
                      { "@type": "SiteNavigationElement", "position": 1, "name": "Safari Packages", "url": `${baseUrl}/${locale}/packages` },
                      { "@type": "SiteNavigationElement", "position": 2, "name": "Destinations", "url": `${baseUrl}/${locale}/destinations` },
                      { "@type": "SiteNavigationElement", "position": 3, "name": "Our Fleet", "url": `${baseUrl}/${locale}/fleet` },
                      { "@type": "SiteNavigationElement", "position": 4, "name": "About Us", "url": `${baseUrl}/${locale}/about` }
                    ]
                  }
                ]
             })
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <LoadingProvider>
            <ThemeProvider>
              <GlobalNoticeBanner initialNotice={activeNotice} />
              <PublicExpeditionWidget />
              <CookieConsent />
              <Spotlight />
              <JungleTransitionOverlay />
              <Navbar />
              {children}
              <Footer settings={settings} />
            </ThemeProvider>
          </LoadingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
