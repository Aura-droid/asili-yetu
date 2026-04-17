"use client";

import { useState, useEffect } from "react";
import { Share2, Copy, Send, Check, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // Generate the URL locally preventing hydration errors
    setShareUrl(url || window.location.href);
  }, [url]);

  const shareTitle = `Asili Yetu Safaris: ${title}`;
  const shareText = text || `I just found this incredible safari masterpiece! You have to check this out.`;

  const handleShare = async () => {
    // 1. Try Native Web Share API (Primary for iOS/Android Mobile Devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return; // Success, bail out!
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setIsOpen(true); // User didn't just cancel, it actually failed; open fallback
        }
      }
    } else {
      // 2. Fallback for Desktop (MacOS/Windows)
      setIsOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <button 
        onClick={handleShare}
        className="flex items-center justify-center p-[1.15rem] rounded-full border border-white/20 bg-black/20 backdrop-blur-md hover:bg-white/10 hover:border-white text-white transition-all group shadow-xl"
        title="Share with a friend"
      >
        <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
            className="absolute bottom-full right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mb-4 w-60 bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-3 shadow-2xl z-50 text-white"
          >
             <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest px-3 pb-2 border-b border-white/10 mb-2">
               Recommend To A Friend
             </h4>
             <div className="flex flex-col gap-1">
               <a 
                 href={`https://wa.me/?text=${encodeURIComponent(shareTitle + "\n\n" + shareText + "\n\n" + shareUrl)}`}
                 target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/10 transition-colors text-sm font-medium"
                 onClick={() => setIsOpen(false)}
               >
                 <Send className="w-4 h-4 text-[#25D366]" /> WhatsApp
               </a>
               <a 
                 href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`}
                 className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/10 transition-colors text-sm font-medium"
                 onClick={() => setIsOpen(false)}
               >
                 <Mail className="w-4 h-4 text-blue-400" /> Email Send
               </a>
               <button 
                 onClick={copyToClipboard}
                 className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/10 transition-colors text-sm font-medium w-full text-left"
               >
                 {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/70" />} 
                 {copied ? 'Copied to clipboard!' : 'Copy Link'}
               </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invisible overlay strictly to handle "clicking off" the modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
