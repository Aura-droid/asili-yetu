"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  message = "Are you sure you want to permanently delete this record? This action cannot be undone.",
  isLoading = false,
}: DeleteConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-black/20 border border-black/5 overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-foreground/40" />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 pt-2">
              <h3 className="text-2xl font-black text-foreground italic uppercase tracking-tight mb-3 leading-none">
                {title}
              </h3>
              <p className="text-sm font-medium text-foreground/60 leading-relaxed">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="p-8 flex items-center gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 h-14 rounded-2xl border border-black/10 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:bg-black/5 hover:text-foreground transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 h-14 rounded-2xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Asset
                  </>
                )}
              </button>
            </div>
            
            {/* Warning Strip */}
            <div className="bg-rose-500/5 py-4 px-8 border-t border-rose-500/10">
              <p className="text-[9px] font-black text-rose-500/60 uppercase tracking-widest text-center">
                Critical Operation: Unauthorized deletion is prohibited
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
