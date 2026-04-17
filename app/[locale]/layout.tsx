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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Asili Yetu Safaris and Tours",
    template: "%s | Asili Yetu Safaris and Tours"
  },
  description: "Premium safari experiences and authentic Tanzanian adventures with Asili Yetu Safaris and Tours.",
};

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
                "name": "Asili Yetu Safaris and Tours",
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
              <Spotlight />
              <JungleTransitionOverlay />
              <Navbar />
              {children}
              <Footer />
            </ThemeProvider>
          </LoadingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
