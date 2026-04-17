"use client";

import { useTransition, useState, useEffect } from "react";
import { Megaphone, Plus, Power, AlertTriangle, Tag, Loader2 } from "lucide-react";
import { getNotices, createNotice, toggleNotice } from "@/app/actions/notices";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [previewMessage, setPreviewMessage] = useState("");
  const [previewType, setPreviewType] = useState<"info" | "discount" | "alert">("info");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    const res = await getNotices();
    if (res.error === 'needs_migration') setNeedsMigration(true);
    else setNotices(res.data);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("type", previewType); // Use state value
      const res = await createNotice(formData);
      if (res.success) {
        loadNotices();
        (e.target as HTMLFormElement).reset();
        setPreviewMessage("");
      } else {
        alert("Error: " + res.error);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggle = async (id: string, currentlyActive: boolean) => {
    startTransition(async () => {
      await toggleNotice(id, !currentlyActive);
      loadNotices();
    });
  };

  const bgColors = {
    info: "bg-blue-600",
    discount: "bg-gradient-to-r from-[#166534] to-emerald-600",
    alert: "bg-gradient-to-r from-red-600 to-rose-700"
  };

  const icons = {
    info: <Megaphone className="w-4 h-4 text-white" />,
    discount: <Tag className="w-4 h-4 text-white" />,
    alert: <AlertTriangle className="w-4 h-4 text-white" />
  };

  if (needsMigration) {
    return (
      <div className="p-12 text-center max-w-2xl mx-auto mt-20 bg-red-500/10 border border-red-500/30 rounded-3xl">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-white mb-4">Database Migration Required</h2>
        <p className="text-white/70">
          The <code>company_notices</code> table does not exist yet. Please run the SQL migration snippet in your Supabase dashboard to enable the live notices feature!
        </p>
      </div>
    );
  }

  const [isLiveEnabled, setIsLiveEnabled] = useState(true);

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto min-h-screen mb-32">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center shadow-lg">
          <Megaphone className="text-black w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase">Global Broadcast Control</h1>
          <p className="text-foreground/50 text-[10px] font-black uppercase tracking-widest mt-1">Direct communication with all active explorers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white rounded-[2rem] border border-foreground/10 p-8 shadow-sm relative overflow-hidden h-fit">
            <h3 className="text-xl font-black text-foreground mb-8 flex items-center gap-2">
              <Plus className="w-6 h-6 text-primary" /> Deploy Notice
            </h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-2 ml-1">Message Body *</label>
                <textarea 
                  name="message" 
                  required 
                  value={previewMessage}
                  onChange={(e) => setPreviewMessage(e.target.value)}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-5 text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm h-32 resize-none font-medium"
                  placeholder="E.g. The Great Migration has begun! Special discounts available now..."
                />
              </div>

              {/* SIMULATION PREVIEW - REPOSITIONED FOR VISIBILITY */}
              <div className="bg-foreground/[0.04] rounded-2xl border border-dashed border-foreground/10 p-5 space-y-3">
                 <div className="flex items-center justify-between">
                   <h4 className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em]">Live Web Simulator</h4>
                   <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                     <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                     <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                   </div>
                 </div>
                 
                 <div className="aspect-[16/4] bg-white rounded-xl border border-foreground/5 overflow-hidden relative shadow-lg scale-[1] transition-transform">
                    <div className="absolute top-0 left-0 right-0 h-6 bg-foreground/5 flex items-center px-3 gap-2 border-b border-foreground/5">
                       <div className="w-1.5 h-1.5 rounded-full bg-foreground/10" />
                       <div className="w-10 h-1.5 rounded-full bg-foreground/10" />
                    </div>
                    
                    {previewMessage ? (
                      <div className={`absolute top-6 left-0 right-0 ${bgColors[previewType]} py-2 px-3 flex items-center justify-between gap-2`}>
                        <div className="flex items-center gap-2 min-w-0">
                          {icons[previewType]}
                          <p className="text-[8px] md:text-[9px] text-white font-bold truncate leading-none">
                            {previewMessage}
                          </p>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center mt-4">
                        <p className="text-[9px] font-medium text-foreground/20 italic uppercase tracking-tighter">Draft Transmission...</p>
                      </div>
                    )}
                 </div>
              </div>
              
              <div>
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-3 ml-1">Transmission Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'info', label: 'General Info', color: 'bg-blue-600', sub: 'Standard' },
                    { id: 'discount', label: 'Promo', color: 'bg-emerald-600', sub: 'Offer' },
                    { id: 'alert', label: 'Alert', color: 'bg-red-600', sub: 'Urgent' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setPreviewType(type.id as any)}
                      className={`flex items-center gap-2 p-3 rounded-2xl border transition-all text-left ${
                        previewType === type.id 
                          ? 'border-primary bg-primary/5 shadow-inner' 
                          : 'border-foreground/5 hover:border-foreground/10 bg-white'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${type.color} shrink-0 shadow-sm`} />
                      <div>
                        <div className={`text-[10px] font-black ${previewType === type.id ? 'text-foreground' : 'text-foreground/60'}`}>{type.label}</div>
                        <div className="text-[8px] font-bold text-foreground/30 uppercase tracking-tighter">{type.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl border border-foreground/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-foreground/60 uppercase tracking-widest">Live Transmission</span>
                  <span className="text-[8px] font-bold text-foreground/30 uppercase tracking-tighter">Broadcast immediately</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLiveEnabled(!isLiveEnabled)}
                  className={`w-12 h-6 rounded-full relative p-1 transition-colors duration-300 ${isLiveEnabled ? 'bg-primary' : 'bg-foreground/10'}`}
                >
                  <input type="checkbox" name="is_active" checked={isLiveEnabled} readOnly className="hidden" />
                  <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${isLiveEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isCreating}
                className="w-full mt-4 bg-primary text-black font-black py-4 rounded-full hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl shadow-primary/20 border border-primary/50 text-sm italic disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Broadcasting...
                  </>
                ) : (
                  "Broadcast Globally"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-end justify-between mb-8 px-2">
            <div>
              <h3 className="text-sm font-black text-foreground/30 uppercase tracking-[0.3em]">Broadcast Archive</h3>
              <p className="text-foreground/50 text-[10px] font-bold mt-1 uppercase tracking-widest">History of sent notices</p>
            </div>
            <div className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-1.5 rounded-full border border-primary/20">
               {notices.length} Recorded Transmissions
            </div>
          </div>

          <div className="space-y-4">
            {notices.length === 0 ? (
               <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-foreground/10 shadow-sm flex flex-col items-center justify-center">
                 <div className="w-20 h-20 rounded-full bg-foreground/[0.02] flex items-center justify-center mb-6">
                   <Megaphone className="w-10 h-10 text-foreground/10" />
                 </div>
                 <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs italic">Silence in the plains... No broadcasts recorded.</p>
               </div>
            ) : notices.map(notice => (
               <div key={notice.id} className={`flex items-center justify-between p-8 rounded-[2.5rem] border transition-all duration-500 group ${notice.is_active ? 'bg-primary/5 border-primary/40 shadow-xl shadow-primary/5' : 'bg-white border-foreground/10 hover:border-foreground/20 hover:shadow-md'}`}>
                <div className="flex-1 mr-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full shadow-sm border ${
                      notice.type === 'alert' ? 'bg-red-500 text-white border-red-400' : 
                      notice.type === 'discount' ? 'bg-[#166534] text-white border-[#1a5d34]' : 
                      'bg-blue-600 text-white border-blue-500'
                    }`}>
                       {notice.type}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-foreground/20" />
                    <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{new Date(notice.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <p className="text-foreground text-lg font-black tracking-tight leading-relaxed italic">"{notice.message}"</p>
                </div>
                
                <button 
                  onClick={() => handleToggle(notice.id, notice.is_active)}
                  disabled={isPending}
                  className={`flex flex-col items-center justify-center w-20 h-20 rounded-[1.5rem] shrink-0 transition-all duration-700 ${notice.is_active ? 'bg-primary text-black shadow-2xl shadow-primary/40 rotate-12 scale-110' : 'bg-foreground/[0.03] text-foreground/20 border border-foreground/5 hover:text-foreground/60 hover:bg-foreground/5 hover:rotate-3'}`}
                >
                  <Power className={`w-8 h-8 mb-1.5 ${notice.is_active ? 'animate-pulse' : ''}`} />
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none shrink-0 italic">
                    {notice.is_active ? 'LIVE' : 'IDLE'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
