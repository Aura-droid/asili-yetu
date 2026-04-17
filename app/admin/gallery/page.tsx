import { getManualGallery, getInstagramMedia } from "@/app/actions/gallery";
import GalleryUI from "./GalleryUI";
import { AlertTriangle } from "lucide-react";

export default async function AdminGalleryPage() {
  const [manualRes, instaRes] = await Promise.all([
    getManualGallery(),
    getInstagramMedia()
  ]);

  if (manualRes.error && manualRes.error.includes("relation \"gallery_items\" does not exist")) {
    return (
      <div className="p-12 text-center max-w-2xl mx-auto mt-20 bg-red-500/10 border border-red-500/30 rounded-3xl">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-white mb-4">Gallery Migration Required</h2>
        <p className="text-white/70">
          The <code>gallery_items</code> table is missing. Please run the SQL migration to enable custom uploads!
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <GalleryUI 
        manualItems={manualRes.data || []} 
        instagramItems={instaRes.error ? [] : (instaRes.data || [])} 
        instaError={instaRes.error}
      />
    </div>
  );
}
