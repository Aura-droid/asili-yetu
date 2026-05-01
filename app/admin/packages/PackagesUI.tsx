"use client";

import { useState } from "react";
import { Plus, Trash2, Star, Loader2, MapPin, Clock, DollarSign, Package, CheckCircle2, Pin, Image as ImageIcon, AlertCircle, RefreshCw, Edit2, XCircle, ShieldCheck, Thermometer, Zap, Layers, Wind, Droplets, Plane, Bed, Utensils, Ticket, Car, User, HeartPulse, Eye, Wifi } from "lucide-react";
import { createPackage, deletePackage, toggleFeatured, updatePackage } from "@/app/actions/packages";
import AdminRouteMap from "@/components/AdminRouteMap";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { useRouter } from "next/navigation";
import { useLoading } from "@/providers/LoadingProvider";

const PACKAGE_TIER_OPTIONS = [
  { value: "budget", label: "Budget" },
  { value: "mid_range", label: "Mid Range" },
  { value: "luxury", label: "Luxury" },
];

const PACKAGE_TIER_LABELS: Record<string, string> = {
  budget: "Budget",
  mid_range: "Mid Range",
  luxury: "Luxury",
};

const AVAILABLE_INCLUSIONS = [
  { id: 'airport', label: 'Airport Transfers', icon: Plane },
  { id: 'accommodation', label: 'Luxury Accommodation', icon: Bed },
  { id: 'meals', label: 'Full Board Meals', icon: Utensils },
  { id: 'park_fees', label: 'National Park Fees', icon: Ticket },
  { id: 'vehicle', label: '4x4 Land Cruiser', icon: Car },
  { id: 'guide', label: 'Professional Guide', icon: User },
  { id: 'water', label: 'Bottled Water', icon: Droplets },
  { id: 'insurance', label: 'Emergency Evacuation', icon: HeartPulse },
  { id: 'binoculars', label: 'High-End Binoculars', icon: Eye },
  { id: 'wifi', label: 'Onboard Wi-Fi', icon: Wifi },
];

