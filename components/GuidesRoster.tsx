"use client";

import { motion } from "framer-motion";
import { Binoculars, Languages, Award, Map as MapIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

import { useLocale } from "next-intl";

export default function GuidesRoster({ guides }: { guides: any[] }) {
  const locale = useLocale();

  const getLocalizedGuide = (g: any) => {
    if (!g.translations?.[locale]) return { role: g.role, specialty: g.specialty, bio: g.bio };
    const raw = g.translations[locale];
    // Payload: "Role: [ROLE]. Specialty: [SPECIALTY]. Bio: [BIO]"
    const roleMatch = raw.match(/Role:\s*(.*?)\.\s*Specialty:/);
    const specMatch = raw.match(/Specialty:\s*(.*?)\.\s*Bio:/);
    const bioMatch = raw.match(/Bio:\s*(.*)/);

    return {
      role: roleMatch ? roleMatch[1] : g.role,
      specialty: specMatch ? specMatch[1] : g.specialty,
      bio: bioMatch ? bioMatch[1] : g.bio
    };
  };
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 selection:bg-primary selection:text-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-primary font-bold tracking-widest uppercase text-sm mb-6"
          >
            <Binoculars className="w-5 h-5" /> The Heart of the Safari
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[1.1] mb-8"
          >
            Meet Your <span className="text-foreground/50 italic font-serif">Rangers.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-foreground/70 font-medium leading-relaxed"
          >
            A luxury lodge is only a building. A customized 4x4 is only a vehicle. 
            The true magic of the Tanzanian wilderness is unlocked exclusively by the human being sitting behind the wheel.
          </motion.p>
        </div>

        {/* Guides Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          {guides.map((guide) => {
            const local = getLocalizedGuide(guide);
            return (
              <motion.div 
                key={guide.id} 
                variants={itemVariants}
                className="group relative bg-foreground/5 rounded-[2rem] overflow-hidden border border-foreground/10 hover:border-primary/50 transition-colors duration-500 flex flex-col"
              >
                {/* Image Header */}
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                  <Image 
                    src={guide.image_url || guide.image} 
                    alt={guide.name} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
                  />
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
                    <p className="text-primary font-black uppercase tracking-widest text-xs mb-2">{local.role}</p>
                    <h3 className="text-3xl font-black">{guide.name}</h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-8 flex-1 flex flex-col">
                  <p className="text-foreground/70 mb-8 leading-relaxed font-medium">
                    {local.bio}
                  </p>

                  <div className="space-y-4 mt-auto">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-foreground shrink-0 border border-foreground/5">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">Experience</p>
                        <p className="font-bold text-foreground">{guide.experience_years || guide.experience} Years in the Field</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-foreground shrink-0 border border-foreground/5">
                        <MapIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">Specialty</p>
                        <p className="font-bold text-foreground">{local.specialty}</p>
                      </div>
                    </div>

                  <div className="flex items-center gap-4 text-sm pb-2">
                    <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-foreground shrink-0 border border-foreground/5">
                      <Languages className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">Languages</p>
                      <p className="font-bold text-foreground">
                        {Array.isArray(guide.languages) ? guide.languages.join(", ") : guide.languages}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 max-w-4xl mx-auto bg-primary rounded-3xl p-12 md:p-16 text-center text-black relative overflow-hidden shadow-2xl shadow-primary/20"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 blur-3xl rounded-full pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 relative z-10">
            Ready to explore with the best?
          </h2>
          <p className="text-black/70 font-medium text-lg mb-10 max-w-xl mx-auto relative z-10">
            Every Asili Yetu expedition includes a dedicated senior ranger. Let's find the perfect expert to lead your journey.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-3 bg-black text-white px-8 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all outline-none border border-black/10 relative z-10 shadow-xl"
          >
            Start Planning <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
