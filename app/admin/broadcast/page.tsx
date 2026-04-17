"use client";

import { useState, useEffect } from "react";
import { getNewsletterSubscribers, broadcastNewsletter } from "@/app/actions/newsletter";
import { Users, Send, CheckCircle2, Loader2, Sparkles, Mail, ShieldCheck } from "lucide-react";

export default function BroadcastTerminal() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    subject: "The Great Migration: Live Updates",
    title: "The Savvanah Signal",
    message: "The herds are moving north. New opportunities for elite safaris have emerged in the Serengeti..."
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    const res = await getNewsletterSubscribers();
    if (res.subscribers) {
      setSubscribers(res.subscribers);
      setCount(res.count);
    }
    setLoading(false);
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(`Are you sure you want to dispatch this signal to ${count} explorers?`)) return;
    
    setSending(true);
    const res = await broadcastNewsletter(form.subject, form.title, form.message);
    setSending(false);
    
    if (res.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert("Broadcast Failure: " + res.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-8 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="text-primary w-5 h-5" />
                 </div>
                 <h1 className="text-3xl font-black uppercase tracking-tighter italic">Dispatch Terminal</h1>
              </div>
              <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Registry Mission Control • Asili Yetu HQ</p>
           </div>
           
           <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 bg-foreground/5 rounded-2xl flex items-center justify-center">
                 <Users className="text-black w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-1">Active Registry</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black italic">{loading ? "..." : count.toLocaleString()}</span>
                    <span className="text-xs font-bold text-black/40 uppercase">Explorers</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Compose Column */}
           <div className="lg:col-span-2">
              <div className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <Send className="w-64 h-64 -rotate-12" />
                 </div>

                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                       <Mail className="w-5 h-5 text-primary" />
                       <h2 className="text-xl font-black uppercase italic">Draft Expedition Signal</h2>
                    </div>

                    <form onSubmit={handleBroadcast} className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                             <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-3 px-2">Email Subject</label>
                             <input 
                               type="text"
                               value={form.subject}
                               onChange={e => setForm({...form, subject: e.target.value})}
                               className="w-full bg-foreground/5 border-none outline-none focus:ring-2 focus:ring-primary rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-black/20"
                               placeholder="Signal Subject..."
                             />
                          </div>
                          <div>
                             <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-3 px-2">Internal Title</label>
                             <input 
                               type="text"
                               value={form.title}
                               onChange={e => setForm({...form, title: e.target.value})}
                               className="w-full bg-foreground/5 border-none outline-none focus:ring-2 focus:ring-primary rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-black/20"
                               placeholder="Expedition Title..."
                             />
                          </div>
                       </div>

                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-3 px-2">Expedition Message (HTML Supported)</label>
                          <textarea 
                            rows={10}
                            value={form.message}
                            onChange={e => setForm({...form, message: e.target.value})}
                            className="w-full bg-foreground/5 border-none outline-none focus:ring-2 focus:ring-primary rounded-[2rem] p-8 text-sm font-medium leading-relaxed placeholder:text-black/20 resize-none"
                            placeholder="Draft your signal to the wild..."
                          />
                       </div>

                       <div className="pt-4">
                          <button 
                            disabled={sending || count === 0}
                            className="w-full h-20 bg-black text-primary font-black uppercase tracking-[0.3em] text-xs rounded-[2rem] hover:bg-primary hover:text-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-4 disabled:opacity-50"
                          >
                             {sending ? (
                               <><Loader2 className="w-5 h-5 animate-spin" /> Transmitting Signal...</>
                             ) : success ? (
                               <><CheckCircle2 className="w-5 h-5" /> Dispatch Successful</>
                             ) : (
                               <><Send className="w-5 h-5" /> Dispatch to {count} Explorers</>
                             )}
                          </button>
                       </div>
                    </form>
                 </div>
              </div>
           </div>

           {/* Live Feed / Audit Column */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <ShieldCheck className="w-5 h-5 text-primary" />
                 <h2 className="text-xl font-black uppercase italic">Registry Log</h2>
              </div>
              
              <div className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm min-h-[400px]">
                 {loading ? (
                   <div className="h-40 flex items-center justify-center text-black/20 animate-pulse font-black uppercase text-xs tracking-widest">Auditing Registry...</div>
                 ) : subscribers.length === 0 ? (
                   <div className="h-40 flex flex-col items-center justify-center text-center opacity-30">
                      <Users className="w-10 h-10 mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">The Registry is Empty</p>
                   </div>
                 ) : (
                   <div className="space-y-3">
                      {subscribers.slice(0, 10).map((sub, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl hover:bg-foreground/[0.08] transition-colors border border-transparent hover:border-black/5">
                           <div className="flex flex-col">
                              <span className="text-xs font-black italic">{sub.email}</span>
                              <span className="text-[9px] font-black uppercase text-black/30 tracking-widest">{new Date(sub.created_at).toLocaleDateString()} • {sub.locale}</span>
                           </div>
                           <div className="w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                      ))}
                      {count > 10 && (
                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-black/20 pt-4">And {count - 10} others...</p>
                      )}
                   </div>
                 )}
              </div>
              
              <div className="p-8 bg-black rounded-[2.5rem] text-white">
                 <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Tactical Advice</h4>
                 <p className="text-[11px] font-medium leading-loose opacity-60">
                    High-fidelity dispatching works best on Tuesday mornings. Ensure your "Expedition Title" is short, evocative, and action-oriented to maximize your signal-to-noise ratio.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
