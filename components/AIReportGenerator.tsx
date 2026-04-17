"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Sparkles, ArrowUpRight, ShieldCheck, AlertCircle, Loader2, X } from "lucide-react";
import { generateBusinessInsight } from "@/app/actions/ai";

interface AIReportGeneratorProps {
  metrics: {
    totalInquiries: number;
    conversionRate: number;
    totalRevenue: number;
    avgYield: number;
  };
}

export default function AIReportGenerator({ metrics }: AIReportGeneratorProps) {
  const [insight, setInsight] = useState<{ summary: string; strategy: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await generateBusinessInsight(metrics);
      if (res.success && res.summary && res.strategy) {
        setInsight({ summary: res.summary, strategy: res.strategy });
      } else {
        setError(res.error || "The Savannah is silent. Please check your AI connection.");
      }
    } catch (err) {
      setError("Failed to reach the intelligence core.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full">
      <AnimatePresence mode="wait">
        {!insight ? (
          <motion.div 
            key="cta"
            onClick={handleGenerate}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-primary rounded-[3rem] p-10 text-black h-full flex flex-col justify-between group hover:bg-black hover:text-white transition-all duration-500 cursor-pointer shadow-2xl shadow-primary/20 relative overflow-hidden"
          >
            {/* Background sparkle effect on hover */}
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
            
            <div className="relative z-10">
              {loading ? (
                <Loader2 className="w-10 h-10 mb-6 animate-spin text-black group-hover:text-primary" />
              ) : (
                <Zap className="w-10 h-10 mb-6 group-hover:animate-bounce text-black group-hover:text-primary" />
              )}
              <h3 className="text-2xl font-black italic uppercase leading-[0.9] transition-colors">
                {loading ? "Generating..." : <>Generate<br />Weekly Report</>}
              </h3>
              <p className="text-[10px] font-bold mt-4 uppercase tracking-widest opacity-50">
                {loading ? "Decrypting metrics..." : "Last synced 5m ago"}
              </p>
            </div>
            
            <ArrowUpRight className={`w-12 h-12 self-end transition-all ${loading ? 'opacity-0' : 'opacity-20 group-hover:opacity-100 group-hover:translate-x-2 group-hover:-translate-y-2'}`} />
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-black text-white rounded-[3rem] p-10 h-full flex flex-col justify-between border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Sparkles className="w-32 h-32" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.4em]">
                  <Sparkles className="w-4 h-4" /> AI Report
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setInsight(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                   <span className="block text-white/40 text-[9px] font-black uppercase tracking-widest mb-2">Executive Summary</span>
                   <p className="text-white text-base font-bold italic leading-tight">"{insight.summary}"</p>
                </div>
                <div>
                   <span className="block text-white/40 text-[9px] font-black uppercase tracking-widest mb-2">Tactical Strategy</span>
                   <p className="text-white/70 text-xs leading-relaxed">{insight.strategy}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-green-400 text-[9px] font-black uppercase tracking-widest py-2 px-4 bg-green-400/10 rounded-full w-fit border border-green-400/20">
               <ShieldCheck className="w-3 h-3" /> ROI Maximization Path
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider"
        >
          <AlertCircle className="w-4 h-4" /> {error}
        </motion.div>
      )}
    </div>
  );
}
