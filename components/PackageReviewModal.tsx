"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, UserCheck, ShieldCheck, Loader2 } from "lucide-react";
import { createReview } from "@/app/actions/reviews";

interface PackageReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageTitle: string;
  rating: number;
}

export default function PackageReviewModal({ isOpen, onClose, packageTitle, rating }: PackageReviewModalProps) {
  const [clientName, setClientName] = useState("");
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await createReview({
      client_name: isAnonymous ? "Anonymous Explorer" : (clientName || "Guest Explorer"),
      comment,
      rating,
      is_approved: false // Guest reviews require admin approval
    });

    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setClientName("");
        setComment("");
      }, 3000);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-foreground/5 p-8 md:p-12"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2 rounded-full hover:bg-foreground/5 transition-colors"
            >
              <X className="w-6 h-6 text-foreground/20" />
            </button>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-center mb-8">
                   <div className="w-16 h-16 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
                      <Send className="w-8 h-8" />
                   </div>
                   <h3 className="text-3xl font-black text-foreground italic uppercase tracking-tighter leading-none mb-2">
                      Submit Your <span className="text-primary italic">Field Report</span>
                   </h3>
                   <p className="text-foreground/40 font-bold uppercase tracking-widest text-[10px]">Expedition: {packageTitle}</p>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-2">Explorer Identity</label>
                      <div className="relative">
                        <input 
                          disabled={isAnonymous}
                          required={!isAnonymous}
                          value={clientName}
                          onChange={e => setClientName(e.target.value)}
                          className={`w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-2 focus:ring-primary transition-all ${isAnonymous ? 'opacity-30 cursor-not-allowed' : ''}`}
                          placeholder="Your Name (Optional if anonymous)"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                           <button 
                             type="button"
                             onClick={() => setIsAnonymous(!isAnonymous)}
                             className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${isAnonymous ? 'bg-foreground text-background' : 'bg-foreground/5 text-foreground/30'}`}
                           >
                              {isAnonymous ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                              Anon
                           </button>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-2">Expedition Log</label>
                      <textarea 
                        required
                        rows={4}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        className="w-full bg-foreground/5 border-none rounded-3xl px-6 py-4 font-medium text-foreground focus:ring-2 focus:ring-primary transition-all resize-none shadow-inner"
                        placeholder="Share your experience..."
                      />
                   </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full h-16 bg-black text-primary font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Transmit Report"}
                </button>
              </form>
            ) : (
              <div className="py-12 text-center animate-in zoom-in duration-500">
                 <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8">
                    <UserCheck className="w-12 h-12" />
                 </div>
                 <h3 className="text-3xl font-black text-foreground uppercase italic tracking-tighter mb-4">Log Received</h3>
                 <p className="text-foreground/50 font-medium max-w-[280px] mx-auto">
                    Your field report has been transmitted to our rangers for authentication. Thank you for strengthening the Asili registry.
                 </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
