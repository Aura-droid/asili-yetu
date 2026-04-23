import { getDestinations } from "@/app/actions/destinations";
import DestinationsClient from "./DestinationsClient";
import { getTranslations } from "next-intl/server";

// Destinations fetched with translatable fallback logic inside the component

export default async function DestinationsPage() {
  const t = await getTranslations("Destinations");
  const { data: dbDestinations } = await getDestinations();
  
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

  return <DestinationsClient destinations={displayDestinations} />;
}
