"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Pin, Trash2, Plus, Info, Search, Loader2 } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface RoutePoint {
  day: number;
  destination: string;
  accommodation: string;
  lat: number;
  lng: number;
}

interface AdminRouteMapProps {
  points: RoutePoint[];
  onChange: (points: RoutePoint[]) => void;
}

export default function AdminRouteMap({ points, onChange }: AdminRouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const resp = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=TZ&limit=5&proximity=34.9,-2.3`
      );
      const data = await resp.json();
      setSearchResults(data.features || []);
    } catch (e) {
      console.error("Scout Signal Error:", e);
    }
    setIsSearching(false);
  };

  const flyToResult = (result: any) => {
    if (!map.current) return;
    const [lng, lat] = result.center;
    map.current.flyTo({
      center: [lng, lat],
      zoom: 14,
      essential: true
    });
    setSearchResults([]);
    setSearchQuery("");
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [34.9, -2.3], // Central Serengeti focus
      zoom: 6,
    });

    map.current.on('load', () => setMapLoaded(true));

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      onChange((prev: any) => [...prev, {
        day: (prev?.length || 0) + 1,
        destination: `Expedition Point ${(prev?.length || 0) + 1}`,
        accommodation: "Unnamed Lodge",
        lat,
        lng
      }]);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [onChange]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Draw route line
    const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': points.map(p => [p.lng, p.lat])
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
            'coordinates': points.map(p => [p.lng, p.lat])
          }
        }
      });

      map.current.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': { 'line-join': 'round', 'line-cap': 'round' },
        'paint': { 'line-color': '#a3cc4c', 'line-width': 4, 'line-dasharray': [2, 1] }
      });
    }

    // Update Markers
    markers.current.forEach(m => m.remove());
    markers.current = [];

    points.forEach((p, idx) => {
      const el = document.createElement('div');
      el.className = 'admin-marker';
      el.innerHTML = `<div style="background: #000; color: #fff; padding: 4px 8px; border-radius: 6px; font-weight: 900; font-size: 8px; border: 1px solid #a3cc4c; white-space: nowrap;">Point ${p.day}</div>`;
      
      const m = new mapboxgl.Marker(el, { draggable: true })
        .setLngLat([p.lng, p.lat])
        .addTo(map.current!);

      m.on('dragend', () => {
        const { lng, lat } = m.getLngLat();
        const updated = [...points];
        updated[idx] = { ...updated[idx], lat, lng };
        onChange(updated);
      });

      markers.current.push(m);
    });

  }, [points, onChange, mapLoaded]);

  return (
    <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-foreground/10 group shadow-inner bg-foreground/5">
      <div ref={mapContainer} className="w-full h-full" />
      
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
         <div className="bg-black/90 backdrop-blur-xl px-4 py-2 rounded-xl text-white border border-white/20 pointer-events-auto shadow-2xl shrink-0">
            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#a3cc4c]">
               <Pin className="w-3 h-3" /> Charting Mode
            </h4>
         </div>

         {/* Expedition Scout Search */}
         <div className="mx-4 flex-1 max-w-sm pointer-events-auto relative group">
            <div className="relative">
               <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  {isSearching ? <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" /> : <Search className="w-3.5 h-3.5 text-white/30 group-focus-within:text-primary transition-colors" />}
               </div>
               <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Scout location... (Aim Mall)"
                  className="w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all shadow-2xl"
               />
            </div>

            {searchResults.length > 0 && (
               <div className="absolute top-full mt-2 w-full bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
                  {searchResults.map((res, i) => (
                     <button
                        key={i}
                        type="button"
                        onClick={() => flyToResult(res)}
                        className="w-full px-5 py-3.5 text-left hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors group"
                     >
                        <p className="text-[11px] font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{res.text}</p>
                        <p className="text-[9px] font-medium text-white/40 line-clamp-1">{res.place_name}</p>
                     </button>
                  ))}
               </div>
            )}
         </div>
         
         <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-foreground/10 shadow-xl pointer-events-auto shrink-0 hidden md:block">
             <p className="text-[8px] font-black uppercase text-foreground/40 leading-tight">
                Click map to append point.<br/>Drag pins to adjust path.
             </p>
         </div>
      </div>

      <div className="absolute bottom-4 left-4 flex gap-2 pointer-events-auto">
         {points.length > 0 && (
             <>
               <button 
                  type="button"
                  onClick={() => onChange(points.slice(0, -1))}
                  className="bg-black hover:bg-stone-900 text-[#a3cc4c] p-3 rounded-xl shadow-xl transition-all active:scale-90 border border-white/20 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                  title="Undo last point"
               >
                  Undo Point
               </button>
               <button 
                  type="button"
                  onClick={() => onChange([])}
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl shadow-xl transition-all active:scale-95 border border-white/20"
                  title="Clear Atlas"
               >
                  <Trash2 className="w-4 h-4" />
               </button>
             </>
         )}
      </div>
    </div>
  );
}
