export const dynamic = "force-dynamic";
import { getPackages, getDestinations } from "@/app/actions/packages";
import PackagesUI from "./PackagesUI";
import { Package, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Admin | Packages Management",
};

export default async function AdminPackagesPage() {
  const { data: packages, error } = await getPackages();
  const { data: destinations, error: destError } = await getDestinations();

  if (error === 'needs_migration' || destError) {
    return (
      <div className="p-12 text-center max-w-2xl mx-auto mt-20 bg-red-500/10 border border-red-500/30 rounded-3xl">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-foreground mb-4">Database Signal Error</h2>
        <p className="text-foreground/70 mb-4">
          Failed to synchronize with the mission atlas.
        </p>
        <div className="bg-black/5 p-4 rounded-xl text-left font-mono text-xs overflow-auto max-h-40">
           {error && <div>Packages Error: {error}</div>}
           {destError && <div>Destinations Error: {destError}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 w-full mb-32 bg-background min-h-screen">
       <div className="flex items-center gap-6 mb-12">
          <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm">
             <Package className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-foreground tracking-tighter">Expedition Atlas</h1>
            <p className="text-foreground/50 text-xl font-medium mt-1">Design and deploy safari packages to the global showcase.</p>
          </div>
       </div>

       <PackagesUI initialPackages={packages || []} destinations={destinations || []} />
    </div>
  );
}
