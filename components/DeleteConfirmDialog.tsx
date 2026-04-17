"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#1a1a1a] border border-red-500/30 w-full max-w-md rounded-3xl p-8 relative overflow-hidden shadow-2xl"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_all-red-500/50_via-transparent_to-transparent)]" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>

              <h3 className="text-xl font-black text-white mb-2 leading-tight">Permanent Deletion</h3>
              <p className="text-white/50 text-sm mb-8">
                Are you sure you want to permanently delete <span className="text-white font-bold italic">"{title}"</span>? This action is absolute and cannot be reversed.
              </p>

              <div className="flex w-full gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-4 px-6 rounded-xl border border-white/10 text-white/60 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  Cancel Escape
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 py-4 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Now
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white/40" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
