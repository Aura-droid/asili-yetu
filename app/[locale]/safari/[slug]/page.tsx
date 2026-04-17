import { Metadata } from 'next';
import { supabase } from "@/lib/supabase";
import { getTranslations } from "next-intl/server";
import BiomePackageCard from "@/components/BiomePackageCard";
import { Compass, MapPin, Calendar, Clock, Gauge } from "lucide-react";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  
  // Parse slug: e.g., "serengeti-safari-in-july"
  const parts = slug.split('-safari-in-');
  const park = parts[0]?.replace(/-/g, ' ') || "Tanzania";
  const month = parts[1] || "";
  
  const title = month 
    ? `Best ${park} Safari in ${month.charAt(0).toUpperCase() + month.slice(1)} 2026 | Asili Yetu`
    : `Expert ${park} Safari Expeditions | Asili Yetu Safaris`;

  return {
    title,
    description: `Book your dream ${park} safari ${month ? `for ${month}` : ''}. Local expert guides, private 4x4 vehicles, and authentic cultural encounters.`,
    alternates: {
       canonical: `/safari/${slug}`
    }
  };
}

export default async function SafariDirectoryPage({ params }: Props) {
  const { slug, locale } = await params;
  const parts = slug.split('-safari-in-');
  const parkQuery = parts[0]?.replace(/-/g, ' ') || "";
  const month = parts[1] || "";

  // Fetch bundles that mention this park or are at this destination
  const { data: packages, error } = await supabase
    .from("packages")
    .select("*, destinations!inner(name, id)")
    .ilike('destinations.name', `%${parkQuery}%`);

  const t = await getTranslations("Packages");

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <MapPin className="w-3 h-3" /> Targeted Safari Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase italic leading-none mb-6">
             {parkQuery} <span className="text-primary">Safari</span> {month && <span className="text-foreground/30">in {month}</span>}
          </h1>
          <p className="text-foreground/50 text-xl font-medium max-w-2xl leading-relaxed">
             This curated selection of expeditions is optimized for the unique {month ? `${month} season` : 'geographic profile'} of {parkQuery}. 
             Experience the wild through the lens of local Tanzanian expertise.
          </p>
        </div>

        {packages && packages.length > 0 ? (
          <div className="grid grid-cols-1 gap-12">
             {packages.map(pkg => (
                <BiomePackageCard key={pkg.id} pkg={pkg} />
             ))}
          </div>
        ) : (
          <div className="p-20 bg-foreground/5 rounded-[3.5rem] border border-dashed border-foreground/10 text-center">
             <Compass className="w-16 h-16 mx-auto mb-6 text-foreground/10 animate-pulse" />
             <h3 className="text-2xl font-black italic uppercase">No Specific Matches in Transit</h3>
             <p className="text-foreground/40 mt-2">However, our Master Guides can custom-tailor a {parkQuery} expedition for {month || 'your preferred dates'}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
