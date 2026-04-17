"use client";

import { useState } from "react";
import { addGuide, toggleGuideStatus } from "./actions";
import { Plus, Loader2, CheckCircle2, UserX, UserCheck } from "lucide-react";

export default function GuidesUI({ initialGuides }: { initialGuides: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await addGuide(formData);
    
    if (res.error) {
      setError(res.error);
    } else {
      (e.target as HTMLFormElement).reset();
    }
    
    setLoading(false);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setToggling(id);
    await toggleGuideStatus(id, currentStatus);
    setToggling(null);
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
                    <button 
                      onClick={() => handleToggle(guide.id, guide.is_active)}
                      disabled={toggling === guide.id}
                      className="text-xs font-bold px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors disabled:opacity-50 flex items-center gap-2 ml-auto"
                    >
                      {toggling === guide.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                         guide.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />
                      )}
                      {guide.is_active ? 'Deactivate' : 'Reactivate'}
                    </button>
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

      {/* Add Form */}
      <div className="w-full lg:w-1/3 bg-background rounded-3xl shadow-sm border border-foreground/5 p-6 h-fit">
         <h2 className="text-xl font-bold text-foreground mb-6">Add New Guide</h2>
         
         {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
               {error}
            </div>
         )}
         
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">Full Name *</label>
               <input name="name" required className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
            <div>
               <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">Specialty</label>
               <input name="specialty" placeholder="e.g. Big Five Expert" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
            <div>
               <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">WhatsApp Number *</label>
               <input name="phone_number" required placeholder="+255..." className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none font-bold" />
            </div>
            <div>
               <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">Guide Portrait (Photo)</label>
               <input 
                 name="image" 
                 type="file" 
                 accept="image/*"
                 className="w-full text-xs text-foreground/40 bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-primary file:text-black hover:file:bg-primary/80 transition-all cursor-pointer"
               />
               <p className="text-[9px] text-foreground/30 mt-2 ml-1">Ideal for ranger identification cards.</p>
            </div>
            <div>
               <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">Fleet Assignment</label>
               <select name="fleet_assigned" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none appearance-none font-medium">
                  <option value="Land Cruiser 300">Land Cruiser 300 (Elite)</option>
                  <option value="Land Cruiser 79">Land Cruiser 79 (Extreme)</option>
                  <option value="Safari Luxury Van">Safari Luxury Van</option>
                  <option value="The Mobile Base">The Mobile Base</option>
               </select>
            </div>
            <div>
               <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">Short Bio</label>
               <textarea name="bio" rows={2} className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none" />
            </div>
            
            <button 
               type="submit" 
               disabled={loading}
               className="w-full mt-4 bg-primary hover:bg-primary/90 text-background font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Save Guide</>}
            </button>
         </form>
      </div>
    </div>
  );
}
