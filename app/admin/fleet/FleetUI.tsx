"use client";

import { useState } from "react";
import { addVehicle, toggleMaintenance, deleteVehicle } from "./actions";
import { Plus, Loader2, CheckCircle2, Wrench, Car, Trash2 } from "lucide-react";

export default function FleetUI({ initialFleet }: { initialFleet: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await addVehicle(formData);
    if (res.error) {
      setError(res.error);
    } else {
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  const handleToggle = async (id: string, isAvailable: boolean) => {
    setToggling(id);
    await toggleMaintenance(id, isAvailable);
    setToggling(null);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setToggling(deleteConfirm);
    const res = await deleteVehicle(deleteConfirm);
    if (res.error) setError(res.error);
    setToggling(null);
    setDeleteConfirm(null);
  };

  return (
    <div className="relative">
      {/* Tactical Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-red-500/20 relative overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6 mx-auto">
                 <Trash2 className="w-10 h-10 text-red-500 animate-pulse" />
              </div>
              
              <h3 className="text-2xl font-black text-foreground text-center tracking-tighter uppercase mb-4">Retire Machine?</h3>
              <p className="text-foreground/60 text-center text-sm font-medium leading-relaxed mb-10">
                You are about to purge this vehicle from the active registry. This action is <span className="text-red-600 font-bold">permanent</span> and will desync all related telemetry.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                 <button 
                    onClick={() => setDeleteConfirm(null)}
                    className="py-4 rounded-2xl bg-foreground/5 text-foreground font-black uppercase text-[10px] tracking-widest hover:bg-foreground/10 transition-all border border-foreground/5"
                 >
                    Abort Mission
                 </button>
                 <button 
                    onClick={handleDelete}
                    disabled={toggling === deleteConfirm}
                    className="py-4 rounded-2xl bg-red-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center"
                 >
                    {toggling === deleteConfirm ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Purge"}
                 </button>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Fleet Table */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-sm border border-foreground/5 overflow-hidden">
          <div className="p-8 border-b border-foreground/5 flex items-center justify-between">
             <div>
               <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase">Operational Fleet</h2>
               <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Live mechanical status & capacity</p>
             </div>
             <div className="flex gap-2">
                <div className="px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                  {initialFleet.filter(v => v.is_available).length} Ready
                </div>
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-foreground/[0.02] text-foreground/40 text-[10px] font-black uppercase tracking-[0.3em] text-left">
                <tr>
                  <th className="px-8 py-6">Machine Detail</th>
                  <th className="px-8 py-6">Payload</th>
                  <th className="px-8 py-6">System Status</th>
                  <th className="px-8 py-6 text-right">Logistics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {initialFleet.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-foreground/[0.01] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-16 rounded-2xl overflow-hidden bg-foreground/5 flex-shrink-0 border border-foreground/10 group-hover:border-primary/30 transition-colors shadow-sm relative">
                           {vehicle.image_url ? (
                              <img src={vehicle.image_url} alt={vehicle.model_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-foreground/20"><Car className="w-8 h-8"/></div>
                           )}
                           {!vehicle.is_available && (
                             <div className="absolute inset-0 bg-orange-600/20 backdrop-blur-[1px] flex items-center justify-center">
                               <Wrench className="w-6 h-6 text-white" />
                             </div>
                           )}
                        </div>
                        <div>
                           <p className="font-black text-foreground text-lg tracking-tight italic">"{vehicle.model_name}"</p>
                           {vehicle.plate_number && (
                              <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">Plate: {vehicle.plate_number}</p>
                           )}
                           <div className="flex flex-wrap gap-1 mt-1.5">
                              {vehicle.features?.slice(0,3).map((f: string, idx: number) => (
                                <span key={idx} className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-foreground/5 text-foreground/40 rounded-full">{f}</span>
                              ))}
                           </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-foreground">{vehicle.capacity}</span>
                        <span className="text-[9px] font-black text-foreground/30 uppercase tracking-widest">Explorer Capacity</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${vehicle.is_available ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${vehicle.is_available ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
                        {vehicle.is_available ? 'In Action' : 'At Base Shop'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => setDeleteConfirm(vehicle.id)}
                          className="p-3 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                          title="Retire Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggle(vehicle.id, vehicle.is_available)}
                          disabled={toggling === vehicle.id}
                          className={`text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl border transition-all disabled:opacity-50 flex items-center gap-2 ${
                            vehicle.is_available 
                              ? 'border-foreground/10 hover:border-orange-500 hover:bg-orange-50 text-foreground/60 hover:text-orange-700' 
                              : 'border-primary bg-primary text-black shadow-lg shadow-primary/20 hover:scale-105'
                          }`}
                        >
                          {toggling === vehicle.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                             vehicle.is_available ? <Wrench className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />
                          )}
                          {vehicle.is_available ? 'Service' : 'Deploy'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Form */}
        <div className="lg:col-span-4 h-fit sticky top-32">
          <div className="bg-foreground/[0.03] rounded-[2.5rem] border border-foreground/10 p-10 shadow-sm relative overflow-hidden backdrop-blur-sm">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
             
             <h2 className="text-2xl font-black text-foreground mb-10 tracking-tighter uppercase flex items-center gap-3">
               <Plus className="w-8 h-8 text-primary" /> New Asset
             </h2>
             
             {error && <div className="mb-8 p-4 bg-red-500/10 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-500/20">{error}</div>}
             
             <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                   <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-3 ml-2">Mechanical Model *</label>
                   <input name="model_name" placeholder="Toyota Land Cruiser LX V8" required className="w-full bg-white border border-foreground/10 rounded-2xl px-6 py-4 text-foreground text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all" />
                </div>

                <div>
                   <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-3 ml-2">Number Plate</label>
                   <input name="plate_number" placeholder="T 746 AYX" className="w-full bg-white border border-foreground/10 rounded-2xl px-6 py-4 text-foreground text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-3 ml-2">Max Payload</label>
                     <input name="capacity" type="number" defaultValue={6} className="w-full bg-white border border-foreground/10 rounded-2xl px-6 py-4 text-foreground text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all" />
                   </div>
                </div>
                
                <div>
                   <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-3 ml-2">Core Features (comma separated)</label>
                   <textarea name="features" placeholder="Pop-up roof, WiFi, Inverter, Fridge" className="w-full bg-white border border-foreground/10 rounded-2xl px-6 py-4 text-foreground text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all h-24 resize-none" />
                </div>
                
                <div>
                   <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-3 ml-2">Vehicle Blueprint (Photo)</label>
                   <div className="relative group">
                      <input name="image" type="file" accept="image/*" className="w-full bg-white border border-foreground/10 rounded-2xl px-6 py-4 text-foreground text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all file:mr-6 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-primary file:text-black hover:file:bg-black hover:file:text-white file:transition-all pointer-cursor" />
                   </div>
                </div>
                
                <button type="submit" disabled={loading} className="w-full mt-6 bg-primary text-black font-black py-5 rounded-full transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 border border-primary/50 text-sm uppercase italic tracking-widest">
                   {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Plus className="w-6 h-6" /> Index Vehicle</>}
                </button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
}
