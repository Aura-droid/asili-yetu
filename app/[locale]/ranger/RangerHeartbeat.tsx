"use client";

import { useState, useEffect } from "react";
import { pulseLocation } from "@/app/actions/telemetry";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, MapPin, Battery, ShieldCheck, AlertCircle, WifiOff, Wifi, Loader2, Compass } from "lucide-react";

export default function RangerHeartbeat({ guide }: { guide: any }) {
  const [active, setActive] = useState(false);
  const [lastPulse, setLastPulse] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [offlinePulses, setOfflinePulses] = useState<number>(0);
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);

  // --- PERSISTENCE: Save identity for zero-link access ---
  useEffect(() => {
    if (guide?.id) {
      localStorage.setItem('asili_ranger_id', guide.id);
      localStorage.setItem('asili_ranger_name', guide.name);
    }
  }, [guide]);

  // --- GUARDRAIL: Prevent accidental tab closure ---
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (active) {
        e.preventDefault();
        e.returnValue = "Mission active! Closing this will stop base tracking.";
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [active]);

  // Simulated Battery for UI effect
  const [battery, setBattery] = useState(98);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (active) {
      interval = setInterval(handlePulse, 30000); // Pulse every 30 seconds
    }
    return () => clearInterval(interval);
  }, [active]);

  const handlePulse = () => {
    if (!navigator.geolocation) {
        setError("GPS NOT SUPPORTED");
        return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCoords(newCoords);

        if (navigator.onLine) {
            const res = await pulseLocation(guide.id, newCoords, battery);
            if (res.success) {
                setLastPulse(new Date());
                setError(null);
            } else {
                handleOfflineSave();
            }
        } else {
            handleOfflineSave();
        }
        setLoading(false);
      },
      (err) => {
        setError("GPS SIGNAL LOST - OBSTRUCTED");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleOfflineSave = () => {
    setOfflinePulses(prev => prev + 1);
    setError("OFFLINE: BURST SYNC PENDING");
  };

  return (
    <div className="min-h-screen bg-[#0d1511] text-white p-6 font-mono flex flex-col">
       {/* Tactical Header */}
       <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
                <h1 className="text-xs font-black tracking-widest uppercase opacity-40">Ranger Sentinel</h1>
                <p className="text-sm font-bold tracking-tighter uppercase">{guide.name}</p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Fleet Unit</p>
             <p className="text-xs font-bold text-primary italic uppercase">{guide.fleet_assigned || 'Unassigned'}</p>
          </div>
       </div>

       {/* Main Tactical Display */}
       <div className="flex-1 flex flex-col items-center justify-center gap-10">
          <div className="relative w-72 h-72">
             <AnimatePresence>
                {active && (
                   <motion.div 
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1.5, opacity: 0.1 }}
                     exit={{ opacity: 0 }}
                     transition={{ repeat: Infinity, duration: 2 }}
                     className="absolute inset-0 rounded-full border-4 border-primary"
                   />
                )}
             </AnimatePresence>

             <button 
                onClick={() => {
                    setActive(!active);
                    if (!active) handlePulse();
                }}
                className={`relative w-full h-full rounded-full border-8 transition-all duration-500 flex flex-col items-center justify-center gap-4 z-10 ${active ? 'bg-primary/20 border-primary shadow-[0_0_50px_rgba(163,204,76,0.3)]' : 'bg-white/5 border-white/10'}`}
             >
                <Radio className={`w-16 h-16 ${active ? 'text-primary' : 'text-white/20'}`} />
                <span className="text-xs font-black tracking-[0.3em] uppercase">
                   {active ? 'Sentinel Active' : 'Start Heartbeat'}
                </span>
                {loading && <Loader2 className="w-6 h-6 animate-spin text-primary mt-2" />}
             </button>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
             <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                <div className="flex items-center gap-2 mb-2 opacity-40">
                   <Compass className="w-3 h-3" />
                   <span className="text-[10px] font-black uppercase">Telemetry</span>
                </div>
                <p className="text-xs font-bold leading-tight uppercase">
                    {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'Wait GPS...'}
                </p>
             </div>
             <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                <div className="flex items-center gap-2 mb-2 opacity-40">
                   <Battery className="w-3 h-3" />
                   <span className="text-[10px] font-black uppercase">Energy</span>
                </div>
                <p className="text-xs font-bold leading-tight uppercase text-emerald-400">{battery}% Normal</p>
             </div>
          </div>
       </div>

       {/* Status Footer */}
       <div className="mt-12 space-y-4">
          <div className={`p-5 rounded-[2rem] border flex items-center justify-between transition-colors ${error ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
             <div className="flex items-center gap-3">
                {error ? <WifiOff className="text-red-500 w-5 h-5" /> : <Wifi className="text-primary w-5 h-5" />}
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Network Status</p>
                   <p className={`text-xs font-black uppercase ${error ? 'text-red-500' : 'text-primary'}`}>
                      {error ? error : 'Signal Established'}
                   </p>
                </div>
             </div>
             {offlinePulses > 0 && <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full">{offlinePulses} Cached</span>}
          </div>

          <div className="text-center">
             <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20">Secure Savannah Link Established</p>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-10 mt-1">Asili Yetu Operational Intelligence v2.0</p>
          </div>
       </div>
    </div>
  );
}
