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
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return <ClientGallery posts={combinedItems} />;
}
