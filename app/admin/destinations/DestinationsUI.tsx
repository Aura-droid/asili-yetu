"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, Loader2, MapPin, Sun, Compass, RefreshCw, Star } from "lucide-react";
import { upsertDestination, deleteDestination, toggleFeaturedDestination } from "@/app/actions/destinations";
import { useRouter } from "next/navigation";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

export default function DestinationsUI({ initialDestinations }: { initialDestinations: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await upsertDestination(formData);
    if (!res.success) {
      setError(res.error || "Failed to save destination");
    } else {
      (e.target as HTMLFormElement).reset();
      setEditing(null);
    }
    setLoading(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await deleteDestination(deleteId);
    if (res.success) {
        router.refresh();
    } else {
        alert(res.error);
    }
    setDeleteId(null);
    setDeleting(false);
  };

  const handleToggle = async (id: string, current: boolean) => {
    setToggling(id);
    const res = await toggleFeaturedDestination(id, current);
    if (res?.error) alert(res.error);
    setToggling(null);
    router.refresh();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-10">
      {/* Destinations List */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-foreground">Established Regions</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              className="p-2.5 bg-foreground/5 text-foreground/40 rounded-xl hover:text-primary transition-all active:scale-95 border border-foreground/5"
              title="Refresh Atlas"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <span className="px-4 py-1.5 bg-foreground/5 rounded-full text-xs font-bold text-foreground/50 border border-foreground/10 uppercase tracking-widest">
              {initialDestinations.length} Wildlife Enclaves
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {initialDestinations.map((dest) => (
            <div key={dest.id} className="bg-white rounded-[2.5rem] border border-foreground/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group relative">
              {/* Header Image */}
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={dest.image_url || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"} 
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-6 right-6 flex gap-3">
                    <button 
                      disabled={toggling === dest.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(dest.id, dest.is_featured);
                      }} 
                      className={`p-3 backdrop-blur-lg rounded-full border border-white/20 transition-all shadow-lg ${dest.is_featured ? 'bg-primary text-black' : 'bg-white/10 text-white hover:bg-white hover:text-black'}`}
                    >
                        {toggling === dest.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Star className="w-5 h-5" fill={dest.is_featured ? "currentColor" : "none"} />
                        )}
                    </button>
                    <button 
                      onClick={() => setEditing(dest)}
                      className="p-3 bg-white/10 backdrop-blur-lg hover:bg-white text-white hover:text-black rounded-full border border-white/20 transition-all shadow-lg"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                          setDeleteId(dest.id);
                          setDeleteTitle(dest.name);
                      }}
                      className="p-3 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-lg border border-white/20 transition-all shadow-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                </div>
                <div className="absolute bottom-6 left-8">
                   <span className="bg-primary text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {dest.type || 'Savannah'}
                   </span>
                </div>
              </div>

              {/* Destination Details */}
              <div className="p-8">
                <h3 className="text-3xl font-black text-foreground mb-3">{dest.name}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed mb-6 line-clamp-2 italic font-medium">"{dest.description}"</p>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-foreground/5 p-4 rounded-2xl border border-foreground/10">
                      <div className="flex items-center gap-2 text-primary mb-1">
                         <Sun className="w-3.5 h-3.5" /> <span className="text-[10px] font-black uppercase tracking-tighter text-foreground/40">Best Time</span>
                      </div>
                      <span className="text-xs font-bold text-foreground truncate block">{dest.best_time || 'Year Round'}</span>
                   </div>
                   <div className="bg-foreground/5 p-4 rounded-2xl border border-foreground/10">
                      <div className="flex items-center gap-2 text-primary mb-1">
                         <Compass className="w-3.5 h-3.5" /> <span className="text-[10px] font-black uppercase tracking-tighter text-foreground/40">Prime Wildlife</span>
                      </div>
                      <span className="text-xs font-bold text-foreground truncate block">{dest.key_wildlife || 'Big Five'}</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
          {initialDestinations.length === 0 && (
            <div className="col-span-full py-32 bg-foreground/5 rounded-[4rem] border border-dashed border-foreground/20 text-center">
               <MapPin className="w-20 h-20 mx-auto mb-6 text-foreground/10" />
               <p className="text-foreground/40 font-medium text-xl">The map of Tanzania is waiting. Define your first safari region.</p>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={deleteTitle}
        loading={deleting}
      />

      {/* Form Side */}
      <div className="w-full xl:w-[450px]">
        <div className="bg-white rounded-[3rem] border border-foreground/10 p-10 shadow-sm h-fit sticky top-8">
           <h2 className="text-3xl font-black text-foreground mb-2">{editing ? 'Optimize Region' : 'Discover Region'}</h2>
           <p className="text-foreground/50 text-sm font-medium mb-10">{editing ? 'Refine the core attributes of this destination territory.' : 'Map a new wildlife sanctuary to the Asili showcase.'}</p>
           
           {error && <div className="mb-8 p-5 bg-red-50 text-red-600 rounded-2xl text-sm font-black border border-red-100 flex items-center gap-3 shadow-inner">
             {error}
           </div>}
           
           <form onSubmit={handleSubmit} className="space-y-6">
              {editing && <input type="hidden" name="id" value={editing.id} />}
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2">
                   <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 ml-2">Location Name *</label>
                   <input name="name" required defaultValue={editing?.name || ""} placeholder="Ngorongoro Crater" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-6 py-4 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all font-bold" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 ml-2">Biome Type</label>
                    <input name="type" defaultValue={editing?.type || ""} placeholder="Volcanic Caldera" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-6 py-4 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all font-bold" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 ml-2">Scale / Size</label>
                    <input name="size" defaultValue={editing?.size || ""} placeholder="260 sq km" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-6 py-4 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all font-bold" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 ml-2">Latitude</label>
                    <input name="latitude" type="number" step="any" defaultValue={editing?.latitude || ""} placeholder="-2.3333" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-6 py-4 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all font-bold" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 ml-2">Longitude</label>
                    <input name="longitude" type="number" step="any" defaultValue={editing?.longitude || ""} placeholder="34.8333" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-6 py-4 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all font-bold" />
                 </div>
              </div>

              <div>
                 <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 ml-2">Cinematic Narrative</label>
                 <textarea name="description" rows={3} defaultValue={editing?.description || ""} placeholder="Describe the soul of this place..." className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-6 py-4 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium resize-none shadow-inner" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 ml-2">Optimal window</label>
                   <input name="best_time" defaultValue={editing?.best_time || ""} placeholder="Year-Round" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-6 py-4 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all font-bold" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 ml-2">Apex Wildlife</label>
                   <input name="key_wildlife" defaultValue={editing?.key_wildlife || ""} placeholder="Big Five, Black Rhino" className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-6 py-4 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all font-bold" />
                 </div>
              </div>

              <div>
                 <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 ml-2">Hero Image</label>
                 <input 
                   name="image" 
                   type="file" 
                   accept="image/*" 
                   className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-6 py-4 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary file:text-black hover:file:bg-primary/90" 
                 />
                 {editing?.image_url && (
                    <input type="hidden" name="existing_image_url" value={editing.image_url} />
                 )}
              </div>

              <div className="p-6 bg-foreground/5 rounded-[2rem] border border-foreground/10 space-y-4">
                  <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-[10px] font-black text-foreground uppercase tracking-tight italic group-hover:text-primary transition-colors">Feature Masterpiece</span>
                      <div className="relative inline-flex items-center">
                        <input 
                          key={`featured-${editing?.id}`}
                          name="is_featured" 
                          type="checkbox" 
                          defaultChecked={editing?.is_featured} 
                          value="on" 
                          className="sr-only peer" 
                        />
                        <div className="w-10 h-5 bg-foreground/10 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                      </div>
                  </label>
                  <p className="text-[9px] font-bold text-foreground/40 italic leading-tight">Highlight this destination in the global discovery carousel.</p>
               </div>
              
              <div className="flex gap-4 pt-4">
                 {editing && (
                    <button 
                      type="button"
                      onClick={() => setEditing(null)}
                      className="flex-1 bg-foreground/5 text-foreground font-bold py-4 rounded-full border border-foreground/10 hover:bg-foreground/10 transition-all font-black text-xs uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                 )}
                 <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-[2] bg-primary hover:bg-primary/90 text-black font-black py-5 rounded-full transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 border border-primary/50 text-xs uppercase tracking-widest"
                 >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Plus className="w-6 h-6" /> {editing ? 'Update Atlas' : 'Register Territory'}</>}
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
}
