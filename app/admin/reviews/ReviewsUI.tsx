"use client";

import { useState } from "react";
import { Star, Trash2, MessageCircle, Clock, Package, User, Loader2, Plus, X, ShieldCheck, RefreshCw } from "lucide-react";
import { approveReview, createReview, deleteReview } from "@/app/actions/reviews";
import { useRouter } from "next/navigation";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

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

export default function ReviewsUI({ initialReviews }: { initialReviews: any[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [approving, setApproving] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ client_name: "", comment: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await deleteReview(deleteId);
    if (res.success) {
        router.refresh();
    } else {
        alert(res.error);
    }
    setDeleteId(null);
    setDeleting(false);
  };

  const handleApprove = async (id: string) => {
    setApproving(id);
    const res = await approveReview(id);
    if (!res.success) alert(res.error);
    setApproving(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await createReview({ ...formData, is_approved: true });
    if (res.success) {
      setIsAdding(false);
      setFormData({ client_name: "", comment: "", rating: 5 });
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-black text-foreground">Guest Voices</h2>
          <button 
            onClick={handleRefresh}
            className="p-2.5 bg-foreground/5 text-foreground/40 rounded-xl hover:text-primary transition-all active:scale-95 border border-foreground/5"
            title="Refresh Sentiment"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsAdding(true)}
            className="px-6 py-2.5 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Guest Voice
          </button>
           <div className="px-5 py-2.5 bg-white rounded-2xl border border-foreground/10 flex items-center gap-3 shadow-sm">
              <Star className="w-5 h-5 text-primary fill-primary" />
              <span className="text-sm font-black text-foreground">
                {initialReviews.length > 0
                  ? (initialReviews.reduce((acc, curr) => acc + curr.rating, 0) / initialReviews.length).toFixed(1)
                  : "0.0"} Avg Rating
              </span>
           </div>
           <div className="px-5 py-2.5 bg-white rounded-2xl border border-foreground/10 flex items-center gap-3 shadow-sm">
              <MessageCircle className="w-5 h-5 text-foreground/30" />
              <span className="text-sm font-black text-foreground">{initialReviews.length} Reviews</span>
           </div>
        </div>
      </div>

      {/* Manual Review Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-500">
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 relative border border-foreground/10 animate-in fade-in zoom-in duration-300">
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-8 right-8 p-3 rounded-full hover:bg-foreground/5 transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
              
              <h3 className="text-2xl font-black text-foreground uppercase tracking-tight italic mb-2">New Expedition Voice</h3>
              <p className="text-foreground/50 text-sm mb-8">Record an authentic guest testimonial into the permanent registry.</p>
              
              <form onSubmit={handleCreate} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-2">Explorer Name</label>
                    <input 
                      required
                      value={formData.client_name}
                      onChange={e => setFormData({...formData, client_name: e.target.value})}
                      className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-2 focus:ring-primary transition-all shadow-inner"
                      placeholder="e.g. Marcus Thorne"
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-2">Sentiment Score</label>
                    <div className="flex items-center gap-2 bg-foreground/5 w-fit p-2 rounded-2xl shadow-inner">
                       {[1,2,3,4,5].map(num => (
                         <button
                           key={num}
                           type="button"
                           onClick={() => setFormData({...formData, rating: num})}
                           className={`p-2 rounded-xl transition-all ${formData.rating >= num ? 'text-primary scale-110' : 'text-foreground/10'}`}
                         >
                           <Star className={`w-6 h-6 ${formData.rating >= num ? 'fill-primary' : ''}`} />
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-2">Verified Testimonial</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.comment}
                      onChange={e => setFormData({...formData, comment: e.target.value})}
                      className="w-full bg-foreground/5 border-none rounded-3xl px-6 py-4 font-medium text-foreground focus:ring-2 focus:ring-primary transition-all resize-none shadow-inner"
                      placeholder="The Serengeti expedition was transformative..."
                    />
                 </div>

                 <button 
                    disabled={submitting}
                    className="w-full bg-black text-primary font-black uppercase tracking-widest py-5 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl"
                 >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize & Publish"}
                 </button>
              </form>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-[2.5rem] border border-foreground/10 p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col relative group">
            {/* Header / Rating */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-1.5 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-foreground/10'}`} 
                  />
                ))}
              </div>
              <button 
                onClick={() => {
                    setDeleteId(review.id);
                    setDeleteTitle(review.client_name || review.user_name || "Guest Feedback");
                }}
                className="opacity-0 group-hover:opacity-100 p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Comment Body */}
            <div className="flex-1 mb-8">
               <p className="text-foreground/80 font-medium italic leading-relaxed text-lg">
                 "{review.comment || "No comment provided by explorer."}"
               </p>
            </div>

            {/* Footer / Context */}
            <div className="pt-6 border-t border-foreground/5 space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary text-xs tracking-tighter">
                    {review.source === 'instagram' ? <InstagramIcon className="w-5 h-5" /> : (review.user_name || "AT")?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-foreground">
                      {review.source === 'instagram' ? `@${review.user_name}` : (review.user_name || "Anonymous Traveler")}
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-1">
                       <Clock className="w-3 h-3" /> {new Date(review.created_at).toLocaleDateString()}
                       {review.source === 'instagram' && (
                         <span className="flex items-center gap-1 ml-2 text-[#E1306C] font-black">
                           <InstagramIcon className="w-3 h-3" /> Instagram
                         </span>
                       )}
                    </span>
                  </div>
               </div>
               
               <div className="bg-foreground/5 px-4 py-2 rounded-xl flex items-center gap-2 border border-foreground/10">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-tighter truncate">
                    {review.packages?.title || "Custom Safari"}
                  </span>
               </div>

               {review.source === 'local' && !review.is_approved && (
                 <div className="flex items-center gap-2 pt-4 border-t border-yellow-500/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600 bg-yellow-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1">
                       <Clock className="w-3 h-3" /> Pending Authorization
                    </span>
                    <button 
                      onClick={() => handleApprove(review.id)}
                      disabled={approving === review.id}
                      className="ml-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 bg-green-500/5 px-3 py-1.5 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                    >
                      {approving === review.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                      Authorize
                    </button>
                 </div>
               )}
            </div>
          </div>
        ))}
        {initialReviews.length === 0 && (
          <div className="col-span-full py-40 bg-foreground/5 rounded-[4rem] border border-dashed border-foreground/20 text-center">
             <MessageCircle className="w-20 h-20 mx-auto mb-6 text-foreground/5" />
             <p className="text-foreground/20 font-black text-3xl uppercase tracking-tighter">Silence in the Savannah</p>
             <p className="text-foreground/30 font-medium mt-2">Feedback from your latest expeditions will materialize here.</p>
          </div>
        )}
      </div>
      <DeleteConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={deleteTitle}
        loading={deleting}
      />
    </div>
  );
}
