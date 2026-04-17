"use client";

import { useState } from "react";
import { Zap, Trash2 } from "lucide-react";
import { deleteMission } from "@/app/actions/missions";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

interface MissionFeedClientProps {
  initialMissions: any[];
}

export default function MissionFeedClient({ initialMissions }: MissionFeedClientProps) {
  const [missions, setMissions] = useState(initialMissions);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const res = await deleteMission(deleteId);
    if (res.success) {
      setMissions(missions.filter(m => m.id !== deleteId));
      setDeleteId(null);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {missions?.map((mission) => (
          <div key={mission.id} className="bg-white rounded-[2.5rem] p-8 border border-black/5 hover:border-primary/50 transition-all group shadow-sm hover:shadow-2xl hover:shadow-black/5 relative">
            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-2xl transition-all ${mission.status === 'accepted' ? 'bg-primary text-black' : 'bg-black/5 text-black/20 group-hover:text-black/40'}`}>
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setDeleteId(mission.id);
                    setDeleteTitle(mission.guides?.name || "Pending Mission");
                  }}
                  className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span className={`text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border ${mission.status === 'accepted'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-black/5 text-black/40 border-black/5'
                  }`}>
                  {mission.status}
                </span>
              </div>
            </div>
            <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-2 leading-none">
              {mission.status === 'accepted' ? 'Ranger on Point' : 'Dispatch Pending'}
            </p>
            <h4 className="text-xl font-black text-foreground italic mb-4 leading-none truncate">
              {mission.guides?.name || 'Awaiting Response'}
            </h4>
            <div className="flex items-center justify-between pt-4 border-t border-black/5">
              <span className="text-[10px] font-bold text-foreground/50 italic truncate max-w-[150px]">
                Guest: {mission.inquiries?.client_name || mission.inquiry?.client_name || 'Custom Expedition'}
              </span>
              <span className="text-[10px] font-bold text-foreground/50">
                {new Date(mission.dispatched_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {!missions?.length && (
          <div className="col-span-full py-20 text-center bg-foreground/[0.02] rounded-[3rem] border border-dashed border-foreground/10">
            <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest italic">No active missions on the grid.</p>
          </div>
        )}
      </div>

      <DeleteConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        title={deleteTitle} 
        loading={isDeleting} 
      />
    </>
  );
}
