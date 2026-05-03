import { Metadata } from 'next';
import { supabase } from "@/lib/supabase";
import { getTranslations } from "next-intl/server";
import { MapPin, Sun, Compass, ArrowLeft, Wind, Mountain, Cloud } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import StructuredData from "@/components/StructuredData";
import { getDestinations } from "@/app/actions/destinations";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const { data: destinations } = await getDestinations();
  const dest = destinations?.find((d: any) => d.id === id);

  if (!dest) return { title: "Destination Not Found" };

  return {
    title: `${dest.name} | Safari Destination`,
    description: dest.description?.slice(0, 155),
    openGraph: {
      title: dest.name,
      description: dest.description?.slice(0, 160),
      images: [dest.image_url || ''],
    },
    alternates: {
      canonical: `/destinations/${id}`
    }
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations("Destinations");
  const { data: destinations } = await getDestinations();
  const dest = destinations?.find((d: any) => d.id === id);

  if (!dest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Location Uncharted</h1>
          <Link href={`/${locale}/destinations`} className="text-primary font-bold underline">Return to Atlas</Link>
        </div>
      </div>
    );
  }

  const placeSchema = {
    "@type": "Place",
    "name": dest.name,
    "description": dest.description,
    "image": dest.image_url || dest.image,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": dest.latitude,
      "longitude": dest.longitude
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StructuredData type="Place" data={placeSchema} />
      
      {/* Cinematic Hero */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <Image 
          src={dest.image_url || dest.image || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"} 
          alt={dest.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute top-32 left-6 md:left-12 z-20">
          <Link 
            href={`/${locale}/destinations`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> {t("back_to_atlas")}
          </Link>
          
          <div className="inline-block bg-primary text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
             {dest.type || "National Park"}
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none mb-6">
             {dest.name}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-24 relative z-30 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="bg-foreground/5 backdrop-blur-3xl rounded-[3rem] p-10 md:p-16 border border-foreground/10 shadow-2xl">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                     <Compass className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-widest text-foreground/40 italic">Regional Intelligence</h3>
               </div>
               
               <p className="text-2xl md:text-3xl font-medium text-foreground/80 leading-relaxed mb-16">
                  {dest.description}
               </p>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-foreground/5 p-8 rounded-[2rem] border border-foreground/10 hover:border-primary/30 transition-colors">
                     <div className="flex items-center gap-4 mb-4">
                        <Sun className="w-6 h-6 text-primary" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground/40">Prime Observation Window</h4>
                     </div>
                     <p className="text-xl font-bold">{dest.best_time || dest.bestTime}</p>
                  </div>
                  <div className="bg-foreground/5 p-8 rounded-[2rem] border border-foreground/10 hover:border-primary/30 transition-colors">
                     <div className="flex items-center gap-4 mb-4">
                        <Wind className="w-6 h-6 text-primary" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground/40">Wildlife Density</h4>
                     </div>
                     <p className="text-xl font-bold">{dest.key_wildlife || dest.keyWildlife}</p>
                  </div>
                  <div className="bg-foreground/5 p-8 rounded-[2rem] border border-foreground/10 hover:border-primary/30 transition-colors">
                     <div className="flex items-center gap-4 mb-4">
                        <Mountain className="w-6 h-6 text-primary" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground/40">Territorial Scale</h4>
                     </div>
                     <p className="text-xl font-bold">{dest.size}</p>
                  </div>
                  <div className="bg-foreground/5 p-8 rounded-[2rem] border border-foreground/10 hover:border-primary/30 transition-colors">
                     <div className="flex items-center gap-4 mb-4">
                        <Cloud className="w-6 h-6 text-primary" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground/40">Coordinates</h4>
                     </div>
                     <p className="text-xl font-bold font-mono">{dest.latitude}, {dest.longitude}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
             <div className="bg-primary p-10 rounded-[3rem] shadow-2xl shadow-primary/20">
                <h3 className="text-2xl font-black text-black uppercase tracking-tighter leading-none mb-6">
                   Explore {dest.name}
                </h3>
                <p className="text-black/70 font-bold text-sm leading-relaxed mb-8">
                   Ready to see this geographic masterpiece in person? Our master guides design private expeditions through {dest.name}.
                </p>
                <Link 
                  href={`/${locale}/packages?destination=${dest.id}`}
                  className="inline-flex w-full items-center justify-center bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform"
                >
                   View Safaris
                </Link>
             </div>
             
             <div className="bg-foreground/5 rounded-[3rem] p-8 border border-foreground/10">
                <h4 className="text-xs font-black text-foreground/30 uppercase tracking-widest mb-4">Conservation Note</h4>
                <p className="text-[10px] text-foreground/60 leading-relaxed font-medium">
                   Asili Yetu operates with deep respect for the ecosystem of {dest.name}. A portion of every expedition fee goes directly to local park preservation and community support.
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
