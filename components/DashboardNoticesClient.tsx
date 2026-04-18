"use client";

import { useState } from "react";
import { Megaphone, Trash2, ArrowRight, Tag, AlertTriangle } from "lucide-react";
import { deleteNotice } from "@/app/actions/notices";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import Link from "next/link";

interface DashboardNoticesClientProps {
  initialNotices: any[];
}

export default function DashboardNoticesClient({ initialNotices }: DashboardNoticesClientProps) {
  const [notices, setNotices] = useState(initialNotices);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const res = await deleteNotice(deleteId);
    if (res.success) {
      setNotices(notices.filter(n => n.id !== deleteId));
      setDeleteId(null);
    }
    setIsDeleting(false);
  };

  const getNoticeIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Tag className="w-3.5 h-3.5" />;
      case 'alert': return <AlertTriangle className="w-3.5 h-3.5" />;
      default: return <Megaphone className="w-3.5 h-3.5" />;
    }
  };

  const getNoticeColor = (type: string) => {
    switch (type) {
      case 'discount': return 'text-emerald-600 bg-emerald-50';
      case 'alert': return 'text-rose-600 bg-rose-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="bg-white rounded-[3rem] p-10 border border-black/5 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Megaphone className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black italic uppercase tracking-tight">Active Broadcasts</h3>
        </div>
        <Link href="/admin/notices" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
          Manage <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice.id} className="group flex items-start justify-between p-4 rounded-2xl hover:bg-foreground/2 transition-all border border-transparent hover:border-black/5">
            <div className="flex gap-4 min-w-0">
               <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${getNoticeColor(notice.type)}`}>
                  {getNoticeIcon(notice.type)}
               </div>
               <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{notice.message}</p>
                  <p className="text-[10px] text-foreground/30 font-black uppercase tracking-widest mt-1">
                    {notice.is_active ? '● LIVE TRANSMISSION' : 'IDLE STATE'}
                  </p>
               </div>
            </div>
            
            <button 
              onClick={() => {
                setDeleteId(notice.id);
                setDeleteTitle(notice.message.substring(0, 30) + "...");
              }}
              className="p-2 rounded-lg bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white shrink-0 ml-4"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {notices.length === 0 && (
          <p className="text-center py-8 text-xs font-bold text-foreground/20 uppercase tracking-widest italic">No active broadcasts</p>
        )}
      </div>

      <DeleteConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        title={deleteTitle} 
        loading={isDeleting} 
      />
    </div>
  );
}
