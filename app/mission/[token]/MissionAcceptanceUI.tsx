"use client";

import { useState, useEffect } from "react";
import { claimMission } from "@/app/actions/missions";
import { 
  CheckCircle2, Loader2, ShieldCheck, MapPin, 
  Users, Clock, Zap, ChevronRight, Briefcase, Activity
} from "lucide-react";
import Image from "next/image";
import { useLoading } from "@/providers/LoadingProvider";
import { pulseLocation } from "@/app/actions/telemetry";

export default function MissionAcceptanceUI({ mission, guides }: { mission: any, guides: any[] }) {
  const [loading, setLoading] = useState(false);
  const [selectedGuideId, setSelectedGuideId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setIsLoading: setGlobalLoading } = useLoading();
  const [trackingStatus, setTrackingStatus] = useState<"idle" | "searching" | "pulsing" | "denied">("idle");

  const isAccepted = mission.status === 'accepted';

  const handleClaim = async () => {
    if (!selectedGuideId) {
      setError("Please identify yourself by selecting your name.");
      return;
    }

    setLoading(true);
    setGlobalLoading(true);
    setError(null);
    const res = await claimMission(mission.id, selectedGuideId);
    
    if (res.success) {
      window.location.reload(); // Refresh to show accepted state
    } else {
      setError(res.error || "Mission claim failed.");
    }
    setLoading(false);
    setGlobalLoading(false);
  };

  // --- THE HEARTBEAT (Telemetry Engine) ---
  useEffect(() => {
    if (!isAccepted || !mission.assigned_ranger_id) return;

    let watchId: number;

    const startHeartbeat = async () => {
      if ("geolocation" in navigator) {
        setTrackingStatus("searching");
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            setTrackingStatus("pulsing");
            const { latitude, longitude } = position.coords;
            
            // Get battery level if available
            let batteryLevel = 100;
            try {
               const battery: any = await (navigator as any).getBattery?.();
               if (battery) batteryLevel = Math.round(battery.level * 100);
            } catch (e) { /* Fallback */ }

            // Pulse to base
            await pulseLocation(mission.assigned_ranger_id, { 
               lat: latitude, 
               lng: longitude 
            }, batteryLevel);
          },
          (err) => {
            console.error("Signal Lost:", err.message);
            if (err.code === 1) setTrackingStatus("denied");
          },
          { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
        );
      }
    };

    startHeartbeat();

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isAccepted, mission.assigned_ranger_id]);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col pb-20 p-6 pt-12 text-white bg-[#0a0a0a]">
       {/* Identity Header */}
       <div className="flex flex-col items-center text-center mb-10">
          <Image src="/brand/logo-mark-no-bg.png" alt="Asili Yetu" width={80} height={80} className="mb-6 drop-shadow-[0_0_20px_rgba(163,204,76,0.3)]" />
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Ranger <span className="text-primary">Dispatch</span></h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Mission Sentinel V1.0</p>
       </div>

       {/* Briefing Card */}
       <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          
          <div className="relative z-10 space-y-6">
             <div className="flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-widest italic">
                <Zap className="w-4 h-4" /> Priority Expedition
             </div>

             <h2 className="text-3xl font-black leading-tight tracking-tighter italic">
                {mission.inquiry?.itinerary_details?.recommendedTitle || "Custom Safari"}
             </h2>

             {/* Signal Monitoring HUD */}
             {isAccepted && (
                <div className="flex items-center gap-4 bg-black/20 rounded-2xl p-4 border border-white/5">
                   <div className="relative">
                      <div className={`w-3 h-3 rounded-full ${
                        trackingStatus === 'pulsing' ? 'bg-primary' : 
                        trackingStatus === 'denied' ? 'bg-red-500' : 'bg-white/20'
                      } ${trackingStatus === 'pulsing' ? 'animate-pulse' : ''}`} />
                      {trackingStatus === 'pulsing' && (
                        <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping" />
                      )}
                   </div>
                   <div className="flex-1">
                      <p className="text-[8px] font-black uppercase text-white/30 tracking-widest leading-none mb-1">Telemetry Status</p>
                      <p className="text-[10px] font-bold uppercase tracking-tight">
                         {trackingStatus === 'idle' && "Establishing Uplink..."}
                         {trackingStatus === 'searching' && "Acquiring Satellites..."}
                         {trackingStatus === 'pulsing' && "Broadcasting Signal to Base"}
                         {trackingStatus === 'denied' && "GPS PERMISSION BLOCKED"}
                      </p>
                   </div>
                   {trackingStatus === 'pulsing' && <Activity className="w-4 h-4 text-primary animate-bounce" />}
                </div>
             )}

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                   <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Explorer</p>
                   <p className="text-xs font-bold truncate">{mission.inquiry?.client_name || "Guest"}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                   <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Status</p>
                   <p className={`text-xs font-black uppercase italic ${isAccepted ? 'text-green-400' : 'text-primary animate-pulse'}`}>
                      {mission.status}
                   </p>
                </div>
             </div>

             {isAccepted && (
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex items-center gap-4 text-green-400">
                   <ShieldCheck className="w-6 h-6" />
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none">Underway By</p>
                      <p className="font-black text-lg italic">{mission.guides?.name}</p>
                   </div>
                </div>
             )}
          </div>
       </div>

       {/* Action Section */}
       {!isAccepted ? (
          <div className="space-y-6">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Identify Ranger</label>
                <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-64 pr-2">
                   {guides.filter(g => g.is_active).map(guide => (
                      <button 
                        key={guide.id}
                        onClick={() => setSelectedGuideId(guide.id)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          selectedGuideId === guide.id 
                            ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(163,204,76,0.2)] scale-[1.02]' 
                            : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                         <span className="font-bold text-sm tracking-tight">{guide.name}</span>
                         {selectedGuideId === guide.id && <ChevronRight className="w-4 h-4" />}
                      </button>
                   ))}
                </div>
             </div>

             {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold flex items-center gap-3">
                   <Loader2 className="w-4 h-4 animate-spin" /> {error}
                </div>
             )}

             <button 
               onClick={handleClaim}
               disabled={loading}
               className="w-full bg-primary text-black py-6 rounded-[2rem] font-black uppercase text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
             >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Briefcase className="w-6 h-6" />}
                Claim Mission
             </button>
          </div>
       ) : (
          <div className="text-center py-10 space-y-6">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                <Clock className="w-10 h-10 text-white/20" />
             </div>
             <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2 leading-none">Stand Down</p>
                <p className="text-sm font-medium text-white/60">This mission is currently being undertaken. Await next signal from base.</p>
             </div>
             <button onClick={() => window.close()} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Exit Portal</button>
          </div>
       )}
    </div>
  );
}
