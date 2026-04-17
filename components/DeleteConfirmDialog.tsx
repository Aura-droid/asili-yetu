"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X, ShieldAlert } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  loading?: boolean;
}

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, title, loading }: DeleteConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop with extreme blur and dark tint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-white dark:bg-zinc-950 border border-red-500/20 w-full max-w-md rounded-[2.5rem] p-10 relative overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
          >
            {/* Background Tactical Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Animated Danger Icon */}
              <div className="relative mb-8">
                <motion.div 
                   animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 bg-red-500 rounded-full blur-2xl" 
                />
                <div className="w-20 h-20 rounded-[2rem] bg-red-505/10 border border-red-500/20 flex items-center justify-center relative z-10 bg-white shadow-xl">
                  <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-foreground mb-4 uppercase italic tracking-tighter leading-none">
                Confirm <span className="text-red-500 underline decoration-red-500/20 decoration-4">Purge</span>
              </h3>
              
              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 mb-8 w-full">
                <p className="text-foreground/60 text-xs font-medium leading-relaxed">
                  You are about to permanently delete <br/>
                  <span className="text-foreground font-black italic uppercase tracking-tight text-sm break-all">"{title}"</span>
                </p>
                <p className="mt-4 text-[9px] font-black text-red-500 uppercase tracking-widest opacity-60">
                  This action is irreversible and recorded in the audit log.
                </p>
              </div>

              <div className="flex w-full gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-5 px-6 rounded-2xl border border-foreground/10 text-foreground/40 font-black uppercase text-[10px] tracking-widest hover:bg-foreground/5 transition-all disabled:opacity-50"
                >
                  Abort Deletion
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 py-5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest shadow-[0_15px_30px_rgba(220,38,38,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Execute Purge
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Corner Close Button */}
            <button
              onClick={onClose}
              className="absolute top-8 right-8 p-3 rounded-xl hover:bg-foreground/5 transition-all text-foreground/20 hover:text-foreground/40"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
