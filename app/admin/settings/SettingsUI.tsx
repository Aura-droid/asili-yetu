"use client";

import { useState } from "react";
import { updateSettings } from "@/app/actions/settings";
import { 
  Settings, Save, Loader2, Globe, Mail, Phone, 
  MapPin, ShieldAlert, Camera,
  CheckCircle2, AlertCircle, MessageSquare
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsUI({ initialSettings }: { initialSettings: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateSettings(formData);

    if (res.success) {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(res.error || "Failed to update helm settings.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl">
       <div className="flex items-center gap-6 mb-12">
          <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm">
             <Settings className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-foreground tracking-tighter">Global <span className="text-primary italic">Helm</span></h1>
            <p className="text-foreground/50 text-xl font-medium mt-1">Master configuration for the Asili Yetu digital ecosystem.</p>
          </div>
       </div>

       {success && (
          <div className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-3xl flex items-center gap-4 text-green-600 animate-in fade-in slide-in-from-top-4 duration-500">
             <CheckCircle2 className="w-6 h-6" />
             <p className="font-bold uppercase tracking-widest text-xs italic">Helm Configuration Synchronized Successfully</p>
          </div>
       )}

       {error && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-3xl flex items-center gap-4 text-red-600">
             <AlertCircle className="w-6 h-6" />
             <p className="font-bold text-sm italic">{error}</p>
          </div>
       )}

       <form onSubmit={handleSubmit} className="space-y-10">
          {/* Identity & Presence */}
          <div className="bg-white rounded-[3.5rem] border border-foreground/5 p-12 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl transition-colors group-hover:bg-primary/10" />
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                   <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-foreground/30 italic mb-8">
                      <Globe className="w-4 h-4" /> Global Identity
                   </h3>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">Site Official Name</label>
                      <input name="site_name" defaultValue={initialSettings?.site_name} className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 text-foreground font-black text-sm focus:ring-1 focus:ring-primary transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">Office Coordinates</label>
                      <input name="office_location" defaultValue={initialSettings?.office_location} className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 text-foreground font-black text-sm focus:ring-1 focus:ring-primary transition-all" />
                   </div>
                </div>

                <div className="space-y-8">
                   <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-foreground/30 italic mb-8">
                      <ShieldAlert className="w-4 h-4" /> Operations Mode
                   </h3>
                   <div className="p-8 bg-foreground/5 rounded-3xl border border-foreground/5 flex items-center justify-between">
                      <div>
                        <p className="font-black text-sm uppercase tracking-tighter italic">Maintenance Pulse</p>
                        <p className="text-[10px] text-foreground/40 font-bold">Lock public site for critical updates.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input name="is_maintenance_mode" type="checkbox" defaultChecked={initialSettings?.is_maintenance_mode} value="on" className="sr-only peer" />
                        <div className="w-14 h-7 bg-foreground/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                   </div>
                </div>
             </div>
          </div>

          {/* Contact Infrastructure */}
          <div className="bg-white rounded-[3.5rem] border border-foreground/5 p-12 shadow-sm">
             <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-foreground/30 italic mb-12">
                <Mail className="w-4 h-4" /> Communication Anchors
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                   <label className="flex items-center gap-2 text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">
                      <Mail className="w-3 h-3 text-primary" /> Support Email
                   </label>
                   <input name="contact_email" defaultValue={initialSettings?.contact_email} className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 text-foreground font-black text-sm focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="space-y-2">
                   <label className="flex items-center gap-2 text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">
                      <Phone className="w-3 h-3 text-primary" /> Office Phone
                   </label>
                   <input name="contact_phone" defaultValue={initialSettings?.contact_phone} className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 text-foreground font-black text-sm focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="space-y-2">
                   <label className="flex items-center gap-2 text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">
                      <MessageSquare className="w-3 h-3 text-green-500" /> WhatsApp ID
                   </label>
                   <input name="whatsapp_number" defaultValue={initialSettings?.whatsapp_number} placeholder="255123456789" className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 text-foreground font-black text-sm focus:ring-1 focus:ring-primary transition-all" />
                </div>
             </div>
          </div>

          {/* Social Heritage */}
          <div className="bg-white rounded-[3.5rem] border border-foreground/5 p-12 shadow-sm">
             <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-foreground/30 italic mb-12">
                <Globe className="w-4 h-4" /> Cultural Social Channels
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="flex items-center gap-2 text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">
                      <Camera className="w-3 h-3 text-primary" /> Instagram URL
                   </label>
                   <input name="instagram_url" defaultValue={initialSettings?.instagram_url} className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 text-foreground font-black text-sm focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="space-y-2">
                   <label className="flex items-center gap-2 text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">
                      <Globe className="w-3 h-3 text-primary" /> Facebook URL
                   </label>
                   <input name="facebook_url" defaultValue={initialSettings?.facebook_url} className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 text-foreground font-black text-sm focus:ring-1 focus:ring-primary transition-all" />
                </div>
             </div>
          </div>

          <div className="flex justify-end pt-6">
             <button 
                type="submit"
                disabled={loading}
                className="bg-foreground text-background px-12 py-6 rounded-[2rem] font-black uppercase tracking-tighter text-xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
             >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 text-primary" />}
                Authorize Helm Sync
             </button>
          </div>
       </form>
    </div>
  );
}
