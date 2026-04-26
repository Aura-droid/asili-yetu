import { getTranslations } from "next-intl/server";
import { Hammer, Timer, Construction, ShieldCheck } from "lucide-react";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: "System Maintenance | Asili Yetu",
    description: "Our digital savannah is undergoing a scheduled upgrade."
  };
}

export default async function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
           <div className="relative w-24 h-24 bg-foreground/5 rounded-3xl p-4 border border-foreground/10">
              <Image 
                src="/brand/asili-yetu-brand.jpg" 
                alt="Asili Yetu" 
                fill 
                className="object-cover rounded-2xl grayscale opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Construction className="w-10 h-10 text-primary animate-pulse" />
              </div>
           </div>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.3em]">
             <ShieldCheck className="w-4 h-4" />
             Operational Refinement in Progress
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none italic">
            Savannah <span className="text-primary underline decoration-primary/30 underline-offset-8 italic">Maintenance</span>
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto font-medium">
            We are currently recalibrating our digital ecosystem to better serve your next expedition. The wild will be back online shortly.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-8">
           <div className="p-6 rounded-3xl bg-foreground/5 border border-foreground/5 flex flex-col items-center gap-3">
              <Hammer className="w-6 h-6 text-primary/60" />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center leading-tight">Forging New Systems</span>
           </div>
           <div className="p-6 rounded-3xl bg-foreground/5 border border-foreground/5 flex flex-col items-center gap-3">
              <Timer className="w-6 h-6 text-primary/60" />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center leading-tight">Estimated Uptime: 2h</span>
           </div>
           <div className="p-6 rounded-3xl bg-foreground/5 border border-foreground/5 flex flex-col items-center gap-3">
              <Construction className="w-6 h-6 text-primary/60" />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center leading-tight">Elite Maintenance</span>
           </div>
        </div>

        <div className="pt-12 text-foreground/20 text-[10px] font-black uppercase tracking-[0.5em] italic">
           Asili Yetu Safaris Limited &copy; 2026
        </div>
      </div>
    </div>
  );
}
