"use client";

import React, { useState } from "react";
import { MessageCircle, Copy, Check, Send, Zap, CheckCircle2, Loader2, Radio } from "lucide-react";
import { sendBrandedEmail } from "@/app/actions/bookings";
import { signalRangers } from "@/app/actions/signals";
import { useLoading } from "@/providers/LoadingProvider";

interface QuickRepliesProps {
  inquiry: any;
}

export default function QuickReplies({ inquiry }: QuickRepliesProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { isLoading, setIsLoading } = useLoading();

  const [customMessage, setCustomMessage] = useState("");

  const templates = [
    {
      id: "welcome",
      label: "Initial Welcome",
      text: `Jambo ${inquiry.client_name}! The wilderness is calling. Our concierge team has received your request and we are currently tailoring a high-fidelity expedition strategy for your journey through the Savannah. 🌿`
    },
    {
      id: "quote",
      label: "Quote Ready",
      text: `Exciting news ${inquiry.client_name}! Your custom expedition strategy for ${inquiry.itinerary_details?.recommendedTitle || "your journey"} is ready. It features high-fidelity experiences curated just for you. View your terminal here: ${window?.location?.origin || ""}/dashboard`
    },
    {
       id: "confirmed",
       label: "Booking Confirmed",
       text: `It's official, ${inquiry.client_name}! Your voyage is locked in. Our fleet of custom 4x4 Land Cruisers and elite rangers are standing by. We will see you at the gates of the Savannah! 🦒`
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSelectTemplate = (text: string) => {
    setCustomMessage(text);
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    setIsSending(true);
    const res = await sendBrandedEmail(inquiry.id, customMessage);
    setIsLoading(false);
    setIsSending(false);
    if (res.success) {
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    } else {
        alert("Failed to send email: " + res.error);
    }
  };

  const [signalStatus, setSignalStatus] = useState<null | 'success' | 'error'>(null);
  const [waLink, setWaLink] = useState<string | null>(null);

  const handleSignalRangers = async () => {
    setIsLoading(true);
    setSignalStatus(null);
    setWaLink(null);
    const res = await signalRangers(inquiry.id, 'en');
    setIsLoading(false);
    
    if (res.success) {
      setSignalStatus('success');
      if (res.whatsappLink) {
        setWaLink(res.whatsappLink);
      }
    } else {
      setSignalStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/5 rounded-3xl p-6 border border-black/5 space-y-4">
        <h4 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
           <MessageCircle className="w-3 h-3" /> Command Center Composer
        </h4>
        
        <textarea 
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Select a template or type a custom dispatch..."
          className="w-full min-h-[140px] bg-white border border-foreground/10 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all placeholder:text-foreground/20 italic"
        />

        {/* COMMAND ACTIONS */}
      <div className="space-y-4">
        {/* PART 1: EXPLORER COMMUNIQUE */}
        <div className="p-6 bg-white rounded-3xl border border-black/5 shadow-sm space-y-4 group">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] italic">01. Explorer Communiqué</p>
            <Send className="w-3 h-3 text-blue-500" />
          </div>
          <button 
            onClick={handleSendEmail}
            disabled={isSending || sent}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all ${
              sent ? "bg-green-500 text-white" : "bg-black text-white hover:bg-black/90 shadow-xl active:scale-95"
            }`}
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : sent ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {sent ? "Dispatch Confirmed" : "Transmit to Explorer"}
          </button>
        </div>

        {/* PART 2: FIELD SENTINEL ACTIVATION */}
        <div className="p-6 bg-white rounded-3xl border border-black/5 shadow-sm space-y-4 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] italic">02. Field Sentinel Activation</p>
            <Radio className="w-3 h-3 text-primary animate-pulse" />
          </div>

          <button 
            onClick={handleSignalRangers}
            disabled={isLoading || signalStatus === 'success'}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all ${
              signalStatus === 'success' 
                ? 'bg-foreground/5 text-foreground/40 cursor-default border border-dashed border-foreground/10' 
                : 'bg-primary text-black hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(163,204,76,0.3)]'
            }`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
            {signalStatus === 'success' ? 'Sentinel Record Primed' : 'Authorize Ranger Signal'}
          </button>

          {signalStatus === 'success' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
               <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-2xl flex items-center gap-3 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <p className="text-[9px] font-black uppercase tracking-widest italic">Mission Registered in Vault</p>
               </div>
               
               {waLink && (
                  <a 
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 shadow-[0_15px_35px_rgba(37,211,102,0.3)] hover:scale-[1.03] active:scale-95 transition-all text-center"
                  >
                     <Zap className="w-4 h-4 fill-current" />
                     Launch Dispatch (WhatsApp)
                  </a>
               )}
            </div>
          )}
        </div>
      </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-2 flex items-center justify-between">
           Dispatch Templates
        </h4>
        
        <div className="grid grid-cols-1 gap-3">
          {templates.map((tpl) => (
            <div 
              key={tpl.id} 
              onClick={() => handleSelectTemplate(tpl.text)}
              className={`bg-white border p-5 rounded-2xl shadow-sm group hover:border-primary/50 transition-all cursor-pointer ${customMessage === tpl.text ? 'border-primary ring-2 ring-primary/10' : 'border-foreground/10'}`}
            >
              <div className="flex items-center justify-between mb-3">
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary">{tpl.label}</span>
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCopy(tpl.text, tpl.id); }}
                      className="p-2 hover:bg-foreground/5 rounded-xl transition-colors text-foreground/40 hover:text-primary"
                      title="Copy for WhatsApp"
                    >
                      {copied === tpl.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a 
                      href={`https://wa.me/${inquiry.client_phone?.replace(/\D/g,'')}?text=${encodeURIComponent(tpl.text)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 hover:bg-foreground/5 rounded-xl transition-colors text-foreground/40 hover:text-[#25D366]"
                      title="Send via WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                 </div>
              </div>
              <p className="text-sm text-foreground/70 line-clamp-2 italic leading-relaxed font-medium">"{tpl.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
