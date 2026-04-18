"use client";

import { useTransition, useState, useEffect } from "react";
import { Briefcase, AlertTriangle, ChevronDown, ChevronUp, Mail, Phone, Calendar, Save, MessageCircle, RefreshCw, Loader2 } from "lucide-react";
import { getInquiries, updateInquiryStatus, updateInquiryNotes, updateQuotedPrice, getMessages, sendMessage, clearUnreadCount, sendInvoiceEmail, updateInquiryDossier, sendSignalNotification, deleteInquiry } from "@/app/actions/bookings";
import QuickReplies from "@/components/QuickReplies";
import SentinelDispatch from "@/components/SentinelDispatch";
import { createClient } from "@/utils/supabase/client";
import { Send, FileText, Settings2, ShieldCheck, Map as MapIcon, Globe, CreditCard, Trash2, Zap, MessageSquare, DollarSign } from "lucide-react";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

const WhatsApp = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.559 4.191 1.62 6.004L0 24l6.135-1.61a11.83 11.83 0 005.911 1.586h.005c6.637 0 12.032-5.396 12.035-12.032a11.762 11.762 0 00-3.483-8.503z" />
  </svg>
);

function ChatTerminal({ inquiry, onNewMessage }: { inquiry: any, onNewMessage: () => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
    clearUnreadCount(inquiry.id);

    const channel = supabase
      .channel(`inquiry_messages_${inquiry.id}`)
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
        onNewMessage();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [inquiry.id]);

  const fetchMessages = async () => {
    setLoading(true);
    const res = await getMessages(inquiry.id);
    setMessages(res.data || []);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    const res = await sendMessage(inquiry.id, text, 'admin');
    if (res.success) {
      const sentText = text;
      setText("");
      fetchMessages();
      onNewMessage();
      sendSignalNotification(inquiry.id, sentText);
    }
  };

  const openDialer = () => {
    if (inquiry.client_phone) window.location.href = `tel:${inquiry.client_phone}`;
    else alert("No cellular signal registered for this explorer.");
  };

  const phone = inquiry.client_phone?.replace(/\D/g, '');
  const waPhone = phone?.startsWith('0') ? '255' + phone.substring(1) : phone;
  const waUrl = waPhone ? `https://wa.me/${waPhone}` : null;

  return (
    <div className="flex flex-col h-[600px] bg-white border border-foreground/10 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-foreground/10 bg-foreground/5 flex justify-between items-center">
        <div className="flex items-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest">
           <MessageCircle className="w-4 h-4 text-primary" />
           <span>Signal Terminal</span>
        </div>
        <div className="flex items-center gap-2">
           {waUrl ? (
             <a 
               href={waUrl} 
               target="_blank" 
               rel="noopener noreferrer"
               title="Launch WhatsApp Intelligence" 
               className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366]/20 transition-all border border-[#25D366]/10 active:scale-95"
             >
                <WhatsApp className="w-5 h-5" />
             </a>
           ) : (
             <button 
               onClick={() => alert("No valid phone intelligence found for this explorer.")}
               className="w-10 h-10 rounded-xl bg-foreground/5 text-foreground/20 flex items-center justify-center border border-foreground/10 cursor-not-allowed"
             >
                <WhatsApp className="w-5 h-5" />
             </button>
           )}
           <button 
             onClick={openDialer} 
             title="Cellular Uplink" 
             className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all border border-primary/20 active:scale-95"
           >
              <Phone className="w-5 h-5" />
           </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.sender === 'admin' ? 'bg-primary text-black font-bold' : 'bg-white text-foreground border border-foreground/10'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white border-t border-foreground/10 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary" />
        <button onClick={handleSend} className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center hover:scale-105 transition-all"><Send className="w-4 h-4 text-black" /></button>
      </div>
    </div>
  );
}

