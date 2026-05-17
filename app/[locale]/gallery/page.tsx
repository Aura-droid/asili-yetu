import { getManualGallery, getInstagramMedia } from "@/app/actions/gallery";
import ClientGallery from "@/components/ClientGallery";
import { getLocale } from "next-intl/server";
import StructuredData, { getBreadcrumbSchema } from "@/components/StructuredData";

export default async function GalleryPage() {
  const locale = await getLocale();
  const [manualRes, instaRes] = await Promise.all([
    getManualGallery(),
    getInstagramMedia()
  ]);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asiliyetusafaris.com";

  // Combine and sort by date
  const combinedItems = [
    ...(manualRes.data || []),
    ...(instaRes.data || [])
  ].sort((a, b) => {
    if (b.is_featured && !a.is_featured) return 1;
    if (!b.is_featured && a.is_featured) return -1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <>
      <StructuredData
        type="BreadcrumbList"
        data={getBreadcrumbSchema(baseUrl, [
          { name: "Home", item: `/${locale}` },
          { name: "Gallery", item: `/${locale}/gallery` },
        ])}
      />
      <ClientGallery posts={combinedItems} />
    </>
  );
}
