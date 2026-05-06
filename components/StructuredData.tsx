import React from "react";

interface StructuredDataProps {
  type: "Organization" | "TravelAgency" | "LocalBusiness" | "Trip" | "Place" | "FAQPage" | "BreadcrumbList";
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {

  // Basic context that's always needed
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseData) }}
    />
  );
}

/**
 * Modern GEO/AEO Schema Builders
 */

export const getOrganizationSchema = (baseUrl: string) => ({
  "@type": "Organization",
  "name": "Asili Yetu Safaris",
  "alternateName": "Asili Yetu",
  "legalName": "Asili Yetu Safaris Limited",
  "disambiguatingDescription": "Asili Yetu Safaris is an independent premium tour operator specializing in luxury and authentic Tanzanian expeditions, not to be confused with other agencies with similar names.",
  "description": "Asili Yetu Safaris provides premium, tailor-made wildlife safaris, Kilimanjaro climbs, and Zanzibar beach holidays in Tanzania. We specialize in high-end, authentic experiences led by expert local guides.",
  "url": baseUrl,
  "logo": `${baseUrl}/brand/asili-yetu-brand.jpg`,
  "sameAs": [
    "https://instagram.com/asiliyetusafaris",
    "https://facebook.com/profile.php?id=61574287724283",
    "https://www.tripadvisor.com/Search?q=Asili+Yetu+Safaris"
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+49 175 1159881",
      "contactType": "customer service",
      "email": "info@asiliyetusafaris.com",
      "availableLanguage": ["English", "German", "Swahili", "Spanish", "French"]
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Arusha",
    "addressCountry": "Tanzania"
  }
});

export const getTravelAgencySchema = (baseUrl: string) => ({
  "@type": "TravelAgency",
  "name": "Asili Yetu Safaris",
  "description": "Expert-led Tanzanian expeditions specializing in the Serengeti, Ngorongoro Crater, and Mount Kilimanjaro.",
  "image": `${baseUrl}/brand/asili-yetu-brand.jpg`,
  "@id": `${baseUrl}/#travelagency`,
  "url": baseUrl,
  "telephone": "+49 175 1159881",
  "priceRange": "$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Arusha City Centre",
    "addressLocality": "Arusha",
    "addressRegion": "Arusha",
    "addressCountry": "TZ"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -3.3731,
    "longitude": 36.6853
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "00:00",
    "closes": "23:59"
  },
  "areaServed": "Tanzania",
  "knowsAbout": [
    "Tanzania Safaris",
    "Serengeti Migration",
    "Kilimanjaro Climbing",
    "Zanzibar Beach Holidays",
    "Eco-Tourism",
    "Luxury Travel"
  ],
  "knowsLanguage": ["en", "sw", "es", "fr", "de", "zh", "ar"]
});

export const getBreadcrumbSchema = (baseUrl: string, items: { name: string; item: string }[]) => ({
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.item.startsWith('http') ? item.item : `${baseUrl}${item.item}`
  }))
});
