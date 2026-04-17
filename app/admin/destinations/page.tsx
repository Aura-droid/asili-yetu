import { getDestinations } from "@/app/actions/destinations";
import DestinationsUI from "./DestinationsUI";
import { Compass, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Admin | Destinations Explorer",
};

export default async function AdminDestinationsPage() {
  const { data: destinations, error } = await getDestinations();

  if (error === '42P01') {
    return (
      <div className="p-12 text-center max-w-2xl mx-auto mt-20 bg-red-500/10 border border-red-500/30 rounded-3xl">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-foreground mb-4">Database Migration Warning</h2>
        <p className="text-foreground/70">
          The <code>destinations</code> table is currently missing. Please initialize the database with the required territories.
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 w-full mb-32 bg-background min-h-screen">
       <div className="flex items-center gap-6 mb-16">
          <div className="p-5 bg-primary/10 rounded-[2rem] border border-primary/20 shadow-lg">
             <Compass className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-6xl font-black text-foreground tracking-tighter">Wildlife Sanctuary Atlas</h1>
            <p className="text-foreground/50 text-xl font-medium mt-1">Curate and manage the legendary parks and wildlife enclaves of Tanzania.</p>
          </div>
       </div>

       <DestinationsUI initialDestinations={destinations || []} />
    </div>
  );
}
