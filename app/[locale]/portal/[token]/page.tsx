"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Globe, Send, Map as MapIcon, CreditCard, ShieldCheck, RefreshCw } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function GuestPortalPage() {
  const params = useParams();
  const token = params.token as string;
  const [inquiry, setInquiry] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchInquiry();
  }, [token]);

  useEffect(() => {
    if (!inquiry) return;

    // Presence Pulse: Let the Admin Terminal know we're active
    // This allows the concierge to see if the customer is already online
    const heartbeat = setInterval(() => {
      supabase.rpc('explorer_heartbeat', { inquiry_id_param: inquiry.id });
    }, 45000);

    // Live Relay: Subscribe to new messages for this inquiry
    const channel = supabase
      .channel(`portal_messages_${inquiry.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `inquiry_id=eq.${inquiry.id}`
      }, (payload) => {
        setMessages(prev => {
          if (prev.some(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      clearInterval(heartbeat);
    };
  }, [inquiry?.id]);

  const fetchInquiry = async () => {
    const { data } = await supabase
      .from("inquiries")
      .select("*")
      .eq("access_token", token)
      .single();
    
    if (data) {
      setInquiry(data);
      fetchMessages(data.id);
    }
    setLoading(false);
  };

  const fetchMessages = async (id: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("inquiry_id", id)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  };

  const handleSend = async () => {
    if (!text.trim() || !inquiry) return;
    const { error } = await supabase
      .from("messages")
      .insert([{ inquiry_id: inquiry.id, text, sender: 'client' }]);
    
    if (!error) {
      // Increment unread count for admin
      const { error: rpcError } = await supabase.rpc('increment_unread_count', { inquiry_id_param: inquiry.id });
      if (rpcError) console.error("HUD Pulse Error:", rpcError);
      
      setText("");
      fetchMessages(inquiry.id);
    } else {
      alert("Terminal Signal Error: " + error.message);
    }
  const handleAuthorize = async () => {
    if (!inquiry) return;
    setLoading(true);
    const { confirmInquiry } = await import("@/app/actions/bookings");
    const res = await confirmInquiry(inquiry.id);
    if (res.success) {
      fetchInquiry(); // Refresh state
      alert("EXPEDITION AUTHORIZED: Your dossier has been officially confirmed. Check your email for next steps.");
    } else {
      alert("Authorization Link Error: " + res.error);
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary font-black animate-pulse uppercase tracking-[0.5em]">Initializing Terminal...</div>;
  if (!inquiry) return <div className="min-h-screen bg-black flex items-center justify-center text-white/50 italic">Invalid access token. Contact your concierge.</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans pb-20">
      {/* HUD Header */}
      <div className="bg-black text-white p-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/40">
                <Globe className="text-primary w-5 h-5" />
             </div>
             <div>
                <h1 className="text-sm font-black uppercase tracking-[0.3em]">Asili Yetu</h1>
                <p className="text-[10px] text-white/40 uppercase font-bold">Explorer Terminal • {inquiry.client_name}</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
             <span className="text-[10px] uppercase font-black tracking-widest text-primary">Status: {inquiry.status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Itinerary Column */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-6">
               <MapIcon className="w-5 h-5 text-primary" />
               <h2 className="text-xl font-black uppercase tracking-tight italic">Your Expedition Strategy</h2>
            </div>
            
            {inquiry.itinerary_details ? (
              <div className="bg-white rounded-3xl border border-black/5 p-8 shadow-sm">
                <h3 className="text-2xl font-black mb-4 text-black italic leading-tight">{inquiry.itinerary_details.recommendedTitle}</h3>
                <p className="text-black/60 leading-relaxed mb-8">{inquiry.itinerary_details.strategy || inquiry.itinerary_details.rationale}</p>
                
                <div className="space-y-6">
                  {inquiry.itinerary_details.dailyBreakdown?.map((day: any, i: number) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-black italic shrink-0 group-hover:scale-110 transition-transform">
                        {day.day}
                      </div>
                      <div className="pt-2">
                        <p className="text-sm font-bold text-black group-hover:text-primary transition-colors">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-black/5 p-8 text-center">
                 <p className="italic text-black/40">Your custom itinerary is being drafted by our rangers. Check back shortly.</p>
              </div>
            )}
          </section>

          {inquiry.quoted_price > 0 && inquiry.status !== 'confirmed' && (
            <section className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-10 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all" />
               <div className="relative z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Financial Authorization Required</h3>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-3 text-black">
                       <span className="text-6xl font-black italic tracking-tighter">$ {(inquiry.quoted_price * (inquiry.party_size || 1)).toLocaleString()}</span>
                       <span className="text-sm font-black uppercase tracking-widest opacity-30 italic">USD Total</span>
                    </div>
                    {inquiry.party_size > 1 && (
                      <p className="text-xs font-bold text-black/40 uppercase tracking-widest">
                        Based on <span className="text-black">${inquiry.quoted_price.toLocaleString()}</span> per person for <span className="text-black">{inquiry.party_size} guests</span>
                      </p>
                    )}
                  </div>
               </div>
               <button 
                onClick={handleAuthorize}
                className="relative z-10 w-full lg:w-auto px-12 py-6 bg-black text-white font-black uppercase tracking-[0.2em] text-xs skew-x-[-10deg] hover:bg-primary hover:text-black hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:shadow-primary/20"
               >
                 Authorize Expedition
               </button>
            </section>
          )}

          {inquiry.status === 'confirmed' && (
            <section className="bg-green-50 border border-green-100 rounded-[2.5rem] p-10 flex items-center gap-6 shadow-sm">
               <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                  <ShieldCheck className="text-white w-8 h-8" />
               </div>
               <div>
                  <h3 className="text-lg font-black uppercase tracking-tight italic">Expedition Confirmed</h3>
                  <p className="text-sm text-green-700 font-medium">Your voyage has been officially authorized. Logistics and fleet preparation are in progress.</p>
               </div>
            </section>
          )}
        </div>

        {/* Chat Column */}
        <div className="space-y-6">
           <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                 <Globe className="w-5 h-5 text-primary" />
                 <h2 className="text-xl font-black uppercase tracking-tight italic">Signal Terminal</h2>
               </div>
               <button 
                 onClick={() => inquiry && fetchMessages(inquiry.id)}
                 className="p-2 hover:bg-black/5 rounded-xl transition-all"
                 title="Refresh Signals"
               >
                 <RefreshCw className="w-4 h-4 text-black/30" />
               </button>
           </div>
           
           <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden flex flex-col h-[600px]">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-30">
                    <ShieldCheck className="w-10 h-10 mb-4" />
                    <p className="text-xs font-bold uppercase leading-relaxed font-mono">End-to-end encrypted connection established with Arusha Command.</p>
                  </div>
                ) : messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                      m.sender === 'client' 
                        ? 'bg-black text-white font-medium rounded-tr-none' 
                        : 'bg-[#f4f4f4] text-black font-medium rounded-tl-none border border-black/5 shadow-sm'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-[#fafafa] border-t border-black/5 flex gap-2">
                <input 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Signal my concierge..."
                  className="flex-1 bg-white border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
                <button 
                  onClick={handleSend}
                  className="w-12 h-12 bg-black rounded-xl flex items-center justify-center hover:bg-primary transition-colors hover:scale-105"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
           </div>
           <p className="text-[10px] text-center text-black/30 font-bold uppercase tracking-widest px-8">Direct high-fidelity communication with your private concierge team.</p>
        </div>
      </div>
    </div>
  );
}
