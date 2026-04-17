"use client";

import { useState, useEffect } from "react";
import { getAboutContent, updateAboutContent, initializeAboutVault } from "@/app/actions/content";
import AdminAboutEditor from "@/components/AdminAboutEditor";
import { BookOpen, RefreshCw, DatabaseBackup, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";

export default function AdminAboutPage() {
  const [aboutContent, setAboutContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    loadAboutContent();
  }, []);

  const loadAboutContent = async () => {
    setLoading(true);
    setErrorStatus(null);
    try {
      const res = await getAboutContent();
      if (!res) {
        setErrorStatus("VAULT_EMPTY");
      }
      setAboutContent(res);
    } catch (e: any) {
      setErrorStatus("DATABASE_ERROR");
    }
    setLoading(false);
  };

  const handleInitializeLocale = async () => {
    setLoading(true);
    const res = await initializeAboutVault();
    if (res.success) {
      setTimeout(() => loadAboutContent(), 1000);
    } else {
      alert("Vault Error: " + res.error);
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg">
            <BookOpen className="text-black w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">About <span className="text-primary italic">Strategy</span></h1>
            <p className="text-foreground/50 text-sm font-semibold uppercase tracking-widest mt-1">Manage Bio, Assets & Legacy</p>
          </div>
        </div>

        <button 
          onClick={loadAboutContent}
          className="flex items-center gap-3 px-6 py-4 bg-white border border-foreground/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all active:scale-95 shadow-sm group"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-foreground/40 group-hover:text-primary transition-colors ${loading ? 'animate-spin' : ''}`} />
          Reload Content
        </button>
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] border border-foreground/10 shadow-sm min-h-[600px] flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-foreground/20 italic font-medium">
             <RefreshCw className="w-10 h-10 animate-spin mb-4 opacity-10" />
             <p className="uppercase tracking-widest text-[10px] font-black">Syncing with Strategy Vault...</p>
          </div>
        ) : errorStatus === "VAULT_EMPTY" ? (
          <div className="text-center space-y-8 animate-in zoom-in duration-500 max-w-md">
             <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
                <DatabaseBackup className="w-10 h-10 text-amber-500" />
             </div>
             <div>
                <h3 className="text-xl font-black uppercase tracking-tight italic mb-3">Database Row Missing</h3>
                <p className="text-foreground/50 text-sm leading-relaxed">
                   The <code>site_content</code> table exists, but there is no entry for <code>about_page</code>. Please click below to seed your first record or run the SQL snippet in Supabase.
                </p>
             </div>
             <div className="p-4 bg-foreground/5 rounded-2xl border border-foreground/5 font-mono text-[10px] text-left overflow-x-auto">
                {"INSERT INTO site_content (key, data) VALUES (''about_page'', ''{...}'');"}
             </div>
             
             <button 
                onClick={handleInitializeLocale}
                disabled={loading}
                className="w-full bg-primary text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
             >
                <Zap className="w-4 h-4 fill-current" />
                Initialize Strategy Vault
             </button>
          </div>
        ) : errorStatus === "DATABASE_ERROR" ? (
          <div className="text-center space-y-6">
             <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
             <h3 className="text-xl font-black">Connection Failure</h3>
             <p className="text-foreground/50 text-sm">Verify the <code>site_content</code> table exists in Supabase.</p>
          </div>
        ) : aboutContent ? (
          <div className="w-full">
            <AdminAboutEditor initialData={aboutContent} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
