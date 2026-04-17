"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Loader2, Mail, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function NewsletterCapture() {
  const t = useTranslations("Newsletter");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const locale = params?.locale as string || "en";

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await subscribeToNewsletter(email, locale);

    if (res.success) {
      setSuccess(true);
      setEmail("");
    } else {
      setError(res.error || t("error"));
    }
    setLoading(false);
  };

  return (
    <div className="relative overflow-hidden p-8 md:p-12 rounded-[3.5rem] bg-foreground/5 border border-foreground/5 shadow-inner group">
      {/* Visual Accents */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] transform translate-x-1/4 -translate-y-1/4">
         <Mail className="w-64 h-64 rotate-12" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto text-center">
         <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex -space-x-3">
               {[
                 "/tourists/joseph-gonzalez-iFgRcqHznqg-unsplash.jpg",
                 "/tourists/stefan-stefancik-QXevDflbl8A-unsplash.jpg",
                 "/tourists/diego-hernandez-MSepzbKFz10-unsplash.jpg"
               ].map((url, i) => (
                  <div key={i} className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-foreground/10 group-hover:scale-110 transition-transform duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
                    <img 
                      src={url} 
                      alt="Explorer Avatar" 
                      className="w-full h-full object-cover grayscale-[0.2]" 
                    />
                  </div>
               ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 italic ml-4">{t("explorers")}</span>
         </div>
         
         <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tighter uppercase italic leading-none mb-4">
            {t.rich("title", {
               p: (chunks) => <span className="text-primary italic">{chunks}</span>
            })}
         </h2>
         <p className="text-foreground/40 font-medium text-sm md:text-base mb-10 max-w-sm mx-auto">
            {t("sub")}
         </p>

         <AnimatePresence mode="wait">
            {!success ? (
               <motion.form 
                 key="form"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 onSubmit={handleSubscribe} 
                 className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-[2.5rem] shadow-2xl border border-foreground/5"
               >
                  <div className="flex-1 w-full px-6 flex items-center gap-4">
                     <Mail className="w-5 h-5 text-foreground/20 shrink-0" />
                     <input 
                       type="email" 
                       required
                       placeholder={t("placeholder")} 
                       value={email}
                       onChange={(e) => setEmail(e.currentTarget.value)}
                       className="w-full bg-transparent border-none outline-none font-black text-sm text-foreground placeholder:text-foreground/10 uppercase tracking-tight focus:ring-0" 
                     />
                  </div>
                  <button 
                    disabled={loading}
                    className="h-16 px-10 bg-black text-primary font-black uppercase tracking-widest text-xs rounded-[2rem] hover:bg-primary hover:text-black transition-all group/btn flex items-center justify-center gap-3 disabled:opacity-50 w-full sm:w-auto shadow-xl"
                  >
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t("btn")} <Send className="w-4 h-4 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /></>}
                  </button>
               </motion.form>
            ) : (
               <motion.div 
                 key="success"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-primary/20 p-8 rounded-[3rem] border border-primary/10 text-center"
               >
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight italic">{t("success_title")}</h3>
                  <p className="text-foreground/60 text-sm font-bold uppercase tracking-widest mt-2">{t("success_sub")}</p>
               </motion.div>
            )}
         </AnimatePresence>
         
         {error && <p className="mt-6 text-red-500 text-[10px] font-black uppercase tracking-widest italic">{error}</p>}
      </div>
      
      {/* Floating Sparkles accent */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
         <Sparkles className="w-4 h-4 text-primary animate-pulse" />
      </div>
    </div>
  );
}
