import { Metadata } from 'next';
import { supabase } from "@/lib/supabase";
import { getTranslations } from "next-intl/server";
import { X, MapPin, Clock, User, Layers, Thermometer, Zap, Compass, CheckCircle2, Plane, Bed, Utensils, Ticket, Car, HeartPulse, Eye, Wifi, ArrowLeft, Droplets } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import StarRating from "@/components/StarRating";
import ItineraryMap from "@/components/ItineraryMap";
import RustlingButton from "@/components/RustlingButton";
import StructuredData from "@/components/StructuredData";
import BookingFunnelWrapper from "../../../../components/BookingFunnelWrapper";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

const INCLUSION_META: Record<string, { label: string, icon: any }> = {
  airport: { label: 'Airport Transfers', icon: Plane },
  accommodation: { label: 'Luxury Accommodation', icon: Bed },
  meals: { label: 'Full Board Meals', icon: Utensils },
  park_fees: { label: 'National Park Fees', icon: Ticket },
  vehicle: { label: '4x4 Land Cruiser', icon: Car },
  guide: { label: 'Professional Guide', icon: User },
  water: { label: 'Bottled Water', icon: Droplets },
  insurance: { label: 'Emergency Evacuation', icon: HeartPulse },
  binoculars: { label: 'High-End Binoculars', icon: Eye },
  wifi: { label: 'Onboard Wi-Fi', icon: Wifi },
};



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  
  const { data: pkg } = await supabase
    .from("packages")
    .select("*, destinations(name)")
    .eq('id', id)
    .single();

  if (!pkg) return { title: "Package Not Found" };

  return {
    title: `${pkg.title} | ${pkg.destinations?.name || 'Safari'}`,
    description: pkg.description?.slice(0, 155),
    openGraph: {
      title: pkg.title,
      description: pkg.description?.slice(0, 160),
      images: [pkg.main_image || ''],
    },
    alternates: {
      canonical: `/packages/${id}`
    }
  };
}

