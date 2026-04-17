import { createClient } from "@/utils/supabase/server";
import FleetUI from "./FleetUI";
import { Car } from "lucide-react";

export default async function FleetPage() {
  const supabase = await createClient();
  
  const { data: fleet } = await supabase
    .from('vehicles')
    .select('*')
    .order('model_name', { ascending: true });

  return (
    <div className="p-10 w-full mb-32">
       <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm border border-purple-100">
             <Car className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-foreground">Fleet Inventory</h1>
            <p className="text-foreground/60 text-lg mt-1 font-medium">Keep track of your active vehicles and pull them into maintenance instantly.</p>
          </div>
       </div>

       <FleetUI initialFleet={fleet || []} />
    </div>
  );
}
