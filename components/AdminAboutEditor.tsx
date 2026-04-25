"use client";

import { useState, useRef } from "react";
import { updateAboutContent } from "@/app/actions/content";
import { Save, Image as ImageIcon, Type, Globe, CheckCircle2, Loader2, Upload, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminAboutEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
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
      const { data: uploadData, error } = await supabase.storage
        .from('asili-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('asili-images')
        .getPublicUrl(fileName);

      setData({ ...data, [field]: publicUrl });
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
    }
    setLoading(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
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

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* VISUAL ASSETS NODE */}
          <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-8">
             <div className="flex items-center gap-3 opacity-30 italic">
                <ImageIcon className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Visual Infrastructure</span>
             </div>
             
             <div className="space-y-8">
                {/* HERO BANNER */}
                <div className="space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Main Strategy Banner (Hero)</p>
                   <div className="relative group aspect-[21/9] rounded-3xl overflow-hidden bg-foreground/5 border-2 border-dashed border-primary/20 hover:border-primary transition-all">
                      {data.hero_image ? (
                        <>
                          <img src={data.hero_image} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                Replace Banner
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_image')} />
                             </label>
                          </div>
                        </>
                      ) : (
                        <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-4 text-foreground/20">
                           {uploading === 'hero_image' ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : <Upload className="w-8 h-8" />}
                           <span className="text-xs font-black uppercase tracking-widest">Upload Main Banner</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_image')} />
                        </label>
                      )}
                   </div>
                </div>



                {/* LEGACY PHOTO */}
                <div className="space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 italic">Origin Story Background (Legacy)</p>
                   <div className="relative group aspect-video rounded-3xl overflow-hidden bg-foreground/5 border-2 border-dashed border-foreground/10 hover:border-primary/50 transition-all">
                      {uploading === 'legacy_image' && (
                        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                           <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                           <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Processing Legacy View...</p>
                        </div>
                      )}
                      {data.legacy_image ? (
                        <>
                          <img src={data.legacy_image} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                Replace Photo
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'legacy_image')} />
                             </label>
                          </div>
                        </>
                      ) : (
                        <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-4 text-foreground/20">
                           {uploading === 'legacy_image' ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : <Upload className="w-8 h-8" />}
                           <span className="text-xs font-black uppercase">Click to Upload Background</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'legacy_image')} />
                        </label>
                      )}
                   </div>
                </div>

                {/* STORY IMAGE 1 */}
                <div className="space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 italic">Story Image 1 (Who We Are)</p>
                   <div className="relative group aspect-4/5 rounded-3xl overflow-hidden bg-foreground/5 border-2 border-dashed border-foreground/10 hover:border-primary/50 transition-all">
                      {uploading === 'story_image_1' && (
                        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                           <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                           <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Syncing Visual...</p>
                        </div>
                      )}
                      {data.story_image_1 ? (
                        <>
                          <img src={data.story_image_1} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                Replace Photo
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'story_image_1')} />
                             </label>
                          </div>
                        </>
                      ) : (
                        <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-4 text-foreground/20">
                           {uploading === 'story_image_1' ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : <Upload className="w-8 h-8" />}
                           <span className="text-xs font-black uppercase">Click to Upload Story Image 1</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'story_image_1')} />
                        </label>
                      )}
                   </div>
                </div>

                {/* STORY IMAGE 2 */}
                <div className="space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 italic">Story Image 2 (Name Meaning)</p>
                   <div className="relative group aspect-video rounded-3xl overflow-hidden bg-foreground/5 border-2 border-dashed border-foreground/10 hover:border-primary/50 transition-all">
                      {uploading === 'story_image_2' && (
                        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                           <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                           <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Syncing Visual...</p>
                        </div>
                      )}
                      {data.story_image_2 ? (
                        <>
                          <img src={data.story_image_2} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                Replace Photo
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'story_image_2')} />
                             </label>
                          </div>
                        </>
                      ) : (
                        <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-4 text-foreground/20">
                           {uploading === 'story_image_2' ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : <Upload className="w-8 h-8" />}
                           <span className="text-xs font-black uppercase">Click to Upload Story Image 2</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'story_image_2')} />
                        </label>
                      )}
                   </div>
                </div>
             </div>
          </div>

          {/* LOCALIZED CONTENT NODE */}
          <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
             <div className="flex items-center gap-3 text-primary italic">
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">English Bio (CEO Word)</span>
             </div>
             
             <div className="space-y-6">
                {(data.en.ceo_message || []).map((para: string, i: number) => (
                  <div key={i} className="group relative">
                    <label className="text-[10px] font-bold text-foreground/40 uppercase mb-2 block">Thought Node {i+1}</label>
                    <textarea 
                        value={para}
                        onChange={(e) => {
                          const newMsg = [...data.en.ceo_message];
                          newMsg[i] = e.target.value;
                          setData({ ...data, en: { ...data.en, ceo_message: newMsg } });
                        }}
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-6 py-5 text-sm focus:outline-none focus:border-primary font-medium h-40 resize-none italic leading-relaxed"
                    />
                    <button 
                      onClick={() => {
                        const newMsg = data.en.ceo_message.filter((_: any, idx: number) => idx !== i);
                        setData({ ...data, en: { ...data.en, ceo_message: newMsg } });
                      }}
                      className="absolute top-8 right-4 p-2 text-foreground/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <button 
                   onClick={() => setData({ ...data, en: { ...data.en, ceo_message: [...(data.en.ceo_message || []), ""] } })}
                   className="w-full py-4 border-2 border-dashed border-foreground/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:border-primary/50 hover:text-primary transition-all"
                >
                   + Append New Thought Node
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}
