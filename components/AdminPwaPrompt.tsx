"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function AdminPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsDesktop(true);
    }

    const handler = (e: any) => {
      // Prevent the default browser install prompt from showing up automatically
      e.preventDefault();
      
      // Store the event so we can trigger it manually, but only on Desktop PCs
      if (window.innerWidth >= 1024) {
        setDeferredPrompt(e);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (!isDesktop || !deferredPrompt) return null;

  return (
    <button 
      onClick={handleInstallClick}
      className="flex items-center gap-4 text-emerald-400/80 hover:text-emerald-400 transition-all w-full px-5 py-3 rounded-2xl hover:bg-emerald-500/10 font-black text-xs uppercase tracking-widest group mb-4 border border-emerald-500/20 shadow-lg shadow-emerald-900/20"
    >
      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" /> Install Admin App
    </button>
  );
}
