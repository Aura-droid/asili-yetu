"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Info, ArrowRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface Destination {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
}

export default function SafariExplorerMap({ destinations }: { destinations: any[] }) {
  const t = useTranslations("Destinations");
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedDest, setSelectedDest] = useState<any | null>(null);

  // Helper to get translated destination data
  const getTranslatedDest = (dest: any) => {
    if (!dest) return null;
    const nameLower = dest.name.toLowerCase();
    let slug = "";
    if (nameLower.includes("serengeti")) slug = "serengeti";
    else if (nameLower.includes("ngorongoro")) slug = "ngorongoro";
    else if (nameLower.includes("tarangire")) slug = "tarangire";
    else if (nameLower.includes("kilimanjaro")) slug = "kilimanjaro";
    else if (nameLower.includes("manyara")) slug = "manyara";
    else if (nameLower.includes("zanzibar")) slug = "zanzibar";

    if (slug) {
      return {
        ...dest,
        name: t(`Data.${slug}.name`),
        type: t(`Data.${slug}.type`),
        description: t(`Data.${slug}.desc`)
      };
    }
    return dest;
  };

  const displayDest = getTranslatedDest(selectedDest);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12", 
      center: [34.8333, -2.3333], // Default to Serengeti Center
      zoom: 6.5,
      pitch: 45,
    });

    map.current.on('load', () => {
      map.current?.resize();
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    const bounds = new mapboxgl.LngLatBounds();
    let hasCoords = false;

    destinations.forEach((dest) => {
        if (!dest.latitude || !dest.longitude) return;
        hasCoords = true;
        bounds.extend([dest.longitude, dest.latitude]);

        // Create Custom Marker El
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.style.width = "40px";
        el.style.height = "40px";
        el.style.background = "#D4AF37";
        el.style.borderRadius = "50%";
        el.style.border = "3px solid white";
        el.style.boxShadow = "0 10px 20px rgba(0,0,0,0.3)";
        el.style.cursor = "pointer";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        
        // Add Pin Icon (Simplified)
        el.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

        new mapboxgl.Marker(el)
          .setLngLat([dest.longitude, dest.latitude])
          .addTo(map.current!);

        el.addEventListener("click", () => {
           setSelectedDest(dest);
           map.current?.flyTo({
              center: [dest.longitude, dest.latitude],
              zoom: 10,
              duration: 2000,
              essential: true
           });
        });
    });

    if (hasCoords) {
      map.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 10,
        duration: 2000
      });
    }

    return () => map.current?.remove();
  }, [destinations]);

  return (
    <div className="relative w-full h-[600px] md:h-[800px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Search/Legend Overlay */}
      <div className="absolute top-8 left-8 z-10 bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 max-w-xs pointer-events-none">
         <h3 className="text-white font-black text-xl mb-2 tracking-tighter italic uppercase">{t("Map.discovery_mode")}</h3>
         <p className="text-white/60 text-xs font-medium leading-relaxed">
            {t("Map.discovery_sub")}
         </p>
      </div>

      {/* Selected Destination Popup */}
      <AnimatePresence>
        {displayDest && (
          <motion.div
            key="selected-dest-popup"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-4 left-4 right-4 md:top-8 md:bottom-8 md:right-8 md:left-auto md:w-96 bg-black/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-6 md:p-8 z-20 flex flex-col shadow-2xl max-h-[70vh] md:max-h-none"
          >
            <button 
              onClick={() => setSelectedDest(null)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative h-48 rounded-2xl overflow-hidden mb-6 shadow-lg shrink-0">
               <img src={displayDest.image_url || displayDest.image} alt={displayDest.name} className="w-full h-full object-cover" />
               <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase text-black">
                  {displayDest.type}
               </div>
            </div>

            <h3 className="text-white text-3xl font-black mb-4 tracking-tighter leading-tight italic">{displayDest.name}</h3>
            <div className="text-white/70 text-sm leading-relaxed mb-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
               {displayDest.description}
            </div>

            <Link 
              href={`/packages?q=${displayDest.name}`}
              className="w-full bg-white py-4 rounded-xl text-black font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary transition-all active:scale-95"
            >
               {t("Map.explore_packages")} <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
