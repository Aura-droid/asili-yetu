"use client";

import React from "react";
import { ShieldCheck, Zap, Radio, UserCheck, Clock, Navigation } from "lucide-react";

interface RangerStatus {
  guide_id: string;
  status: string;
  is_offline: boolean;
  guides: {
    name: string;
    image_url?: string;
    fleet_assigned?: string;
  };
  lat: number;
  lng: number;
}

export default function RangerStatusClient({ rangers }: { rangers: RangerStatus[] }) {
  const onMission = rangers.filter(r => r.status === 'On Mission');
  const idle = rangers.filter(r => r.status === 'Idle');

  return (
    <div className="bg-white rounded-[3rem] p-10 border border-black/5 shadow-sm">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-foreground leading-none">Ranger <span className="text-primary">Registry</span></h2>
          <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.4em] mt-2">Active Field Personnel</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase text-primary">{onMission.length} On Mission</span>
          </div>
          <div className="px-4 py-2 bg-foreground/5 rounded-xl border border-foreground/10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black uppercase text-foreground/40">{idle.length} Idle</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {rangers.length > 0 ? rangers.map((ranger) => (
          <div 
            key={ranger.guide_id}
            className={`p-6 rounded-[2rem] border transition-all flex items-center gap-6 group hover:scale-[1.01] ${
              ranger.status === 'On Mission' 
                ? 'bg-primary/5 border-primary/20' 
                : 'bg-foreground/[0.02] border-foreground/5'
            }`}
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                {ranger.guides.image_url ? (
                  <img src={ranger.guides.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-foreground/5 flex items-center justify-center font-black text-foreground/20 text-lg italic uppercase">
                    {ranger.guides.name.substring(0, 2)}
                  </div>
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                ranger.status === 'On Mission' ? 'bg-primary' : 'bg-amber-500'
              }`}>
                {ranger.status === 'On Mission' ? <Zap className="w-2.5 h-2.5 text-black" /> : <Clock className="w-2.5 h-2.5 text-white" />}
              </div>
            </div>

            <div className="flex-1 min-w-0">
               <h4 className="font-black text-foreground text-lg italic tracking-tight leading-none mb-1">{ranger.guides.name}</h4>
               <p className="text-[9px] font-black text-foreground/30 uppercase tracking-widest flex items-center gap-2">
                 {ranger.guides.fleet_assigned || "Unassigned"}
                 {ranger.is_offline && <span className="opacity-50">• Offline</span>}
               </p>
            </div>

            <div className="text-right">
               <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                 ranger.status === 'On Mission' ? 'text-primary' : 'text-foreground/20'
               }`}>
                 {ranger.status}
               </p>
               <div className="flex items-center gap-2 justify-end text-[9px] font-bold text-foreground/40 italic">
                  <Navigation className="w-3 h-3" />
                  {ranger.lat.toFixed(3)}, {ranger.lng.toFixed(3)}
               </div>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center bg-foreground/[0.02] rounded-[3rem] border border-dashed border-foreground/10">
             <Radio className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
             <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest italic">No rangers currently integrated with Savannah-Eye.</p>
          </div>
        )}
      </div>
    </div>
  );
}
