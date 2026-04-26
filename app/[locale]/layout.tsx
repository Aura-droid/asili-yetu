import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import JungleTransitionOverlay from "@/components/JungleTransitionOverlay";
import Spotlight from "@/components/Spotlight";
import GlobalNoticeBanner from "@/components/GlobalNoticeBanner";
import Footer from "@/components/Footer";
import PublicAIWidget from "@/components/PublicAIWidget";
import { getActiveNotice } from "@/app/actions/notices";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import LoadingProvider from "@/providers/LoadingProvider";
import CookieConsent from "@/components/CookieConsent";
import { getSettings } from "@/app/actions/settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  // This would ideally come from a translation file, but for the root layout, we provide a high-fidelity mapped default
  const descriptions: Record<string, string> = {
    en: "Premium safari experiences and authentic Tanzanian adventures with Asili Yetu Safaris.",
    sw: "Uzoefu wa safari za daraja la juu na matukio halisi ya Kitanzania na Asili Yetu Safaris.",
    es: "Experiencias de safari premium y auténticas aventuras tanzanas con Asili Yetu Safaris.",
    fr: "Expériences de safari premium et aventures tanzaniennes authentiques avec Asili Yetu Safaris.",
    de: "Premium-Safari-Erlebnisse und authentische tansanische Abenteuer mit Asili Yetu Safaris.",
    zh: "通过 Asili Yetu Safaris 获得优质的游猎体验和真实的坦桑尼亚冒险。",
    ar: "تجارب سفاري متميزة ومغامرات تنزانية أصيلة مع أسيلي يتو سفاريز."
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "Asili Yetu Safaris",
      template: "%s | Asili Yetu Safaris"
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

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col transition-colors duration-500">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Asili Yetu Safaris",
                "url": "https://asiliyetusafaris.com",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://asiliyetusafaris.com/en/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
             })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": [
                  { "@type": "SiteNavigationElement", "position": 1, "name": "About Us", "url": "https://asiliyetusafaris.com/en/about" },
                  { "@type": "SiteNavigationElement", "position": 2, "name": "Safari Packages", "url": "https://asiliyetusafaris.com/en/packages" },
                  { "@type": "SiteNavigationElement", "position": 3, "name": "Destinations", "url": "https://asiliyetusafaris.com/en/destinations" },
                  { "@type": "SiteNavigationElement", "position": 4, "name": "Contact", "url": "https://asiliyetusafaris.com/en/contact" }
                ]
             })
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <LoadingProvider>
            <ThemeProvider>
              <GlobalNoticeBanner initialNotice={activeNotice} />
              <PublicAIWidget />
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
