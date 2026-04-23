"use client";

import { useState } from "react";
import { createCultureStory, toggleStoryStatus, deleteStory, toggleFeaturedStory } from "@/app/actions/culture";
import { Plus, Trash2, Star, Loader2, Image as ImageIcon, CheckCircle2, Eye, EyeOff, LayoutPanelLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CultureUI({ stories }: { stories: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await createCultureStory(formData);
    if (res.error) setError(res.error);
    else (e.target as HTMLFormElement).reset();
    setLoading(false);
  };

  const handleToggle = async (id: string, current: boolean) => {
    setToggling(id);
    await toggleStoryStatus(id, current);
    setToggling(null);
    router.refresh();
  };
  const handleToggleMasterpiece = async (id: string, current: boolean) => {
    setToggling(id + "-featured");
    await toggleFeaturedStory(id, current);
    setToggling(null);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(deleteId);
    await deleteStory(deleteId);
    setDeleting(null);
    setDeleteId(null);
  };

  return (
    <div className="space-y-12 relative">
      {/* Tactical Delete Modal */}
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
                 <Trash2 className="w-10 h-10 text-red-500 animate-pulse" />
              </div>
              
              <h3 className="text-2xl font-black text-foreground text-center tracking-tighter uppercase mb-2 leading-none">Purge Heritage?</h3>
              <p className="text-foreground/40 text-center text-xs font-black uppercase tracking-widest mb-10 leading-relaxed">
                This cultural signal will be <span className="text-red-500 underline">permanently silenced</span> from the archive.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                 <button 
                    onClick={() => setDeleteId(null)}
                    className="py-4 rounded-2xl bg-foreground/5 text-foreground font-black uppercase text-[10px] tracking-widest hover:bg-foreground/10 transition-all border border-foreground/5 shadow-sm"
                 >
                    Abort Mission
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

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase relative">
            Cultural <span className="text-primary italic">Archive</span>
          </h1>
          <p className="text-foreground/50 text-xs font-black uppercase tracking-[0.3em] mt-2">Managing the soul of the Savannah heritage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Creation Hub */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[2.5rem] border border-foreground/10 p-8 shadow-sm h-fit sticky top-8">
            <h3 className="text-xl font-black text-foreground mb-8 flex items-center gap-3 italic">
              <Plus className="w-5 h-5 text-primary" /> Curate Story
            </h3>
            
            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 italic">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-2 ml-1">Archive Photo</label>
                  <input name="image" type="file" accept="image/*" required className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-foreground text-xs font-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-primary file:text-black cursor-pointer" />
               </div>
               <div>
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-1 ml-1">Story Identification (Title)</label>
                  <input name="title" required placeholder="The Jump of Adumu" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-foreground text-sm font-bold focus:ring-1 focus:ring-primary focus:outline-none" />
               </div>
               <div>
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-1 ml-1">Cultural Category</label>
                  <select name="category" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-foreground text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary appearance-none">
                     <option value="Traditions">Ancient Traditions</option>
                     <option value="Kinship">Kinship & Community</option>
                     <option value="Guardianship">Guardianship of Wildlife</option>
                     <option value="Artisans">Beadwork & Artistry</option>
                  </select>
               </div>
               <div>
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-1 ml-1">Ancestral Narrative (Bio/Story)</label>
                  <textarea name="description" rows={4} required placeholder="The rhythm of the earth begins with the heartbeat..." className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-5 text-foreground text-xs font-bold italic resize-none" />
               </div>
               <div>
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-1 ml-1">Accent Brand Color</label>
                  <input name="accent_color" type="color" defaultValue="#e11d48" className="w-full h-12 bg-foreground/5 border border-foreground/10 rounded-2xl p-2 cursor-pointer" />
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
                  <p className="text-[9px] font-bold text-foreground/40 italic leading-tight">Elevate this cultural story to the homepage hero.</p>
               </div>

               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full bg-primary text-black font-black py-5 rounded-full hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] border border-primary/50 text-sm italic uppercase tracking-widest"
               >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Deploy to Archive</>}
               </button>
            </form>
          </div>
        </div>

        {/* Stories List */}
        <div className="lg:col-span-8 space-y-6">
           <AnimatePresence>
              {stories.map((story) => (
                 <motion.div 
                   key={story.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="bg-white rounded-[2.5rem] border border-foreground/10 p-6 flex items-center gap-8 group shadow-sm hover:shadow-xl transition-all duration-500"
                 >
                    <div className="w-40 h-40 rounded-[2rem] overflow-hidden flex-shrink-0 relative">
                       <img src={story.image_url} alt={story.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" />
                       <div 
                          className="absolute bottom-0 left-0 right-0 h-1" 
                          style={{ background: story.accent_color }} 
                       />
                    </div>
                    
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-2">
                          <span className="text-[8px] font-black uppercase text-foreground/40 tracking-widest bg-foreground/5 px-3 py-1 rounded-full">{story.category}</span>
                          {!story.is_active && <span className="text-[8px] font-black uppercase text-red-500 tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">Hidden</span>}
                       </div>
                       <h4 className="text-xl font-black text-foreground italic uppercase tracking-tighter mb-2">{story.title}</h4>
                       <p className="text-xs font-bold text-foreground/40 line-clamp-2 italic leading-relaxed">{story.description}</p>
                    </div>

                     <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => handleToggle(story.id, story.is_active)}
                          disabled={toggling === story.id}
                          className={`p-4 rounded-2xl transition-all ${story.is_active ? 'bg-primary text-black' : 'bg-black text-white hover:bg-foreground/50'} shadow-sm border border-foreground/5`}
                        >
                           {toggling === story.id ? <Loader2 className="w-5 h-5 animate-spin" /> : (story.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />)}
                        </button>
                        <button 
                         onClick={() => handleToggleMasterpiece(story.id, story.is_featured)}
                         disabled={toggling === story.id + "-featured"}
                         className={`p-4 rounded-2xl transition-all ${story.is_featured ? 'bg-primary text-black' : 'bg-foreground/5 text-foreground/30 hover:text-foreground'} shadow-sm border border-foreground/5`}
                       >
                          {toggling === story.id + "-featured" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" fill={story.is_featured ? "currentColor" : "none"} />}
                       </button>
                        <button 
                          onClick={() => setDeleteId(story.id)}
                          disabled={deleting === story.id}
                          className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-all shadow-sm border border-red-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                 </motion.div>
              ))}

              {stories.length === 0 && (
                 <div className="py-40 bg-foreground/[0.02] rounded-[4rem] border border-dashed border-foreground/10 text-center flex flex-col items-center justify-center">
                    <LayoutPanelLeft className="w-16 h-16 text-foreground/5 mb-6" />
                    <h4 className="text-xl font-black text-foreground/20 uppercase italic pb-2">The Archive is Silent</h4>
                    <p className="text-foreground/30 text-[10px] font-black uppercase tracking-[0.2em]">Deploy your first heritage story to speak to the soul</p>
                 </div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
