"use client";

import React, { useState } from "react";
import { Zap, Radio, CheckCircle2, Loader2, ExternalLink, ShieldCheck } from "lucide-react";
import { signalGuides } from "@/app/actions/signals";
import { useLoading } from "@/providers/LoadingProvider";

interface MissionGuide {
  name?: string | null;
}

interface InquiryMission {
  status?: string | null;
  guides?: MissionGuide | null;
}

interface DispatchInquiry {
  id: string;
  missions?: InquiryMission[] | null;
}

export default function SentinelDispatch({ inquiry, onUpdate }: { inquiry: DispatchInquiry, onUpdate: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [signalStatus, setSignalStatus] = useState<'success' | 'error' | null>(null);
  const [waLink, setWaLink] = useState<string | null>(null);
  const { setIsLoading: setGlobalLoading } = useLoading();

  const activeMission = inquiry.missions?.find((mission) => mission.status === 'accepted');
  const isLocked = !!activeMission || signalStatus === 'success';

  const handleSignalGuides = async () => {
    setIsLoading(true);
    setGlobalLoading(true);
    setSignalStatus(null);
    setWaLink(null);

    // Defaulting to English portal for guides
    const res = await signalGuides(inquiry.id, 'en');
    setIsLoading(false);
    setGlobalLoading(false);

    if (res.success) {
      setSignalStatus('success');
      setWaLink(res.whatsappLink || null);
      if (onUpdate) onUpdate();
    } else {
      setSignalStatus('error');
    }
  };

  return (
    <div className="p-8 bg-foreground/[0.03] rounded-[2.5rem] border border-foreground/5 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-foreground italic tracking-tighter uppercase leading-none">Tour Guide <span className="text-primary">Sentinel</span></h3>
          <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.4em] mt-2">Field Mobilization Terminal</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Radio className="w-6 h-6 text-primary animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ACTION NODE */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] italic">01. Authorization Registry</p>

          <button
            onClick={handleSignalGuides}
            disabled={isLoading || isLocked}
            className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 transition-all ${isLocked
              ? 'bg-foreground/5 text-foreground/40 cursor-default border border-dashed border-foreground/10'
              : 'bg-primary text-black hover:scale-[1.02] active:scale-95 shadow-[0_15px_30px_rgba(163,204,76,0.3)]'
              }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : activeMission ? <ShieldCheck className="w-5 h-5" /> : <Zap className="w-5 h-5 fill-current" />}
            {activeMission ? `Tour Guide Locked: ${activeMission.guides?.name}` : signalStatus === 'success' ? 'Sentinel Record Primed' : 'Authorize Tour Guide Signal'}
          </button>

          {signalStatus === 'success' && (
            <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-2xl flex items-center gap-4 text-green-600 animate-in zoom-in duration-300">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Mission Briefing Character-Perfectly Stationed in Vault</p>
            </div>
          )}
        </div>

        {/* TRANSMISSION NODE */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] italic">02. Signal Dispatch</p>

          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(37,211,102,0.3)] hover:scale-[1.03] active:scale-95 transition-all text-center animate-bounce-subtle"
            >
              <ExternalLink className="w-5 h-5" />
              Launch Dispatch Signal
            </a>
          ) : (
            <div className="w-full py-6 rounded-2xl border border-dashed border-foreground/10 flex flex-col items-center justify-center text-center opacity-40 grayscale">
              <Loader2 className="w-6 h-6 mb-3 text-foreground/20" />
              <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Authorization</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-black/5 border border-black/5 rounded-3xl">
        <p className="text-[9px] font-bold text-foreground/40 leading-relaxed italic">
          <b>Tour Guide Protocol:</b> Authorizing the signal registers a secure mission token in the Sentinel Database.
          The Tour Guides will receive a unique cryptographic link to the mission briefing where they can accept the expedition
          with first-strike protection.
        </p>
      </div>
    </div>
  );
}
