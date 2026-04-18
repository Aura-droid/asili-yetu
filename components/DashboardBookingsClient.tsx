"use client";

import { useState } from "react";
import { Briefcase, Trash2, ArrowRight } from "lucide-react";
import { deleteInquiry } from "@/app/actions/bookings";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import Link from "next/link";

interface DashboardBookingsClientProps {
  initialInquiries: any[];
}

export default function DashboardBookingsClient({ initialInquiries }: DashboardBookingsClientProps) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const res = await deleteInquiry(deleteId);
    if (res.success) {
      setInquiries(inquiries.filter(i => i.id !== deleteId));
      setDeleteId(null);
    }
    setIsDeleting(false);
  };

  return (
    <div className="bg-white rounded-[3rem] p-10 border border-black/5 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black italic uppercase tracking-tight">Recent Inquiries</h3>
        </div>
        <Link href="/admin/bookings" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-foreground/2 transition-all border border-transparent hover:border-black/5">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/20 font-black text-xs uppercase italic group-hover:bg-primary group-hover:text-black transition-all">
                  {inquiry.client_name?.charAt(0) || "E"}
               </div>
               <div>
                  <h4 className="font-bold text-sm text-foreground leading-none mb-1">{inquiry.client_name}</h4>
                  <p className="text-[10px] text-foreground/40 font-medium">{inquiry.client_email}</p>
               </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${inquiry.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-foreground/5 text-foreground/40'}`}>
                {inquiry.status || 'new'}
              </span>
              <button 
                onClick={() => {
                  setDeleteId(inquiry.id);
                  setDeleteTitle(inquiry.client_name);
                }}
                className="p-2 rounded-lg bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {inquiries.length === 0 && (
          <p className="text-center py-8 text-xs font-bold text-foreground/20 uppercase tracking-widest italic">No pending inquiries</p>
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
