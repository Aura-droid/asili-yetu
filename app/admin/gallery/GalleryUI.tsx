"use client";

import { useState } from "react";
import { Camera, Plus, Trash2, Eye, EyeOff, Loader2, Image as ImageIcon, ExternalLink, RefreshCw, AlertTriangle } from "lucide-react";
import { addGalleryItem, deleteGalleryItem, toggleGalleryItem, toggleFeaturedGallery } from "@/app/actions/gallery";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function GalleryUI({ manualItems, instagramItems, instaError }: { 
  manualItems: any[], 
  instagramItems: any[],
  instaError: string | null 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'instagram'>('manual');

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await addGalleryItem(formData);
    if (!res.success) setError(res.error || "Upload failed");
    else (e.target as HTMLFormElement).reset();
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(deleteId);
    await deleteGalleryItem(deleteId);
    setDeleting(null);
    setDeleteId(null);
  };

  const handleToggle = async (id: string, active: boolean) => {
    setToggling(id);
    await toggleGalleryItem(id, active);
    setToggling(null);
    router.refresh();
  };

  const handleToggleMasterpiece = async (id: string, current: boolean) => {
    setToggling(id + "-featured");
    await toggleFeaturedGallery(id, current);
    setToggling(null);
    router.refresh();
  };

  return (
    <div className="space-y-12 relative">
      {/* Tactical Deletion Sentinel */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 30 }}
               className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-red-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6 mx-auto">
                 <Camera className="w-10 h-10 text-red-500 animate-pulse" />
              </div>
              
              <h3 className="text-2xl font-black text-foreground text-center tracking-tighter uppercase mb-2 leading-none">Purge Masterpiece?</h3>
              <p className="text-foreground/40 text-center text-xs font-black uppercase tracking-widest mb-10 leading-relaxed">
                This visual asset will be <span className="text-red-500 underline">permanently removed</span> from the exhibition archive.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                 <button 
                    onClick={() => setDeleteId(null)}
                    className="py-4 rounded-2xl bg-foreground/5 text-foreground font-black uppercase text-[10px] tracking-widest hover:bg-foreground/10 transition-all border border-foreground/5 shadow-sm"
                 >
                    Abort Curation
                 </button>
                 <button 
                    onClick={handleDelete}
                    disabled={deleting === deleteId}
                    className="py-4 rounded-2xl bg-red-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 flex items-center justify-center"
                 >
                    {deleting === deleteId ? <Loader2 className="w-4 h-4 animate-spin" /> : "Final Purge"}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase relative">
            Immersion Gallery
            <span className="absolute -top-4 -right-8 px-3 py-1 bg-primary text-[10px] font-black rounded-full shadow-lg rotate-12">LIVE</span>
          </h1>
          <p className="text-foreground/50 text-xs font-black uppercase tracking-[0.3em] mt-2">Curating the visual soul of Tanzanian expeditions</p>
        </div>

        <div className="flex p-1.5 bg-foreground/5 rounded-2xl border border-foreground/10 shrink-0">
          <button 
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'manual' ? 'bg-white text-foreground shadow-sm' : 'text-foreground/40 hover:text-foreground/60'}`}
          >
            <Camera className="w-4 h-4" /> Manual Collection
          </button>
          <button 
            onClick={() => setActiveTab('instagram')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'instagram' ? 'bg-white text-foreground shadow-sm' : 'text-foreground/40 hover:text-foreground/60'}`}
          >
            <InstagramIcon className="w-4 h-4" /> Instagram Feed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Creation/Status Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {activeTab === 'manual' ? (
            <div className="bg-white rounded-[2.5rem] border border-foreground/10 p-8 shadow-sm h-fit sticky top-8 overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
               <h3 className="text-xl font-black text-foreground mb-8 flex items-center gap-3 italic">
                 <Plus className="w-5 h-5 text-primary" /> Curate New Asset
               </h3>
               
               {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 italic">{error}</div>}

               <form onSubmit={handleUpload} className="space-y-6">
                 <div>
                   <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-2 ml-1">Masterpiece Photo</label>
                   <div className="relative group">
                     <input 
                       name="image" 
                       type="file" 
                       accept="image/*" 
                       required
                       className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-foreground focus:ring-4 focus:ring-primary/10 transition-all text-xs font-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-primary file:text-black hover:file:bg-primary/90 cursor-pointer" 
                     />
                   </div>
                 </div>

                 <div>
                   <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-2 ml-1">Gallery Caption</label>
                   <textarea 
                     name="caption" 
                     placeholder="e.g. A lone leopard stalking through the golden grass of Serengeti..."
                     className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-5 text-foreground focus:outline-none focus:border-primary transition-all text-xs h-32 resize-none font-bold italic"
                   />
                 </div>
                 <div className="p-5 bg-foreground/5 rounded-2xl border border-foreground/10 space-y-4">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-[10px] font-black text-foreground uppercase tracking-tight italic group-hover:text-primary transition-colors">Feature Masterpiece</span>
                        <div className="relative inline-flex items-center">
                          <input 
                            name="is_featured" 
                            type="checkbox" 
                            value="on" 
                            className="sr-only peer" 
                          />
                          <div className="w-10 h-5 bg-foreground/10 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                        </div>
                    </label>
                    <p className="text-[9px] font-bold text-foreground/40 italic leading-tight">Elevate this photo to the homepage masterpiece gallery.</p>
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full mt-4 bg-primary text-black font-black py-4 rounded-full hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl shadow-primary/20 border border-primary/50 text-sm"
                 >
                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Camera className="w-5 h-5" /> Add to Exhibition</>}
                 </button>
               </form>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-foreground/10 p-8 shadow-sm h-fit sticky top-8">
               <h3 className="text-xl font-black text-foreground mb-6 flex items-center gap-3 italic">
                 <RefreshCw className="w-5 h-5 text-primary" /> Feed Status
               </h3>
               <div className="space-y-6">
                 <div className="p-6 bg-foreground/[0.02] rounded-3xl border border-foreground/5">
                   <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-4">Connection Health</p>
                   {instaError ? (
                     <div className="flex items-center gap-3 text-red-500 font-bold italic text-sm">
                       <AlertTriangle className="w-5 h-5" /> API Error: {instaError}
                     </div>
                   ) : (
                     <div className="flex items-center gap-3 text-emerald-600 font-bold italic text-sm">
                       <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                       Synchronized with Graph API
                     </div>
                   )}
                 </div>
                 
                 <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Pro Tip</p>
                    <p className="text-xs font-bold text-foreground/60 italic leading-relaxed">
                      Instagram items are automatically mirrored from your official business account. To hide an item from the main gallery, you must archive/delete it on Instagram.
                    </p>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Media Grid */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {(activeTab === 'manual' ? manualItems : instagramItems).map((item) => (
                <div key={item.id} className="group relative bg-white rounded-[3rem] border border-foreground/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={item.url} 
                      alt={item.caption || "Asili Yetu Moment"}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                       {activeTab === 'manual' ? (
                         <>
                           <button 
                             onClick={() => handleToggle(item.id, !item.is_active)}
                             disabled={toggling === item.id}
                             className={`p-4 rounded-full backdrop-blur-md border border-white/20 transition-all ${item.is_active ? 'bg-primary text-black' : 'bg-black text-white'}`}
                           >
                             {toggling === item.id ? <Loader2 className="w-5 h-5 animate-spin" /> : (item.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />)}
                           </button>
                           <button 
                             onClick={() => handleToggleMasterpiece(item.id, item.is_featured)}
                             disabled={toggling === item.id + "-featured"}
                             className={`p-4 rounded-full backdrop-blur-md border border-white/20 transition-all ${item.is_featured ? 'bg-primary text-black' : 'bg-black text-white'}`}
                           >
                              {toggling === item.id + "-featured" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" fill={item.is_featured ? "currentColor" : "none"} />}
                           </button>
                           <button 
                             onClick={() => setDeleteId(item.id)}
                             disabled={deleting === item.id}
                             className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full backdrop-blur-md border border-white/20 transition-all font-black text-xs uppercase"
                           >
                             <Trash2 className="w-5 h-5" />
                           </button>
                         </>
                       ) : (
                         <a 
                           href={item.permalink} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="p-4 bg-white text-black rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-110 hover:bg-primary"
                         >
                           <ExternalLink className="w-5 h-5" />
                         </a>
                       )}
                    </div>
                    
                    {activeTab === 'instagram' && (
                      <div className="absolute top-6 left-6 p-2 bg-black/50 backdrop-blur-md rounded-lg">
                        <InstagramIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{item.source} Archive</span>
                       <span className="w-1 h-1 rounded-full bg-foreground/20" />
                       <span className="text-[10px] font-bold text-foreground/30 capitalize">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-black text-foreground/80 italic line-clamp-2 leading-relaxed h-10">
                      {item.caption || "No caption provided for this expedition moment."}
                    </p>
                  </div>
                </div>
              ))}

              {(activeTab === 'manual' ? manualItems : instagramItems).length === 0 && (
                <div className="col-span-full py-40 bg-foreground/[0.02] rounded-[4rem] border border-dashed border-foreground/10 text-center flex flex-col items-center justify-center">
                   <div className="w-24 h-24 rounded-full bg-foreground/[0.03] flex items-center justify-center mb-8">
                     <ImageIcon className="w-12 h-12 text-foreground/5" />
                   </div>
                   <h4 className="text-xl font-black text-foreground/20 italic tracking-tighter uppercase">Exhibition is currently empty</h4>
                   <p className="text-foreground/30 text-xs font-bold uppercase tracking-widest mt-2">{activeTab === 'manual' ? 'Populate your manual collection to begin the showcase' : 'Check Instagram connection health'}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
