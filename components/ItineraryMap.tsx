"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from "framer-motion";
import { MapPin, Hotel, Plane } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface ItineraryDay {
  day: number;
  destination: string;
  accommodation: string;
  lat: number;
  lng: number;
}

interface ItineraryMapProps {
  itinerary: ItineraryDay[];
}

export default function ItineraryMap({ itinerary }: ItineraryMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [34.9, -2.3],
        zoom: 7,
      });

      map.current.on('load', () => {
        updateMapData();
      });
    } else if (map.current.isStyleLoaded()) {
      updateMapData();
    }

    function updateMapData() {
      if (!map.current || itinerary.length === 0) return;

      const coordinates = itinerary.map(d => [d.lng, d.lat]);
      const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;

      if (source) {
        source.setData({
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': coordinates as any
          }
        });
      } else {
        map.current.addSource('route', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': coordinates as any
            }
          }
        });

        map.current.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': { 'line-join': 'round', 'line-cap': 'round' },
          'paint': { 'line-color': '#4a7c1a', 'line-width': 3, 'line-dasharray': [2, 1] }
        });
      }

      // Cleanup old markers
      const markerElements = document.querySelectorAll('.day-marker');
      markerElements.forEach(el => el.remove());

      itinerary.forEach((day) => {
        const el = document.createElement('div');
        el.className = 'day-marker';
        el.innerHTML = `
          <div style="background: #a3cc4c; color: #000; padding: 4px 10px; border-radius: 8px; font-weight: 900; font-size: 10px; border: 2px solid #4a7c1a; box-shadow: 0 4px 10px rgba(0,0,0,0.2); white-space: nowrap;">
            Day ${day.day}
          </div>
        `;
        new mapboxgl.Marker(el).setLngLat([day.lng, day.lat]).addTo(map.current!);
      });

      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach(coord => bounds.extend(coord as any));
      map.current.fitBounds(bounds, { padding: 80, duration: 1000 });
    }

  }, [itinerary]);

  return (
    <div className="flex flex-col lg:flex-row bg-[#a3cc4c]/10 rounded-[3rem] overflow-hidden border border-[#4a7c1a]/20 shadow-xl mt-12">
      {/* Table Side */}
      <div className="w-full lg:w-1/2 p-8 lg:p-12 overflow-y-auto max-h-[600px] custom-scrollbar">
         <div className="flex items-center gap-3 mb-8">
            <span className="bg-[#4a7c1a] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Itinerary</span>
            <h3 className="text-2xl font-black text-foreground italic uppercase tracking-tighter">Route <span className="text-[#4a7c1a]">Timeline</span></h3>
         </div>

         <div className="space-y-4">
            {itinerary.map((day, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-stretch bg-white rounded-2xl border border-foreground/5 shadow-sm group hover:border-[#4a7c1a] transition-all"
              >
                 <div className="w-24 bg-[#a3cc4c] flex flex-col items-center justify-center text-[#4a7c1a] font-black py-6 rounded-l-2xl">
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Day</span>
                    <span className="text-3xl italic">{day.day}</span>
                 </div>
                 <div className="flex-1 p-6">
                    <h4 className="font-bold text-foreground text-lg mb-1">{day.destination}</h4>
                    <div className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest">
                       {day.accommodation.toLowerCase().includes('airport') ? <Plane className="w-3 h-3" /> : <Hotel className="w-3 h-3" />}
                       {day.accommodation}
                    </div>
                 </div>
              </motion.div>
            ))}
         </div>
      </div>

      {/* Map Side */}
      <div className="w-full lg:w-1/2 min-h-[500px] md:min-h-[600px] relative bg-[#e0e7d5]">
         <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
         
         {/* Zoom Controls Overlay */}
         <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-xl p-3 rounded-2xl border border-white/20 text-white shadow-2xl">
            <MapPin className="w-5 h-5" />
         </div>

         {/* Start/End Points */}
         <div className="absolute bottom-10 left-10 right-10 flex justify-between gap-4">
            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-foreground/10">
               <span className="block text-[8px] font-black uppercase text-foreground/30 mb-1">Start Point</span>
               <span className="text-xs font-black text-foreground">{itinerary[0]?.destination}</span>
            </div>
            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-foreground/10 text-right">
               <span className="block text-[8px] font-black uppercase text-foreground/30 mb-1">End Point</span>
               <span className="text-xs font-black text-foreground">{itinerary[itinerary.length - 1]?.destination}</span>
            </div>
         </div>
      </div>
    </div>
  );
}
