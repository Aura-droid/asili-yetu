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
  
  const titles: Record<string, string> = {
    en: "Leading Travel Agency in Tanzania - Book your Safari",
    sw: "Wakala wa Safari Anayeongoza Tanzania - Weka Nafasi",
    es: "Agencia de Viajes Líder en Tanzania - Reserve su Safari",
    fr: "Principale Agence de Voyage en Tanzanie - Réservez",
    de: "Führendes Reisebüro in Tansania - Buchen Sie",
    zh: "坦桑尼亚领先的旅行社 - 预订您的游猎",
    ar: "وكالة السفر الرائدة في تنزانيا - احجز رحلتك"
  };

  const descriptions: Record<string, string> = {
    en: "Leading Tour Operator in Tanzania ✓ Tailor-made Expeditions ✓ Expert Local Guides ✓ Serengeti & Zanzibar Specialists. Book your dream trip.",
    sw: "Opereta wa Utalii Anayeongoza Tanzania ✓ Safari za Binafsi ✓ Waongoza Safari Wataalam ✓ Wataalam wa Serengeti na Zanzibar. Weka nafasi yako sasa.",
    es: "Operador Turístico Líder en Tanzania ✓ Expediciones a Medida ✓ Guías Locales Expertos ✓ Especialistas en Serengeti y Zanzíbar. Reserve su viaje.",
    fr: "Tour Opérateur Leader en Tanzanie ✓ Expéditions Sur Mesure ✓ Guides Locaux Experts ✓ Spécialistes du Serengeti et de Zanzibar. Réservez.",
    de: "Führender Reiseveranstalter in Tansania ✓ Maßgeschneiderte Expeditionen ✓ Erfahrene lokale Guides ✓ Spezialisten für Serengeti & Sansibar.",
    zh: "坦桑尼亚领先的旅游运营商 ✓ 私人定制探险 ✓ 专家级当地导游 ✓ 塞伦盖蒂和桑给巴尔专家。立即预订您的梦想之旅。",
    ar: "مشغل جولات رائد في تنزانيا ✓ بعثات مخصصة ✓ أدلة محليون خبراء ✓ متخصصون في سيرينجيتي وزنجبار. احجز الآن."
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: titles[locale] || titles.en,
      template: `%s | ${titles[locale] || titles.en}`
    },
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'sw': `${baseUrl}/sw`,
        'es': `${baseUrl}/es`,
        'fr': `${baseUrl}/fr`,
        'de': `${baseUrl}/de`,
        'zh': `${baseUrl}/zh`,
        'ar': `${baseUrl}/ar`,
        'x-default': `${baseUrl}/en`,
      }
    },
    formatDetection: {
      telephone: false,
    },
    authors: [{ name: "Asili Yetu Safaris", url: baseUrl }],
    creator: "Asili Yetu Safaris",
    publisher: "Asili Yetu Safaris",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Asili Yetu Safaris",
      title: locale === 'en' ? "Asili Yetu Safaris | Tanzania" : titles[locale]?.split(' - ')[0],
      description: descriptions[locale]?.split('. ')[0] + '.',
      locale: locale === 'en' ? 'en_US' : locale,
      images: [
        {
          url: `${baseUrl}/brand/asili-yetu-brand.jpg`,
          width: 1200,
          height: 630,
          alt: "Asili Yetu Safaris - Premium Tanzanian Expeditions",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@asiliyetusafaris",
      creator: "@asiliyetusafaris",
      title: locale === 'en' ? "Asili Yetu Safaris | Tanzania" : titles[locale]?.split(' - ')[0],
      description: descriptions[locale]?.split('. ')[0] + '.',
      images: [`${baseUrl}/brand/asili-yetu-brand.jpg`],
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
