"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X, ExternalLink } from "lucide-react";

interface OperationStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
}

export default function OperationStatusDialog({ isOpen, onClose, type, title, message }: OperationStatusDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className={`h-2 w-full ${type === 'success' ? 'bg-[#25D366]' : 'bg-destructive'}`} />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-foreground/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5 opacity-30" />
            </button>

            <div className="p-8 text-center">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${type === 'success' ? 'bg-[#25D366]/10 text-[#25D366]' : 'bg-destructive/10 text-destructive'}`}>
                {type === 'success' ? <CheckCircle2 className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
              </div>

              <h2 className="text-2xl font-black italic tracking-tighter mb-2 uppercase">{title}</h2>
              <p className="text-foreground/60 leading-relaxed font-medium mb-8">
                {message}
              </p>

              <button
                onClick={onClose}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 ${type === 'success' ? 'bg-[#1a1a1a] text-white hover:bg-black shadow-lg shadow-black/10' : 'bg-destructive text-white hover:opacity-90'}`}
              >
                Acknowledge Signal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