export default async function PackageDossierPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations("Packages");

  const { data: pkg } = await supabase
    .from("packages")
    .select("*, destinations(name, image_url)")
    .eq('id', id)
    .single();

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Expedition Lost in Transit</h1>
          <Link href={`/${locale}/packages`} className="text-primary font-bold underline">Return to Headquarters</Link>
        </div>
      </div>
    );
  }

  const itinerary = pkg.itinerary?.length > 0 ? pkg.itinerary : [];
  
  const tierMetaMap: Record<string, { label: string; className: string }> = {
    budget: { label: t("tier_budget"), className: "bg-emerald-500/20 border-emerald-400/30 text-emerald-100" },
    mid_range: { label: t("tier_mid_range"), className: "bg-amber-400/20 border-amber-300/30 text-amber-50" },
    luxury: { label: t("tier_luxury"), className: "bg-fuchsia-500/20 border-fuchsia-300/30 text-fuchsia-50" },
  };
  const tierMeta = tierMetaMap[pkg.package_tier || "mid_range"] || tierMetaMap.mid_range;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asiliyetusafaris.com';

  const tripSchema = {
    "@type": "Trip",
    "name": pkg.title,
    "description": pkg.description,
    "image": pkg.main_image || pkg.destinations?.image_url,
    "touristType": "Wildlife Enthusiasts",
    "offers": {
      "@type": "Offer",
      "price": pkg.discount_price || pkg.price_usd,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": `${baseUrl}/${locale}/packages/${pkg.id}`
    },
    "itinerary": itinerary.map((item: any, index: number) => ({
      "@type": "City",
      "name": item.destination,
      "position": index + 1
    })),
    "provider": {
      "@type": "Organization",
      "name": "Asili Yetu Safaris",
      "url": baseUrl
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <StructuredData type="Trip" data={tripSchema} />
      
      {/* Cinematic Hero Header */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        <Image 
          src={pkg.main_image || pkg.destinations?.image_url || ""} 
          alt={pkg.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute top-32 left-6 md:left-12 z-20">
          <Link 
            href={`/${locale}/packages`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> {t("back_to_safaris")}
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-6">
             {pkg.is_featured && (
               <div className="bg-primary text-black text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                 {t("masterpiece_edition")}
               </div>
             )}
             <div className={`border text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg ${tierMeta.className}`}>
               {tierMeta.label}
             </div>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
             {pkg.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-white/80">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">{pkg.destinations?.name || "Tanzania"}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">{pkg.duration_days} {t("days")}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <StarRating rating={pkg.avg_rating || 5} reviewsCount={pkg.review_count || 124} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-20 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Map Section */}
            <div className="bg-foreground/5 rounded-[3rem] p-4 border border-foreground/10 overflow-hidden shadow-2xl">
               <ItineraryMap itinerary={itinerary} />
            </div>

            {/* Vibe Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-foreground/5 p-6 rounded-3xl border border-foreground/10">
                  <Layers className="w-6 h-6 text-primary mb-3" />
                  <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Biome</p>
                  <p className="text-sm font-bold">{pkg.biome_orientation || "Savannah"}</p>
               </div>
               <div className="bg-foreground/5 p-6 rounded-3xl border border-foreground/10">
                  <Thermometer className="w-6 h-6 text-primary mb-3" />
                  <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Thermal</p>
                  <p className="text-sm font-bold">{pkg.temperature_profile || "Warm"}</p>
               </div>
               <div className="bg-foreground/5 p-6 rounded-3xl border border-foreground/10">
                  <Zap className="w-6 h-6 text-primary mb-3" />
                  <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Intensity</p>
                  <p className="text-sm font-bold">{pkg.intensity_vibe || "Balanced"}</p>
               </div>
               <div className="bg-foreground/5 p-6 rounded-3xl border border-foreground/10">
                  <Compass className="w-6 h-6 text-primary mb-3" />
                  <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Difficulty</p>
                  <p className="text-sm font-bold uppercase">{pkg.difficulty_level}</p>
               </div>
            </div>

            {/* Description */}
            <div>
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                     <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-foreground/40 italic">Expedition Concept</h3>
               </div>
               <p className="text-2xl font-medium text-foreground/80 leading-relaxed">
                  {pkg.description}
               </p>
            </div>

            {/* Inclusions */}
            {pkg.inclusions && pkg.inclusions.length > 0 && (
               <div>
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                        <CheckCircle2 className="w-6 h-6" />
                     </div>
                     <h3 className="text-xl font-bold uppercase tracking-widest text-foreground/40 italic">Strategic Inclusions</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {pkg.inclusions.map((incId: string) => {
                       const meta = INCLUSION_META[incId];
                       if (!meta) return null;
                       const Icon = meta.icon;
                       return (
                         <div key={incId} className="bg-foreground/[0.03] border border-foreground/5 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-center group hover:bg-primary transition-all duration-500">
                            <Icon className="w-8 h-8 text-primary group-hover:text-black transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 group-hover:text-black leading-tight transition-colors">
                               {meta.label}
                            </span>
                         </div>
                       );
                     })}
                  </div>
               </div>
            )}
          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:sticky lg:top-32 h-fit space-y-6">
             <div className="bg-foreground/5 backdrop-blur-xl rounded-[3rem] p-8 border border-foreground/10 shadow-2xl">
                <p className="text-xs font-black text-foreground/30 uppercase tracking-widest mb-4">Starting Investment</p>
                <div className="flex items-baseline gap-2 mb-8">
                   <span className="text-6xl font-black text-primary">${pkg.discount_price || pkg.price_usd}</span>
                   <span className="text-foreground/40 font-bold uppercase text-xs">/ per person</span>
                </div>
                
                <BookingFunnelWrapper 
                  packageId={pkg.id} 
                  packageTitle={pkg.title}
                  buttonClassName="w-full bg-primary text-black py-6 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl hover:scale-[1.02] transition-transform"
                />
                
                <p className="text-[10px] font-medium text-foreground/30 italic text-center mt-6">
                   ★ Price is negotiable based on group size & season. Customizations available.
                </p>
             </div>
             
             <div className="bg-primary/10 rounded-[2rem] p-6 border border-primary/20">
                <h4 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                   <User className="w-4 h-4" /> Local Expertise
                </h4>
                <p className="text-xs text-foreground/60 leading-relaxed font-medium">
                   This expedition is managed by our Arusha headquarters. You will have a private 4x4 Land Cruiser and a professional Tanzanian guide.
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
