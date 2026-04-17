"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { generateBusinessInsight } from "@/app/actions/ai";
import { useLoading } from "@/providers/LoadingProvider";

interface AdminAIInsightsProps {
  metrics: {
    totalInquiries: number;
    conversionRate: number;
    totalRevenue: number;
    avgYield: number;
  };
}

export default function AdminAIInsights({ metrics }: AdminAIInsightsProps) {
  const [insight, setInsight] = useState<{ summary: string; strategy: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setIsLoading } = useLoading();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    const res = await generateBusinessInsight(metrics);
    setIsLoading(false);
    
    if (res.success && res.summary && res.strategy) {
      setInsight({ summary: res.summary, strategy: res.strategy });
    } else {
      setError(res.error || "The Savannah is silent. Please check your AI connection.");
    }
  };

  return (
    <div className="mt-12 group">
      <AnimatePresence mode="wait">
        {!insight ? (
          <motion.div 
            key="cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-primary/10 border border-primary/30 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-primary/20 hover:border-primary/40 transition-all shadow-xl shadow-primary/5"
          >
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-primary text-black rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform">
                   <Zap className="w-8 h-8 fill-black" />
                </div>
                <div>
                   <h4 className="text-xl font-black text-foreground italic uppercase tracking-tighter">Savannah <span className="text-primary">Intelligence</span></h4>
                   <p className="text-foreground/50 text-sm font-medium">Request a high-fidelity business audit from Gemini AI.</p>
                </div>
             </div>
             
             <button 
               onClick={handleAnalyze}
               className="bg-white text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-primary transition-all active:scale-95 shadow-sm"
             >
                Analyze Ecosystem <ArrowRight className="w-4 h-4" />
             </button>
          </motion.div>
        ) : (
          <motion.div 
            key="insight"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 relative overflow-hidden"
          >
             {/* Background Aura */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
             
             <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-6">
                <Sparkles className="w-4 h-4" /> Live AI Deployment
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                <div>
                   <span className="block text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">Semantic Summary</span>
                   <p className="text-white text-lg font-medium leading-relaxed italic border-l-4 border-primary pl-6">
                      "{insight.summary}"
                   </p>
                </div>
                <div>
                   <span className="block text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">Strategic suggestion</span>
                   <p className="text-white/80 text-sm leading-relaxed mb-6">
                      {insight.strategy}
                   </p>
                   <div className="flex items-center gap-2 text-green-400 text-[10px] font-black uppercase tracking-widest py-2 px-4 bg-green-400/10 rounded-full w-fit border border-green-400/20">
                      <ShieldCheck className="w-3 h-3" /> ROI Maximization Path
                   </div>
                </div>
             </div>

             <button 
                onClick={() => setInsight(null)}
                className="mt-10 text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
             >
                Reset Analysis
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center gap-2 text-red-400 text-xs font-bold px-4"
        >
          <AlertCircle className="w-4 h-4" /> {error}
        </motion.div>
      )}
    </div>
  );
}