export default function AdminBookingsPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTabs, setActiveTabs] = useState<Record<string, 'dossier' | 'chat' | 'sentinel' | 'logistics'>>({});
  const [isPending, startTransition] = useTransition();
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [tabLoading, setTabLoading] = useState<string | null>(null);
  const [dispatchPending, setDispatchPending] = useState<string | null>(null);
  const [livePrice, setLivePrice] = useState<Record<string, number>>({});

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { loadInquiries(); }, []);

  const loadInquiries = async () => {
    const res = await getInquiries();
    if (res.error === 'needs_migration') setNeedsMigration(true);
    else setInquiries(res.data);
    setLoadingInitial(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const res = await deleteInquiry(deleteId);
    if (res.success) {
      setInquiries(inquiries.filter(i => i.id !== deleteId));
      setDeleteId(null);
    }
    setIsDeleting(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    startTransition(async () => {
      const res = await updateInquiryStatus(id, status);
      if (res.success) loadInquiries();
    });
  };

  const handlePriceUpdate = async (id: string, price: number) => {
    const res = await updateQuotedPrice(id, price);
    if (res.success) loadInquiries();
  };

  const handleSendInvoice = async (inquiry: any) => {
    setDispatchPending(inquiry.id);
    
    // Ensure the database is absolutely synced with the latest live price before dispatch
    const currentPrice = livePrice[inquiry.id] !== undefined ? livePrice[inquiry.id] : inquiry.quoted_price;
    if (livePrice[inquiry.id] !== undefined) {
      await updateQuotedPrice(inquiry.id, livePrice[inquiry.id]);
    }

    if (!currentPrice) {
      setDispatchPending(null);
      alert("Dispatch Aborted: No expedition value has been set.");
      return;
    }

    const res = await sendInvoiceEmail(inquiry.id, currentPrice);
    setDispatchPending(null);
    if (res.success) {
      alert(`Strategic Invoice Dispatched to ${inquiry.client_email}. Status updated to Quote Sent.`);
      loadInquiries();
    } else {
      alert(`Dispatch Failed: ${res.error}`);
    }
  };

  if (needsMigration) {
    return <div className="p-12 text-center text-white bg-red-500/10 rounded-3xl m-10 border border-red-500/20">Database Migration Needed</div>;
  }

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Concierge <span className="text-primary italic">CRM</span></h1>
          <p className="text-foreground/50 text-[10px] font-black uppercase tracking-[0.4em]">Operational Intelligence Ledger</p>
        </div>
        <button onClick={loadInquiries} className="flex items-center gap-2 px-6 py-4 bg-white border border-foreground/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all shadow-sm">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Signals
        </button>
      </div>

      <div className="space-y-4">
        {loadingInitial ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white/50 border border-black/5 p-8 rounded-3xl animate-pulse space-y-4">
               <div className="flex justify-between">
                  <div className="h-6 w-48 bg-foreground/5 rounded-lg" />
                  <div className="h-6 w-24 bg-foreground/5 rounded-full" />
               </div>
               <div className="h-4 w-full bg-foreground/5 rounded-md" />
            </div>
          ))
        ) : inquiries.length === 0 ? (
          <div className="text-center py-20 text-foreground/30 font-bold uppercase tracking-widest text-xs">No active signals found.</div>
        ) : inquiries.map((inquiry) => {
          const isExpanded = expandedId === inquiry.id;
          const status = inquiry.status || 'new';
          
          return (
            <div key={inquiry.id} className="bg-white rounded-2xl border border-foreground/10 overflow-hidden shadow-sm group">
              <div onClick={() => setExpandedId(isExpanded ? null : inquiry.id)} className="p-6 flex items-center justify-between cursor-pointer hover:bg-foreground/2">
                <div className="flex items-center gap-6">
                  <div>
                    <h3 className="font-bold text-foreground">{inquiry.client_name}</h3>
                    <p className="text-xs text-foreground/40">{inquiry.client_email}</p>
                  </div>
                  <div className="hidden md:block px-3 py-1 bg-foreground/5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                    {inquiry.itinerary_details?.recommendedTitle || "Custom Safari"}
                  </div>
                </div>
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(inquiry.id);
                        setDeleteTitle(inquiry.client_name);
                      }}
                      className="w-10 h-10 rounded-xl hover:bg-red-50 text-red-400 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-foreground/5 text-foreground/40'}`}>
                       {status.replace('_', ' ')}
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                 </div>
               </div>

              {isExpanded && (
                <div className="border-t border-foreground/10 bg-foreground/1">
                   <div className="flex border-b border-foreground/10 px-6">
                      {(['dossier', 'chat', 'sentinel', 'logistics'] as const).map((tab) => (
                        <button 
                          key={tab} 
                          onClick={() => {
                            setTabLoading(inquiry.id);
                            setTimeout(() => {
                              setActiveTabs({...activeTabs, [inquiry.id]: tab});
                              setTabLoading(null);
                            }, 400);
                          }} 
                          className={`py-4 px-6 text-[10px] font-black uppercase tracking-widest relative ${ (activeTabs[inquiry.id] || 'dossier') === tab ? 'text-primary' : 'text-foreground/30' }`}
                        >
                          {tab}
                          {(activeTabs[inquiry.id] || 'dossier') === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
                        </button>
                      ))}
                   </div>
                   <div className="p-8 min-h-[300px] relative">
                      {tabLoading === inquiry.id && (
                        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center animate-in fade-in duration-300">
                           <Loader2 className="w-8 h-8 text-primary animate-spin mb-3 opacity-40" />
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 italic">Opening Data Stream...</p>
                        </div>
                      )}
                      {(activeTabs[inquiry.id] || 'dossier') === 'sentinel' && <SentinelDispatch inquiry={inquiry} onUpdate={loadInquiries} />}
                      {(activeTabs[inquiry.id] || 'dossier') === 'chat' && <ChatTerminal inquiry={inquiry} onNewMessage={loadInquiries} />}
                      {(activeTabs[inquiry.id] || 'dossier') === 'dossier' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white p-4 rounded-xl border border-foreground/10"><p className="text-[10px] font-bold opacity-30 mb-1">Guests</p><p className="font-bold">{inquiry.party_size || 0}</p></div>
                             <div className="bg-white p-4 rounded-xl border border-foreground/10"><p className="text-[10px] font-bold opacity-30 mb-1">Dates</p><p className="font-bold">{inquiry.travel_dates || "Unspecified"}</p></div>
                          </div>
                          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                             <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Itinerary Strategy</p>
                             <p className="text-sm font-medium leading-relaxed italic">"{inquiry.itinerary_details?.strategy || inquiry.itinerary_details?.rationale || "Base strategy pending..."}"</p>
                          </div>
                        </div>
                      )}
                      {(activeTabs[inquiry.id] || 'dossier') === 'logistics' && (
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                             <p className="text-[10px] font-black opacity-30 uppercase mb-3">Expedition Value (Per Person)</p>
                             <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-primary transition-colors" />
                                <input 
                                  type="number"
                                  value={livePrice[inquiry.id] !== undefined ? livePrice[inquiry.id] : (inquiry.quoted_price || 0)}
                                  onChange={(e) => setLivePrice({...livePrice, [inquiry.id]: parseFloat(e.target.value) || 0})}
                                  onBlur={(e) => handlePriceUpdate(inquiry.id, parseFloat(e.target.value) || 0)}
                                  className="w-full bg-white border border-foreground/10 rounded-xl py-3 pl-10 pr-4 font-black text-xl outline-none focus:border-primary transition-all"
                                  placeholder="Set Agreed Price..."
                                />
                             </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <div className="bg-foreground/5 p-6 rounded-2xl flex-1 flex flex-col justify-center">
                                 <p className="text-[10px] font-black opacity-30 uppercase mb-1">Total Group Yield ({inquiry.party_size || 1} Guests)</p>
                                 <p className="text-3xl font-black italic tracking-tighter">
                                   ${(livePrice[inquiry.id] !== undefined ? livePrice[inquiry.id] : (inquiry.quoted_price || 0)) * (inquiry.party_size || 1)}
                                 </p>
                              </div>
                              <button 
                                onClick={() => handleSendInvoice(inquiry)}
                                disabled={dispatchPending === inquiry.id || (livePrice[inquiry.id] === undefined && !inquiry.quoted_price)}
                                className="w-full bg-primary text-black py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-primary/10"
                              >
                                 {dispatchPending === inquiry.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                                 Send Strategic Invoice
                              </button>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <DeleteConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title={deleteTitle} loading={isDeleting} />
    </div>
  );
}
