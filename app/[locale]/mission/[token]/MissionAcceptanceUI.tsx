"use client";

import { useState, useEffect } from "react";
import { claimMission } from "@/app/actions/missions";
import { 
  Users, Clock, Zap, ChevronRight, Briefcase, Map,
  AlertCircle, Activity, Phone, MessageSquare, ShieldCheck, Loader2
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
  const inquiry = mission.inquiry; 
  
  // High-Fidelity Itinerary Extraction Pulse
  let details = inquiry?.itinerary_details;
  if (typeof details === 'string') {
    try { details = JSON.parse(details); } catch(e) { details = {}; }
  }
  
  const itinerary = details?.dailyBreakdown || details?.itinerary || details?.days || (Array.isArray(details) ? details : []);

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
       // Save 'Ranger Key' to device for zero-link access later
       localStorage.setItem('asili_ranger_id', selectedGuideId);
       window.location.reload(); 
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
          <Image src="/logo.png" alt="Asili Yetu" width={80} height={80} className="mb-6 drop-shadow-[0_0_20_rgba(163,204,76,0.3)]" />
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Ranger <span className="text-primary">Dispatch</span></h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Mission Sentinel V2.4</p>
       </div>

       {/* Briefing Card */}
       <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 mb-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          
          <div className="relative z-10 space-y-6">
             <div className="flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-widest italic">
                <Zap className="w-4 h-4" /> Priority Expedition Briefing
             </div>

             <h2 className="text-3xl font-black leading-tight tracking-tighter italic">
                {inquiry?.itinerary_details?.recommendedTitle || "Custom Safari"}
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
                   <p className="text-xs font-bold truncate">{inquiry?.client_name || "Confidential"}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                   <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Status</p>
                   <p className={`text-xs font-black uppercase italic ${isAccepted ? 'text-green-400' : 'text-primary animate-pulse'}`}>
                      {mission.status}
                   </p>
                </div>
             </div>

             {isAccepted && (
                <div className="bg-green-500/10 border border-green-500/30 p-5 rounded-2xl flex items-center gap-4 text-green-400">
                   <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Assigned Ranger</p>
                      <p className="font-black text-lg italic leading-none">{mission.guides?.name || "Active Ranger"}</p>
                   </div>
                </div>
             )}
          </div>
       </div>

       {/* CREW MANIFEST: GUEST INTEL */}
       <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 ml-4 mb-4">
             <Users className="w-4 h-4 text-primary" />
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] leading-none">Crew Manifest</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8">
             <div className="grid grid-cols-2 gap-6">
                <div>
                   <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Headcount</p>
                   <p className="text-xl font-black italic">{mission.inquiry?.party_size || "1"} Explorers</p>
                </div>
                <div>
                   <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Dietary Alert</p>
                   <p className={`text-sm font-black italic ${mission.inquiry?.special_requests ? 'text-amber-400' : 'text-white/40'}`}>
                      {mission.inquiry?.special_requests || "Standard Provisioning"}
                   </p>
                </div>
             </div>

             <div className="pt-6 border-t border-white/5 space-y-4">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Field Communications</p>
                <div className="grid grid-cols-1 gap-3">
                   {mission.inquiry?.client_phone ? (
                      <div className="flex gap-2">
                         <a 
                            href={`tel:${mission.inquiry.client_phone}`}
                            className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
                         >
                            <Phone className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Signal Base</span>
                         </a>
                         <a 
                            href={`https://wa.me/${mission.inquiry.client_phone.replace(/\D/g, '')}`}
                            target="_blank"
                            className="flex-1 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
                         >
                            <MessageSquare className="w-4 h-4 text-[#25D366]" />
                            <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
                         </a>
                      </div>
                   ) : (
                      <div className="p-4 bg-white/5 rounded-2xl text-center">
                         <p className="text-[9px] font-bold text-white/30 italic uppercase">Direct Signal Offline • Use Base Relay</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
       </div>

       {/* MISSION INTEL: ITINERARY */}
       <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 ml-4 mb-4">
             <Map className="w-4 h-4 text-primary" />
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] leading-none">Mission Route</p>
          </div>

          <div className="space-y-3">
             {itinerary.length > 0 ? itinerary.map((day: any) => (
                <div key={day.day} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex gap-4 items-start group hover:bg-white/5 transition-colors">
                   <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black italic text-primary shrink-0">
                      D{day.day}
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs font-black uppercase italic tracking-tighter">{day.destination}</p>
                      <p className="text-[10px] text-white/40 font-medium leading-relaxed italic">{day.accommodation}</p>
                   </div>
                </div>
             )) : (
                <div className="text-center py-6 bg-white/5 rounded-2xl border border-dashed border-white/10 italic text-white/20 text-xs uppercase tracking-widest font-black">
                   Consult base for real-time route telemetry.
                </div>
             )}
          </div>
       </div>

       {/* Action Section */}
       {!isAccepted ? (
          <div className="space-y-6">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2 italic">01. Identify Ranger</label>
                <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-64 pr-2">
                   {guides.filter(g => g.is_active).map(guide => (
                      <button 
                        key={guide.id}
                        onClick={() => setSelectedGuideId(guide.id)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          selectedGuideId === guide.id 
                            ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(163,204,76,0.3)] scale-[1.02]' 
                            : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                         <span className="font-black italic text-sm tracking-tight">{guide.name}</span>
                         {selectedGuideId === guide.id && <ChevronRight className="w-4 h-4" />}
                      </button>
                   ))}
                </div>
             </div>

             {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold flex items-center gap-3 italic">
                   <AlertCircle className="w-4 h-4" /> {error}
                </div>
             )}

             <button 
               onClick={handleClaim}
               disabled={loading}
               className="w-full bg-primary text-black py-6 rounded-[2rem] font-black uppercase text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 italic tracking-tighter"
             >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Briefcase className="w-6 h-6" />}
                Confirm Assignment
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
             <button onClick={() => window.close()} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline italic">Exit Sentinel</button>
          </div>
       )}
    </div>
  );
}
