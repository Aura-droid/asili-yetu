"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Radio, Battery, Signal, Navigation, Map as MapIcon, ShieldCheck, Activity } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface TelemetryPoint {
  guide_id: string;
  lat: number;
  lng: number;
  battery_level: number;
  signal_strength?: number;
  speed: number;
  status: string;
  timestamp: string;
  guides?: {
    name: string;
    fleet_assigned: string;
    image_url?: string;
  };
}

export default function AdminSentinelMap({ initialData }: { initialData: TelemetryPoint[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Record<string, mapboxgl.Marker>>({});
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [34.9, -2.3], // Central Serengeti focus
      zoom: 6.5,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers that are not in the new data
    const newDataIds = new Set(initialData.map(d => d.guide_id));
    Object.keys(markers.current).forEach(id => {
      if (!newDataIds.has(id)) {
        markers.current[id].remove();
        delete markers.current[id];
      }
    });

    initialData.forEach(point => {
      const { guide_id, lat, lng, guides, status, battery_level } = point;

      if (markers.current[guide_id]) {
        // Update existing marker position
        markers.current[guide_id].setLngLat([lng, lat]);
      } else {
        // Create new marker
        const el = document.createElement('div');
        el.className = 'sentinel-marker';
        
        // Define color based on status
        const color = status === 'Active' ? '#a3cc4c' : '#fbbf24';
        
        el.innerHTML = `
          <div style="position: relative; display: flex; flex-direction: column; items-center;">
             <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(0,0,0,0.8); border: 2px solid ${color}; display: flex; items-center; justify-center; overflow: hidden; box-shadow: 0 0 20px ${color}44;">
                ${guides?.image_url 
                  ? `<img src="${guides.image_url}" style="width: 100%; height: 100%; object-fit: cover;" />`
                  : `<div style="color: ${color}; font-weight: 900; font-size: 10px;">${guides?.name.substring(0,2).toUpperCase()}</div>`
                }
             </div>
             <div style="background: ${color}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid #000; position: absolute; bottom: 0; right: 0;"></div>
          </div>
        `;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(map.current!);

        marker.getElement().addEventListener('click', () => {
          setActiveGuideId(guide_id);
          map.current?.flyTo({
            center: [lng, lat],
            zoom: 12,
            essential: true
          });
        });

        markers.current[guide_id] = marker;
      }
    });
  }, [initialData]);

  const activeGuide = initialData.find(d => d.guide_id === activeGuideId);

  return (
    <div className="relative w-full h-[600px] rounded-[3rem] overflow-hidden border border-black/10 shadow-2xl group">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Overlay: Status Bar */}
      <div className="absolute top-6 left-6 flex items-center gap-4 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-3xl flex items-center gap-4 shadow-2xl pointer-events-auto">
           <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Radio className="w-5 h-5 text-primary animate-pulse" />
           </div>
           <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Savannah-Eye <span className="text-primary italic">Live</span></h3>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">{initialData.length} Rangers Reporting</p>
           </div>
        </div>
      </div>

      {/* Overlay: Guide Detail Card (Floating) */}
      <AnimatePresence>
        {activeGuide && (
          <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-5">
             <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/30">
                      {activeGuide.guides?.image_url ? (
                        <img src={activeGuide.guides.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center font-black text-primary text-xl italic">
                          {activeGuide.guides?.name.substring(0,2).toUpperCase()}
                        </div>
                      )}
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-white italic tracking-tight">{activeGuide.guides?.name}</h4>
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">{activeGuide.guides?.fleet_assigned}</p>
                   </div>
                </div>
                <button onClick={() => setActiveGuideId(null)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 transition-colors">
                   <Activity className="w-4 h-4" />
                </button>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-2 mb-2">
                      <Battery className={`w-3.5 h-3.5 ${activeGuide.battery_level < 20 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
                      <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Battery</span>
                   </div>
                   <p className="text-lg font-black text-white italic">{activeGuide.battery_level}%</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-2 mb-2">
                      <Signal className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Scout Signal</span>
                   </div>
                   <p className="text-lg font-black text-white italic">Strong</p>
                </div>
             </div>

             <div className="flex items-center justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest px-2">
                <span className="flex items-center gap-2"><Navigation className="w-3 h-3" /> ${activeGuide.lat.toFixed(4)}, ${activeGuide.lng.toFixed(4)}</span>
                <span>Active 2m ago</span>
             </div>
          </div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 right-6">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-col gap-2">
           <button onClick={() => map.current?.zoomIn()} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary hover:text-black text-white transition-all flex items-center justify-center font-black text-xl">+</button>
           <button onClick={() => map.current?.zoomOut()} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary hover:text-black text-white transition-all flex items-center justify-center font-black text-xl">-</button>
        </div>
      </div>
    </div>
  );
}

const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>; // Simplified for now since we're using tailwind animate-in
};
