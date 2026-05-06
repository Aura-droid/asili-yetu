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
  
  // High-converting, keyword-dense descriptions mirroring industry leaders (150-160 chars)
  const descriptions: Record<string, string> = {
    en: "Leading Safari Agency in Tanzania ✓ Tailor-made Expeditions ✓ Expert Local Guides ✓ Serengeti & Zanzibar Specialists ✓ Private & Group Safaris. Book your dream trip.",
    sw: "Kampuni ya Safari Tanzania ✓ Safari za Binafsi ✓ Waongoza Safari Wataalam ✓ Wataalam wa Serengeti na Zanzibar ✓ Utalii Endelevu. Weka nafasi ya safari yako sasa.",
    es: "Agencia Líder de Safaris en Tanzania ✓ Expediciones a Medida ✓ Guías Locales Expertos ✓ Especialistas en Serengeti y Zanzíbar ✓ Safaris Privados. Reserve su viaje.",
    fr: "Agence de Safari Leader en Tanzanie ✓ Expéditions Sur Mesure ✓ Guides Locaux Experts ✓ Spécialistes du Serengeti et de Zanzibar ✓ Safaris Privés. Réservez votre voyage.",
    de: "Führende Safari-Agentur in Tansania ✓ Maßgeschneiderte Expeditionen ✓ Erfahrene lokale Guides ✓ Spezialisten für Serengeti & Sansibar ✓ Private Safaris. Jetzt buchen.",
    zh: "坦桑尼亚领先的游猎机构 ✓ 私人定制探险 ✓ 专家级当地导游 ✓ 塞伦盖蒂和桑给巴尔专家 ✓ 私人及团体游猎。立即预订您的梦想之旅。",
    ar: "وكالة السفاري الرائدة في تنزانيا ✓ بعثات مخصصة ✓ أدلة محليون خبراء ✓ متخصصون في سيرينجيتي وزنجبار ✓ سفاري خاص ومجموعات. احجز رحلة أحلامك الآن."
  };

  const titles: Record<string, string> = {
    en: "Leading Travel Agency in Tanzania - Book your Tanzania Vacation",
    sw: "Wakala wa Safari Anayeongoza Tanzania - Weka Nafasi ya Likizo Yako",
    es: "Agencia de Viajes Líder en Tanzania - Reserve sus Vacaciones en Tanzania",
    fr: "Principale Agence de Voyage en Tanzanie - Réservez vos Vacances",
    de: "Führendes Reisebüro in Tansania - Buchen Sie Ihren Tansania-Urlaub",
    zh: "坦桑尼亚领先的旅行社 - 预订您的坦桑尼亚假期",
    ar: "وكالة السفر الرائدة في تنزانيا - احجز عطلتك في تنزانيا"
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: titles[locale] || titles.en,
      template: `%s | ${titles[locale] || titles.en}`
    },
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      type: "website",
      siteName: "Asili Yetu Safaris",
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
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
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
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
