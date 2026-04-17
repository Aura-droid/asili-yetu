import React from "react";
import GuidesUI from "./GuidesUI";
import { Users } from "lucide-react";
import { getGuides } from "./actions"; 

export default async function AdminGuidesPage() {
  const guides = await getGuides();

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto pb-32">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-foreground mb-4 tracking-tighter flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
            <Users className="w-10 h-10 text-primary" />
          </div>
          Guide Management roster
        </h1>
        <p className="text-foreground/50 text-lg max-w-2xl font-medium leading-relaxed">
          Manage your roster of safari experts and field guides. Ensure our guests have the best experience with our verified professionals.
        </p>
      </div>

      <GuidesUI initialGuides={guides || []} />
    </div>
  );
}