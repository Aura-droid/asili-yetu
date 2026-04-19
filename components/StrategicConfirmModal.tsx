"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, AlertTriangle } from "lucide-react";

interface StrategicConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmIcon?: any;
  variant?: 'primary' | 'danger';
  isLoading?: boolean;
}

export default function StrategicConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmIcon: ConfirmIcon = Send,
  variant = 'primary',
  isLoading = false,
}: StrategicConfirmModalProps) {
  const accentColor = variant === 'danger' ? 'bg-rose-500' : 'bg-black';
  const iconBg = variant === 'danger' ? 'bg-rose-50' : 'bg-primary/10';
  const iconColor = variant === 'danger' ? 'text-rose-500' : 'text-primary';

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
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-black/5"
          >
            {/* Header / Graphic */}
            <div className="p-8 pb-4 flex items-center justify-between">
              <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center`}>
                <ConfirmIcon className={`w-7 h-7 ${iconColor}`} />
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full hover:bg-black/5 flex items-center justify-center transition-all bg-white"
              >
                <X className="w-6 h-6 text-black/20" />
              </button>
            </div>

            {/* Content */}
            <div className="px-10 pt-4">
              <h3 className="text-3xl font-black text-foreground italic uppercase tracking-tighter mb-4 leading-none">
                {title}
              </h3>
              <p className="text-sm font-bold text-foreground/50 leading-loose">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="p-10 flex flex-col gap-3">
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`w-full h-16 rounded-2xl ${accentColor} ${variant === 'danger' ? 'text-white' : 'text-primary'} text-xs font-black uppercase tracking-[0.3em] hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ConfirmIcon className="w-4 h-4" />
                    {confirmText}
                  </>
                )}
              </button>
              
              <button
                onClick={onClose}
                disabled={isLoading}
                className="w-full h-16 rounded-2xl border border-black/5 text-[10px] font-black uppercase tracking-widest text-black/30 hover:bg-black/5 hover:text-black transition-all disabled:opacity-50"
              >
                Hold Transmission
              </button>
            </div>
            
            <div className="bg-black py-4 px-10">
               <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.4em] text-center">
                  Precision Protocol • Asili Yetu HQ
               </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
