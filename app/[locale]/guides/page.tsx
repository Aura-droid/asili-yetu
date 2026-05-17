import { getActiveGuides } from "@/app/actions/guides";
import GuidesRoster from "@/components/GuidesRoster";
import { AlertTriangle } from "lucide-react";
import { getLocale } from "next-intl/server";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function GuidesPageContainer() {
  const locale = await getLocale();
  const { data: guides, error } = await getActiveGuides();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";

  if (error === 'needs_migration') {
    return (
      <>
        <StructuredData
          type="BreadcrumbList"
          data={getBreadcrumbSchema(baseUrl, [
            { name: "Home", item: `/${locale}` },
            { name: "Guides", item: `/${locale}/guides` },
          ])}
        />
        <div className="min-h-screen pt-40 px-6 max-w-2xl mx-auto text-center">
           <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
           <h1 className="text-3xl font-black text-foreground mb-4">Database Migration Required</h1>
           <p className="text-foreground/70">
              The <code>guides</code> table has not been created yet in Supabase. Please run the migration script to view your roster.
           </p>
        </div>
      </>
    );
  }

  return (
    <>
      <StructuredData
        type="BreadcrumbList"
        data={getBreadcrumbSchema(baseUrl, [
          { name: "Home", item: `/${locale}` },
          { name: "Guides", item: `/${locale}/guides` },
        ])}
      />
      <GuidesRoster guides={guides || []} />
    </>
  );
}
