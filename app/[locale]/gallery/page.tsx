import { getManualGallery, getInstagramMedia } from "@/app/actions/gallery";
import ClientGallery from "@/components/ClientGallery";

export default async function GalleryPage() {
  const [manualRes, instaRes] = await Promise.all([
    getManualGallery(),
    getInstagramMedia()
  ]);

  // Combine and sort by date
  const combinedItems = [
    ...(manualRes.data || []),
    ...(instaRes.data || [])
  ].sort((a, b) => {
    if (b.is_featured && !a.is_featured) return 1;
    if (!b.is_featured && a.is_featured) return -1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return <ClientGallery posts={combinedItems} />;
}