export default function PackagesUI({ initialPackages, destinations }: { initialPackages: any[], destinations: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { setIsLoading: setGlobalLoading } = useLoading();

  const [itineraryDays, setItineraryDays] = useState<any[]>([]);
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>([]);
  const [editingPkg, setEditingPkg] = useState<any | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleEdit = (pkg: any) => {
    setEditingPkg(pkg);
    setPreviewUrl(pkg.main_image || null);
    setItineraryDays(pkg.itinerary || []);
    setSelectedInclusions(pkg.inclusions || []);
    // We'll scroll to the top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingPkg(null);
    setPreviewUrl(null);
    setItineraryDays([]);
    setSelectedInclusions([]);
  };

  const toggleInclusion = (id: string) => {
    setSelectedInclusions(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const addDay = () => setItineraryDays([...itineraryDays, { day: itineraryDays.length + 1, destination: "", accommodation: "", lat: 0, lng: 0 }]);
  const removeDay = (idx: number) => setItineraryDays(itineraryDays.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 })));
  const updateDay = (idx: number, field: string, val: any) => {
    const newDays = itineraryDays.map((d, i) => 
      i === idx ? { ...d, [field]: val } : d
    );
    setItineraryDays(newDays);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setGlobalLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("itinerary", JSON.stringify(itineraryDays));
    formData.append("inclusions", JSON.stringify(selectedInclusions));

    try {
      const res = editingPkg 
        ? await updatePackage(editingPkg.id, formData)
        : await createPackage(formData);
        
      if (res.success) {
        if (editingPkg) setEditingPkg(null);
        else e.currentTarget.reset();
        setItineraryDays([]);
        setSelectedInclusions([]);
        router.refresh();
      } else {
        setError(res.error || "Mission failed.");
      }
    } catch (err) {
      setError("Unauthorized access or network failure.");
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await deletePackage(deleteId);
    if (res.success) {
        router.refresh();
    } else {
        alert(res.error);
    }
    setDeleteId(null);
    setDeleting(false);
  };

  const handleToggle = async (id: string, currentlyFeatured: boolean) => {
    setToggling(id);
    const res = await toggleFeatured(id, currentlyFeatured);
    if (!res.success) alert(res.error);
    setToggling(null);
    router.refresh();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start min-h-screen pb-20">
      {/* Condensed Package Sidebar (Narrow Portfolio) */}
      <div className="w-full lg:w-[320px] shrink-0 space-y-6 lg:sticky lg:top-8 max-h-screen overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex items-center justify-between px-4 mb-2">
           <h2 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40 italic">Portfolio</h2>
           <div className="flex items-center gap-2">
             <button 
               onClick={handleRefresh}
               className="p-2 bg-foreground/5 text-foreground/40 rounded-lg hover:text-primary transition-all active:scale-95"
               title="Refresh Atlas"
             >
               <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
             </button>
             <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-black transition-all">
                <Plus className="w-4 h-4" />
             </button>
           </div>
        </div>
        
        <div className="space-y-4">
          {initialPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-[2rem] border border-foreground/10 p-4 shadow-sm hover:shadow-xl transition-all duration-500 group relative">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                     <MapPin className="w-5 h-5 text-foreground/20 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="min-w-0">
                     <h4 className="text-xs font-black text-foreground uppercase tracking-tight truncate">{pkg.title}</h4>
                     <p className="text-[10px] font-bold text-foreground/40">
                        {pkg.duration_days}D • {pkg.discount_price ? (
                          <>
                            <span className="line-through opacity-50 text-red-400">${pkg.price_usd}</span> 
                            <span className="text-primary ml-1">${pkg.discount_price}</span>
                          </>
                        ) : (
                          `$${pkg.price_usd}`
                        )} / person
                     </p>
                     <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">
                        {PACKAGE_TIER_LABELS[pkg.package_tier || "mid_range"] || "Mid Range"}
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     disabled={toggling === pkg.id}
                     onClick={() => handleToggle(pkg.id, pkg.is_featured)} 
                     className={`p-2 rounded-lg border transition-all ${pkg.is_featured ? 'bg-primary text-black' : 'bg-foreground/5 text-foreground/30 hover:text-foreground'}`}
                   >
                       {toggling === pkg.id ? (
                         <Loader2 className="w-3.5 h-3.5 animate-spin" />
                       ) : (
                         <Star className="w-3.5 h-3.5" fill={pkg.is_featured ? "currentColor" : "none"} />
                       )}
                   </button>
                  <button 
                    type="button"
                    onClick={() => handleEdit(pkg)}
                    className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary transition-all hover:text-black"
                  >
                     <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => {
                        setDeleteId(pkg.id);
                        setDeleteTitle(pkg.title);
                    }} 
                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                     <Trash2 className="w-3.5 h-3.5" />
                  </button>
               </div>
            </div>
          ))}
          {initialPackages.length === 0 && (
             <div className="p-8 text-center bg-foreground/5 rounded-[2rem] border border-dashed border-foreground/10">
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest leading-loose">No active <br/> expeditions</p>
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

      {/* Precision Precision Mapping Canvas (Open Wide) */}
      <div className="flex-1 space-y-10 w-full min-w-0">
         <div className="bg-white rounded-[4rem] border border-foreground/10 p-2 shadow-2xl relative overflow-hidden group">
            <div className="p-6 md:p-10 border-b border-foreground/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none mb-2">
                     Expedition <span className="text-primary italic">Charter</span>
                  </h1>
                  <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.4em]">Precision Route Workbench v3.0</p>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Active Checkpoints</span>
                      <span className="text-2xl font-black text-primary">{itineraryDays.length} Points</span>
                   </div>
                </div>
            </div>

            <div className="h-[600px] md:h-[750px] w-full relative">
               <AdminRouteMap points={itineraryDays} onChange={setItineraryDays} />
               
               {/* Last Point Destination Indicator Overlay */}
               {itineraryDays.length > 1 && (
                 <div className="absolute top-8 right-8 bg-black/90 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 shadow-2xl z-10 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black">
                          <CheckCircle2 className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Final Destination</p>
                          <p className="text-sm font-bold text-white uppercase tracking-tighter italic">
                             {itineraryDays[itineraryDays.length - 1].destination || 'Waiting for Pin...'}
                          </p>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Float-UP Deployment Form */}
            <div className="p-10 bg-[#fafafa] border-t border-foreground/5">
                {error && <div className="mb-8 p-6 bg-red-50 text-red-600 rounded-[2rem] text-sm font-bold border border-red-100 flex items-center gap-4 italic shadow-sm">
                   <AlertCircle className="w-6 h-6" /> {error}
                </div>}
                <form key={editingPkg?.id || 'new'} onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-12 bg-foreground/5 p-10 rounded-[3.5rem] border border-foreground/5 shadow-inner">
                      <div className="space-y-10">
                         <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tighter">
                               {editingPkg ? 'Edit Masterpiece' : 'Design New Expedition'}
                            </h2>
                            {editingPkg && (
                               <button 
                                 type="button" 
                                 onClick={cancelEdit}
                                 className="flex items-center gap-2 text-red-500 font-bold hover:scale-105 transition-all bg-red-50 px-4 py-2 rounded-xl"
                               >
                                  <XCircle className="w-4 h-4" /> Cancel Edit
                               </button>
                            )}
                         </div>

                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">Expedition Title</label>
                            <input name="title" defaultValue={editingPkg?.title} required placeholder="e.g. The Serengeti Masterpiece" className="w-full bg-white border border-foreground/10 rounded-[2.5rem] px-10 py-8 text-2xl font-black text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-xl italic uppercase tracking-tighter" />
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/[0.03] p-10 rounded-[4rem] border border-foreground/5 shadow-inner">
                            <div className="md:col-span-2 flex items-center gap-4 mb-2">
                               <div className="h-px bg-foreground/10 flex-1"></div>
                               <h3 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em] italic shrink-0">Enclave Positioning</h3>
                               <div className="h-px bg-foreground/10 flex-1"></div>
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-2 flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> Focus Biome</label>
                               <select name="biome_orientation" defaultValue={editingPkg?.biome_orientation || "Savannah Majesty"} className="w-full bg-white border border-foreground/10 rounded-2xl px-8 py-5 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all font-black text-sm shadow-sm appearance-none cursor-pointer uppercase tracking-tight">
                                  <option value="Savannah Majesty">Savannah Majesty (Infinite Plains)</option>
                                  <option value="Volcanic Highlands">Volcanic Highlands (Crater Edges)</option>
                                  <option value="Primeval Jungle">Primeval Jungle (Lush Canopy)</option>
                                  <option value="Equatorial Alpine">Equatorial Alpine (Glacial Peaks)</option>
                                  <option value="Tropical Turquoise">Tropical Turquoise (Coastal Reefs)</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-2 flex items-center gap-2"><Thermometer className="w-4 h-4 text-primary" /> Thermal Profile</label>
                               <select name="temperature_profile" defaultValue={editingPkg?.temperature_profile || "Warm & Sun-drenched"} className="w-full bg-white border border-foreground/10 rounded-2xl px-8 py-5 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all font-black text-sm shadow-sm appearance-none cursor-pointer uppercase tracking-tight">
                                  <option value="Warm & Sun-drenched">Sun-Drenched & Warm</option>
                                  <option value="Cool Mist & High Altitude">Cool Mist & High Alt</option>
                                  <option value="Tropical Monsoon">Monsoon Humidity</option>
                                  <option value="Glacial Chill">Crisp Glacial</option>
                               </select>
                            </div>
                            <div className="space-y-3 md:col-span-2">
                               <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-2 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Operation Momentum</label>
                               <select name="intensity_vibe" defaultValue={editingPkg?.intensity_vibe || "Classic Safari"} className="w-full bg-white border border-foreground/10 rounded-2xl px-8 py-5 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all font-black text-sm shadow-sm appearance-none cursor-pointer uppercase tracking-tight">
                                  <option value="Classic Safari">Balanced Flow (Standard)</option>
                                  <option value="Extreme Expedition">High Momentum (Action)</option>
                                  <option value="Luxury Sanctuary">Refined Pace (Zen)</option>
                                  <option value="Cultural Immersion">Deep Connection (Human)</option>
                               </select>
                            </div>
                            <input type="hidden" name="destination_id" value={editingPkg?.destination_id || ""} />
                         </div>

                         {/* EXPEDITION INCLUSIONS SELECTOR */}
                         <div className="space-y-6 bg-white p-10 rounded-[4rem] border border-foreground/5 shadow-sm">
                            <div className="flex flex-col gap-1">
                               <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] ml-1">Expedition Inclusions</label>
                               <p className="text-[9px] font-bold text-foreground/20 italic tracking-wide">Select the services integrated into this safari strategy.</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                               {AVAILABLE_INCLUSIONS.map((item) => {
                                 const Icon = item.icon;
                                 const isSelected = selectedInclusions.includes(item.id);
                                 return (
                                   <button
                                     key={item.id}
                                     type="button"
                                     onClick={() => toggleInclusion(item.id)}
                                     className={`flex flex-col items-center justify-center p-5 rounded-[2rem] border transition-all gap-3 ${
                                       isSelected 
                                         ? 'bg-primary border-primary shadow-lg shadow-primary/20 scale-[1.02]' 
                                         : 'bg-foreground/[0.03] border-foreground/5 hover:border-foreground/10 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                                     }`}
                                   >
                                      <Icon className={`w-6 h-6 ${isSelected ? 'text-black' : 'text-foreground/40'}`} />
                                      <span className={`text-[8px] font-black uppercase tracking-widest text-center leading-tight ${isSelected ? 'text-black' : 'text-foreground/30'}`}>
                                         {item.label}
                                      </span>
                                   </button>
                                 );
                               })}
                            </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">The Narrative</label>
                            <textarea name="description" defaultValue={editingPkg?.description} required rows={4} placeholder="Describe the soul of this expedition..." className="w-full bg-white border border-foreground/10 rounded-[3rem] px-10 py-8 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all font-bold italic text-base leading-relaxed resize-none shadow-sm" />
                         </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                           {[
                             { label: 'Standard Yield (USD)', name: 'price_usd', def: editingPkg?.price_usd || 2500, type: 'number' },
                             { label: 'Discounted Yield (USD) - Optional', name: 'discount_price', def: editingPkg?.discount_price || "", type: 'number' },
                             { label: 'Endurance (Days)', name: 'duration_days', def: editingPkg?.duration_days || 7, type: 'number' },
                             { label: 'Comfort Level', name: 'difficulty_level', options: ['Classic', 'Luxury', 'Elite', 'Extreme'], def: editingPkg?.difficulty_level },
                             { label: 'Package Tier', name: 'package_tier', options: PACKAGE_TIER_OPTIONS, def: editingPkg?.package_tier || 'mid_range' },
                             { label: 'Max People', name: 'max_people', def: editingPkg?.max_people || 8, type: 'number' },
                             { label: 'Capacity Label', name: 'people_count_text', def: editingPkg?.people_count_text || "For 2-8 People", type: 'text' }
                           ].map((f, i) => (
                           <div key={i} className="bg-white p-6 rounded-[2rem] border border-foreground/5 shadow-sm">
                              <label className="block text-[8px] font-black text-foreground/40 uppercase tracking-widest mb-3 ml-1">{f.label}</label>
                              {f.options ? (
                                <select 
                                  name={f.name || 'difficulty_level'} 
                                  defaultValue={f.def || 'Classic'}
                                  className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-foreground focus:ring-1 focus:ring-primary transition-all font-black text-xs uppercase appearance-none"
                                >
                                   {f.options.map((opt) =>
                                     typeof opt === "string" ? (
                                       <option key={opt} value={opt}>{opt}</option>
                                     ) : (
                                       <option key={opt.value} value={opt.value}>{opt.label}</option>
                                     )
                                   )}
                                 </select>
                              ) : (
                                 <input name={f.name} step={f.name === 'price_usd' || f.name === 'discount_price' ? "0.01" : "1"} type={f.type} required={f.name !== 'discount_price'} defaultValue={f.def} className="w-full bg-foreground/5 border-none rounded-xl pl-4 pr-12 py-3 text-foreground focus:ring-1 focus:ring-primary transition-all font-black text-sm" />
                              )}
                           </div>
                         ))}
                      </div>
                      </div>

                      <div className="space-y-6 pt-10">
                         <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-black text-foreground italic uppercase tracking-tighter">Itinerary Intelligence</h3>
                            <button 
                              type="button"
                              onClick={addDay}
                              className="px-4 py-2 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                               <Plus className="w-3 h-3" /> Append Day
                            </button>
                         </div>
                         
                         <div className="grid grid-cols-1 gap-4">
                            {itineraryDays.map((day, idx) => (
                               <div key={idx} className="bg-white rounded-[2rem] border border-foreground/5 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-end">
                                  <div className="w-12 h-12 bg-foreground text-primary rounded-xl flex items-center justify-center shrink-0 font-black italic text-xl">
                                     {day.day}
                                  </div>
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <label className="text-[8px] font-black uppercase tracking-[0.2em] text-foreground/30 ml-1">Destination</label>
                                        <input 
                                          key={`dest-${idx}-${editingPkg?.id}`}
                                          defaultValue={day.destination || ''}
                                          onBlur={(e) => updateDay(idx, 'destination', e.target.value)}
                                          placeholder="e.g. Serengeti Central"
                                          className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-1 focus:ring-primary transition-all"
                                        />
                                     </div>
                                     <div>
                                        <label className="text-[8px] font-black uppercase tracking-[0.2em] text-foreground/30 ml-1">Accommodation / Lodge</label>
                                        <input 
                                          key={`acc-${idx}-${editingPkg?.id}`}
                                          defaultValue={day.accommodation || ''}
                                          onBlur={(e) => updateDay(idx, 'accommodation', e.target.value)}
                                          placeholder="e.g. Asili Luxury Tented Camp"
                                          className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-1 focus:ring-primary transition-all"
                                        />
                                     </div>
                                  </div>
                                  <button 
                                    type="button" 
                                    onClick={() => removeDay(idx)}
                                    className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                                  >
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="lg:col-span-4 space-y-8">
                      <div>
                        <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-4 ml-1">Master Capture (Hero Photo)</label>
                        <div className="relative group/photo h-64 bg-white border-2 border-dashed border-foreground/10 rounded-[3rem] overflow-hidden flex flex-col items-center justify-center transition-all hover:border-primary/50 cursor-pointer">
                           <input name="image" type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                           {previewUrl ? (
                               <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                           ) : (
                               <>
                                  <ImageIcon className="w-12 h-12 text-foreground/10 mb-2 group-hover/photo:text-primary transition-colors" />
                                  <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Select Image</p>
                               </>
                           )}
                           {previewUrl && (
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white text-[10px] font-black uppercase tracking-widest">Change Image</p>
                             </div>
                           )}
                        </div>
                      </div>

                      <div className="p-8 bg-white rounded-[3rem] border border-foreground/5 shadow-sm space-y-4">
                         <label className="flex items-center justify-between cursor-pointer group">
                             <span className="text-xs font-black text-foreground uppercase tracking-tight italic group-hover:text-primary transition-colors">Feature Masterpiece</span>
                             <div className="relative inline-flex items-center">
                                <input 
                                  key={`featured-${editingPkg?.id}`}
                                  name="is_featured" 
                                  type="checkbox" 
                                  defaultChecked={editingPkg?.is_featured} 
                                  value="on" 
                                  className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-foreground/10 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                             </div>
                         </label>
                         <p className="text-[10px] font-bold text-foreground/40 italic leading-relaxed">Elevate this expedition to the main landing page hero carousel for maximum global exposure.</p>
                      </div>

                      <button 
                         type="submit" 
                         disabled={loading}
                         className="w-full bg-primary hover:bg-black hover:text-white text-black font-black py-8 rounded-[3rem] transition-all shadow-xl shadow-primary/20 flex flex-col items-center justify-center gap-1 active:scale-[0.98] border border-primary/50 text-xl italic uppercase tracking-tighter"
                       >
                         {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>
                           <span className="text-[10px] font-black tracking-[0.4em] mb-1">{editingPkg ? 'Strategy Locked' : 'Ready for Operations'}</span>
                           <span className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6" /> {editingPkg ? 'Update Strategy' : 'Deploy to Atlas'}</span>
                         </>}
                      </button>
                    </div>
                </form>
            </div>
         </div>
      </div>
    </div>
  );
}
