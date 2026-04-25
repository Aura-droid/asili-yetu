"use client";

import { useState, useEffect } from "react";
import { claimMission, completeMission } from "@/app/actions/missions";
import { 
  Users, Clock, Zap, ChevronRight, Briefcase, Map,
  AlertCircle, Activity, Phone, MessageSquare, ShieldCheck, Loader2,
  CheckCircle2, Flag
} from "lucide-react";
import Image from "next/image";
import { useLoading } from "@/providers/LoadingProvider";
import { pulseLocation } from "@/app/actions/telemetry";

import { useTranslations } from "next-intl";

  const [modal, setModal] = useState<{ 
    isOpen: boolean; 
    type: 'confirm' | 'error' | 'success'; 
    title: string; 
    message: string; 
    onConfirm?: () => void;
  }>({ isOpen: false, type: 'success', title: '', message: '' });

  const handleClaim = async () => {
    if (!selectedGuideId) {
       setModal({
         isOpen: true,
         type: 'error',
         title: 'Identity Required',
         message: 'Please identify yourself by selecting your name from the manifest before claiming this mission.'
       });
       return;
    }

    setLoading(true);
    setGlobalLoading(true);
    setError(null);
    const res = await claimMission(mission.id, selectedGuideId);
    
    if (res.success) {
       localStorage.setItem('asili_ranger_id', selectedGuideId);
       setModal({
         isOpen: true,
         type: 'success',
         title: 'Mission Accepted',
         message: 'The expedition dossier is now locked to your profile. Proceed with mission deployment.',
         onConfirm: () => window.location.reload()
       });
    } else {
       setModal({
         isOpen: true,
         type: 'error',
         title: 'Claim Interference',
         message: res.error || "A signal error occurred while claiming this mission. Please retry or contact base."
       });
    }
    setLoading(false);
    setGlobalLoading(false);
  };

  const handleComplete = async () => {
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Finalize Expedition?',
      message: 'Are you sure you want to finalize this mission? This will notify the base that the expedition is complete and your telemetry will be deactivated.',
      onConfirm: async () => {
        setLoading(true);
        setGlobalLoading(true);
        const res = await completeMission(mission.id);
        if (res.success) {
          window.location.reload();
        } else {
          setModal({
            isOpen: true,
            type: 'error',
            title: 'Finalization Error',
            message: res.error || "Failed to complete mission."
          });
        }
        setLoading(false);
        setGlobalLoading(false);
      }
    });
  }

  // --- THE HEARTBEAT (Telemetry Engine) ---
  // ... (keeping useEffect logic same)

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col pb-20 p-6 pt-12 text-white bg-[#0a0a0a]">
       {/* Identity Header */}
       <div className="flex flex-col items-center text-center mb-10">
          <Image src="/brand/logo-mark-no-bg.png" alt="Asili Yetu" width={80} height={80} className="mb-6 drop-shadow-[0_0_20_rgba(163,204,76,0.3)]" />
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{t("identify")} <span className="text-primary">{t("dispatch")}</span></h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-3">{t("version")}</p>
       </div>

       {/* Briefing Card */}
       {/* ... (rest of the UI) ... */}
       {/* (I'll skip to the end to add the modal JSX) */}
       
       {/* Sentinel Modal Overlay */}
       {modal.isOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="bg-[#111] rounded-[2.5rem] max-w-sm w-full p-10 text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-500">
               <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border ${
                 modal.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-500' : 
                 modal.type === 'confirm' ? 'bg-amber-500/20 border-amber-500/30 text-amber-500' :
                 'bg-primary/20 border-primary/30 text-primary'
               }`}>
                  {modal.type === 'error' ? <AlertCircle className="w-10 h-10" /> : 
                   modal.type === 'confirm' ? <Map className="w-10 h-10" /> :
                   <ShieldCheck className="w-10 h-10" />}
               </div>
               
               <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-3 text-white">{modal.title}</h2>
               <p className="text-white/40 leading-relaxed mb-10 text-sm font-medium italic">
                 {modal.message}
               </p>
               
               <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      if (modal.onConfirm) modal.onConfirm();
                      setModal(prev => ({ ...prev, isOpen: false }));
                    }}
                    className={`w-full py-5 font-black uppercase tracking-[0.2em] text-[10px] transition-all rounded-2xl shadow-xl ${
                      modal.type === 'error' ? 'bg-red-600 text-white hover:bg-red-500' :
                      'bg-primary text-black hover:scale-105'
                    }`}
                  >
                    {modal.type === 'confirm' ? 'Authorize Finalization' : 'Acknowledge Signal'}
                  </button>
                  {modal.type === 'confirm' && (
                    <button 
                      onClick={() => setModal(prev => ({ ...prev, isOpen: false }))}
                      className="w-full py-4 text-white/20 font-black uppercase tracking-[0.2em] text-[10px] hover:text-white/40 italic"
                    >
                      Abort Signal
                    </button>
                  )}
               </div>
            </div>
         </div>
       )}
    </div>
  );
}
