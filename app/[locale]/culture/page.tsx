import React from "react";
import { getTranslations } from "next-intl/server";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, Music, History } from "lucide-react";
import ClientCultureView from "./ClientCultureView";
import { getCultureStories } from "@/app/actions/culture";

export const metadata = {
  title: "Cultural Immersion | Maasai Heritage",
  description: "Experience the living heart of the savannah through the eyes of the Maasai people.",
};

export default async function CulturePage() {
  const t = await getTranslations("Culture");
  const stories = await getCultureStories();

  return (
    <main className="min-h-screen pt-32 pb-20 overflow-hidden bg-[#fafafa]">
       {/* Hero Section */}
       <div className="container mx-auto max-w-7xl px-6 mb-24 md:mb-32">
          <div className="flex flex-col lg:flex-row items-end gap-12">
             <div className="flex-1">
                <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block">Living Traditions</span>
                <h1 className="text-6xl md:text-[7rem] font-black text-foreground italic uppercase tracking-tighter leading-[0.9] mb-8">
                   The <span className="text-primary italic">Maasai</span> <br/> 
                   <span className="opacity-20 italic">Bloodline</span>
                </h1>
                <p className="text-xl md:text-2xl text-foreground/50 font-medium max-w-xl leading-relaxed">
                   Step into the ancient rhythms of the savannah. We invite you to experience the deep-rooted wisdom, vibrant tapestry, and enduring strength of the Maasai people.
                </p>
             </div>
             
             <div className="w-full lg:w-1/3">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white p-6 rounded-[2rem] border border-foreground/5 shadow-sm text-center">
                      <Music className="w-8 h-8 mx-auto mb-3 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block mb-1">Ritual</span>
                      <span className="text-sm font-bold text-foreground">Adammu Dance</span>
                   </div>
                   <div className="bg-white p-6 rounded-[2rem] border border-foreground/5 shadow-sm text-center translate-y-8">
                      <Heart className="w-8 h-8 mx-auto mb-3 text-red-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block mb-1">Kinship</span>
                      <span className="text-sm font-bold text-foreground">Manyatta Life</span>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <ClientCultureView stories={stories} />
       
       {/* Cultural Values Section */}
       <section className="bg-foreground text-background py-32 mt-32 rounded-[4rem] mx-6">
          <div className="container mx-auto max-w-6xl px-6">
             <div className="text-center mb-24">
                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">Values of the <span className="text-primary italic">Savannah</span></h2>
                <div className="w-24 h-1 bg-primary mx-auto opacity-50" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center group">
                   <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto mb-8 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:text-black transition-all">
                      <ShieldCheck className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-widest mb-4 italic">Guardianship</h3>
                   <p className="text-background/40 font-medium">Coexisting with the wildlife as the ultimate stewards of the ecosystem for millennia.</p>
                </div>

                <div className="text-center group">
                   <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto mb-8 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:text-black transition-all">
                      <History className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-widest mb-4 italic">Ancestry</h3>
                   <p className="text-background/40 font-medium">Stories passed down through oral tradition, echoing from the dawn of humanity.</p>
                </div>

                <div className="text-center group">
                   <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto mb-8 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:text-black transition-all">
                      <Music className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-widest mb-4 italic">Expression</h3>
                   <p className="text-background/40 font-medium">Every colored bead, every rhythmic jump, a celebration of the spirit of Africa.</p>
                </div>
             </div>
          </div>
       </section>
    </main>
  );
}
