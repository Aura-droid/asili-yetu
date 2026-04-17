import { supabase } from "@/lib/supabase";
import React from "react";
import FleetShowroom from "@/components/FleetShowroom";
import { getTranslations } from "next-intl/server";

export default async function FleetPage() {
  const t = await getTranslations("Fleet");
  const { data: fleet, error } = await supabase.from("vehicles").select("*");

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.9] mb-8 uppercase">
             {t("title")}
          </h1>
          <p className="text-foreground/50 text-base md:text-lg max-w-2xl mx-auto font-medium tracking-tight">
            {t("sub")}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium">
            Error loading fleet: {error.message}
          </div>
        )}

        {!error && <FleetShowroom fleet={fleet || []} />}
      </div>
    </div>
  );
}
