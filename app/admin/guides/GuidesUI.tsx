"use client";

import { useState } from "react";
import { addGuide, toggleGuideStatus, deleteGuide, updateGuide } from "./actions";
import { Plus, Loader2, CheckCircle2, UserX, UserCheck, Trash2, AlertTriangle, X, ShieldAlert, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GuidesUI({ initialGuides }: { initialGuides: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [editingGuide, setEditingGuide] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    let res;
    
    if (editingGuide) {
      res = await updateGuide(editingGuide.id, formData);
    } else {
      res = await addGuide(formData);
    }
    
    if (res.error) {
      setError(res.error);
    } else {
      (e.target as HTMLFormElement).reset();
      setEditingGuide(null);
    }
    
    setLoading(false);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setToggling(id);
    await toggleGuideStatus(id, currentStatus);
    setToggling(null);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const res = await deleteGuide(id);
    if (res.error) setError(res.error);
    setShowDeleteModal(null);
    setDeleting(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Guides Table */}
      <div className="flex-1 bg-background rounded-3xl shadow-sm border border-foreground/5 overflow-hidden">
        <div className="p-6 border-b border-foreground/5 flex items-center justify-between">
           <h2 className="text-xl font-bold text-foreground">Current Roster</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-foreground/5 text-foreground/50 text-xs uppercase tracking-wider text-left">
              <tr>
                <th className="px-6 py-4 font-bold">Guide</th>
                <th className="px-6 py-4 font-bold">Specialty</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {initialGuides.map((guide) => (
                <tr key={guide.id} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-foreground/10 flex-shrink-0">
                         {guide.image_url ? (
                            <img src={guide.image_url} alt={guide.name} className="w-full h-full object-cover" />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-foreground/40">{guide.name.charAt(0)}</div>
                         )}
                      </div>
                      <div>
                         <p className="font-bold text-foreground">{guide.name}</p>
                         <p className="text-xs text-foreground/50 line-clamp-1">{guide.bio}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground/70">
                    {guide.specialty || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${guide.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {guide.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                      {guide.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingGuide(guide);
                          setError(null);
                          // Scroll to form on mobile
                          if (window.innerWidth < 1024) {
                            document.getElementById('guide-form')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-all"
                        title="Edit Info"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleToggle(guide.id, guide.is_active)}
                        disabled={toggling === guide.id || deleting === guide.id}
                        className="text-xs font-bold px-3 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {toggling === guide.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (
                           guide.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />
                        )}
                        {guide.is_active ? 'Deactivate' : 'Reactivate'}
                      </button>
                      <button 
                        onClick={() => setShowDeleteModal(guide.id)}
                        disabled={deleting === guide.id || toggling === guide.id}
                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        title="Delete Tour Guide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!initialGuides.length && (
                 <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-foreground/50 font-medium">No guides found. Add one to get started.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div id="guide-form" className="w-full lg:w-1/3 bg-background rounded-3xl shadow-sm border border-foreground/5 p-6 h-fit sticky top-24">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">{editingGuide ? 'Edit Tour Guide' : 'Add New Tour Guide'}</h2>
            {editingGuide && (
              <button 
                onClick={() => setEditingGuide(null)}
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
              >
                Cancel Edit
              </button>
            )}
         </div>
         
         {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
               {error}
            </div>
         )}
         
         <form key={editingGuide?.id || 'new'} onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">Full Name *</label>
               <input name="name" defaultValue={editingGuide?.name} required className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
            <div>
               <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">Specialty</label>
               <input name="specialty" defaultValue={editingGuide?.specialty} placeholder="e.g. Big Five Expert" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
            <div>
               <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">WhatsApp Number *</label>
               <input name="phone_number" defaultValue={editingGuide?.phone_number} required placeholder="+255..." className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none font-bold" />
            </div>
            <div>
               <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">Guide Portrait {editingGuide ? '(Update)' : '(Photo)'}</label>
               <input 
                 name="image" 
                 type="file" 
                 accept="image/*"
                 className="w-full text-xs text-foreground/40 bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-primary file:text-black hover:file:bg-primary/80 transition-all cursor-pointer"
               />
               <p className="text-[9px] text-foreground/30 mt-2 ml-1">Ideal for identification dossiers.</p>
            </div>
            <div>
               <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">Fleet Assignment</label>
               <select name="fleet_assigned" defaultValue={editingGuide?.fleet_assigned || 'Land Cruiser 300'} className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none appearance-none font-medium">
                  <option value="Land Cruiser 300">Land Cruiser 300 (Elite)</option>
                  <option value="Land Cruiser 79">Land Cruiser 79 (Extreme)</option>
                  <option value="Safari Luxury Van">Safari Luxury Van</option>
                  <option value="The Mobile Base">The Mobile Base</option>
               </select>
            </div>
            <div>
               <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">Short Bio</label>
               <textarea name="bio" defaultValue={editingGuide?.bio} rows={2} className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none" />
            </div>
            
            <button 
               type="submit" 
               disabled={loading}
               className={`w-full mt-4 font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${editingGuide ? 'bg-foreground text-background shadow-foreground/20' : 'bg-primary text-background shadow-primary/20'}`}
            >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingGuide ? <><CheckCircle2 className="w-5 h-5" /> Update Dossier</> : <><Plus className="w-5 h-5" /> Save Guide</>}
            </button>
         </form>
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 20 }}
               className="max-w-md w-full bg-background rounded-[2.5rem] p-10 border border-foreground/10 relative shadow-2xl overflow-hidden"
             >
                {/* Background Flare */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 blur-[80px] rounded-full" />
                
                <button 
                  onClick={() => setShowDeleteModal(null)}
                  className="absolute top-6 right-6 text-foreground/20 hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-8">
                   <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>

                <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-none mb-4">Confirm Deletion</h3>
                <p className="text-foreground/50 text-sm font-medium leading-relaxed mb-8">
                   You are about to remove this tour guide from the active roster. This will permanently delete their dossier and identification photo from the **Asili Yetu Sentinel** database.
                </p>

                <div className="flex flex-col gap-3">
                   <button 
                     onClick={() => handleDelete(showDeleteModal)}
                     disabled={deleting === showDeleteModal}
                     className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                   >
                      {deleting === showDeleteModal ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      Authorize Removal
                   </button>
                   <button 
                     onClick={() => setShowDeleteModal(null)}
                     disabled={deleting === showDeleteModal}
                     className="w-full bg-foreground/5 hover:bg-foreground/10 text-foreground/50 font-black py-4 rounded-2xl uppercase tracking-widest text-[10px] transition-all"
                   >
                      Cancel Protocol
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
