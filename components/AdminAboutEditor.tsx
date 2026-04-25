"use client";

import { useState } from "react";
import { updateAboutContent } from "@/app/actions/content";
import { Save, Image as ImageIcon, User, Globe, CheckCircle2, Loader2, Upload, Trash2, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminAboutEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState({
    hero_image: "",
    legacy_image: "",
    story_image_1: "",
    story_image_2: "",
    leader_photo: "",
    leader_name: "",
    leader_role: "",
    en: { leader_message: [] as string[] },
    ...initialData,
    en: {
      leader_message: initialData?.en?.leader_message || initialData?.en?.ceo_message || [],
    },
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${field}_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('asili-images').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('asili-images').getPublicUrl(fileName);
      setData((prev: any) => ({ ...prev, [field]: publicUrl }));
    } catch (err: any) {
      alert("Asset Upload Failed: " + err.message);
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    const res = await updateAboutContent(data);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert("Save failed: " + res.error);
    }
    setLoading(false);
  };

  const ImageUploadField = ({ field, label, aspect }: { field: string; label: string; aspect: string }) => (
    <div className="space-y-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">{label}</p>
      <div className={`relative group ${aspect} rounded-3xl overflow-hidden bg-foreground/5 border-2 border-dashed border-primary/20 hover:border-primary transition-all`}>
        {uploading === field && (
          <div className="absolute inset-0 z-20 bg-black/60 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
        {(data as any)[field] ? (
          <>
            <img src={(data as any)[field]} className="w-full h-full object-cover" alt={label} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all">
                Replace
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, field)} />
              </label>
            </div>
          </>
        ) : (
          <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-4 text-foreground/20">
            <Upload className="w-8 h-8" />
            <span className="text-xs font-black uppercase tracking-widest">Upload {label}</span>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, field)} />
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-foreground italic tracking-tighter uppercase leading-none">About <span className="text-primary italic">Strategy</span></h3>
          <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.4em] mt-2">Manage Bio, Assets & Legacy</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading || !!uploading}
          className="flex items-center gap-3 px-8 py-4 bg-primary text-black font-black uppercase text-xs tracking-widest rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {loading ? "Writing to Vault..." : saved ? "Vault Updated" : "Save Changes"}
        </button>
      </div>

      {/* SECTION 1: Visual Assets */}
      <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-8">
        <div className="flex items-center gap-3 opacity-40 italic">
          <ImageIcon className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Visual Infrastructure</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploadField field="hero_image" label="Main Strategy Banner (Hero)" aspect="aspect-[21/9]" />
          <ImageUploadField field="legacy_image" label="Origin Story Background (Legacy)" aspect="aspect-video" />
          <ImageUploadField field="story_image_1" label="Story Image 1 (Who We Are)" aspect="aspect-[4/5]" />
          <ImageUploadField field="story_image_2" label="Story Image 2 (Name & Roots)" aspect="aspect-video" />
        </div>
      </div>

      {/* SECTION 2: Leadership Message */}
      <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-8">
        <div className="flex items-center gap-3 text-primary italic">
          <User className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Leadership Message</span>
        </div>

        <p className="text-xs text-foreground/40 italic">Leave name and role blank to hide the attribution. Leave message empty to hide the entire section.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Leader Photo */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 italic">Leader Photo (Optional)</p>
            <div className="relative group aspect-square w-40 rounded-full overflow-hidden bg-foreground/5 border-2 border-dashed border-foreground/10 hover:border-primary/50 transition-all">
              {uploading === 'leader_photo' && (
                <div className="absolute inset-0 z-20 bg-black/60 flex items-center justify-center rounded-full">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              )}
              {data.leader_photo ? (
                <>
                  <img src={data.leader_photo} className="w-full h-full object-cover" alt="Leader" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                    <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest">
                      Change
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'leader_photo')} />
                    </label>
                  </div>
                </>
              ) : (
                <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-2 text-foreground/20">
                  <Upload className="w-6 h-6" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-center px-2">Upload Photo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'leader_photo')} />
                </label>
              )}
            </div>
          </div>

          {/* Leader Name & Role */}
          <div className="space-y-6 flex flex-col justify-center">
            <div>
              <label className="text-[10px] font-bold text-foreground/40 uppercase mb-2 block">Name (leave blank to hide)</label>
              <input
                type="text"
                value={data.leader_name}
                onChange={(e) => setData({ ...data, leader_name: e.target.value })}
                placeholder="e.g. Jeyson"
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-foreground/40 uppercase mb-2 block">Role / Title (leave blank to hide)</label>
              <input
                type="text"
                value={data.leader_role}
                onChange={(e) => setData({ ...data, leader_role: e.target.value })}
                placeholder="e.g. Founder & Director"
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary font-medium"
              />
            </div>
          </div>
        </div>

        {/* Message Paragraphs */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 opacity-40 italic">
            <Globe className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Message Paragraphs (English)</span>
          </div>

          {(data.en.leader_message || []).map((para: string, i: number) => (
            <div key={i} className="group relative">
              <label className="text-[10px] font-bold text-foreground/40 uppercase mb-2 block">Paragraph {i + 1}</label>
              <textarea
                value={para}
                onChange={(e) => {
                  const updated = [...data.en.leader_message];
                  updated[i] = e.target.value;
                  setData({ ...data, en: { ...data.en, leader_message: updated } });
                }}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-6 py-5 text-sm focus:outline-none focus:border-primary font-medium h-32 resize-none italic leading-relaxed"
              />
              <button
                onClick={() => {
                  const updated = data.en.leader_message.filter((_: any, idx: number) => idx !== i);
                  setData({ ...data, en: { ...data.en, leader_message: updated } });
                }}
                className="absolute top-8 right-4 p-2 text-foreground/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            onClick={() => setData({ ...data, en: { ...data.en, leader_message: [...(data.en.leader_message || []), ""] } })}
            className="w-full py-4 border-2 border-dashed border-foreground/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-3 h-3" /> Append Paragraph
          </button>
        </div>
      </div>
    </div>
  );
}
