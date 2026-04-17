"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// TYPES
export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
  type: 'image' | 'video';
  source: 'manual' | 'instagram';
  created_at: string;
  is_active: boolean;
}

// GET MANUAL GALLERY ITEMS
export async function getManualGallery() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: [] };
  return { error: null, data: (data || []) as GalleryItem[] };
}

// FETCH INSTAGRAM MEDIA
export async function getInstagramMedia() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!accessToken || !businessId) {
    return { error: "Instagram credentials missing in .env", data: [] };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v22.0/${businessId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    const result = await response.json();

    if (result.error) {
      return { error: result.error.message, data: [] };
    }

    const formattedData = result.data.map((item: any) => ({
      id: item.id,
      url: item.media_type === 'VIDEO' ? item.thumbnail_url || item.media_url : item.media_url,
      caption: item.caption,
      type: item.media_type === 'VIDEO' ? 'video' : 'image',
      source: 'instagram',
      created_at: item.timestamp,
      permalink: item.permalink,
      is_active: true
    }));

    return { error: null, data: formattedData };
  } catch (err: any) {
    return { error: err.message, data: [] };
  }
}

// ADD MANUAL ITEM
export async function addGalleryItem(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("image") as File;
  const caption = formData.get("caption") as string;

  if (!file || file.size === 0) {
    return { success: false, error: "No image file provided" };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `gallery/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('asili-images')
    .upload(filePath, file);

  if (uploadError) return { success: false, error: uploadError.message };

  const { data: publicData } = supabase.storage
    .from('asili-images')
    .getPublicUrl(filePath);

  const { error } = await supabase
    .from("gallery_items")
    .insert([{
      url: publicData.publicUrl,
      caption,
      type: file.type.startsWith('video') ? 'video' : 'image',
      source: 'manual'
    }]);

  if (!error) revalidatePath("/admin/gallery");
  return { success: !error, error: error?.message };
}

// DELETE MANUAL ITEM
export async function deleteGalleryItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_items")
    .delete()
    .eq("id", id);

  if (!error) revalidatePath("/admin/gallery");
  return { success: !error, error: error?.message };
}

// TOGGLE VISIBILITY
export async function toggleGalleryItem(id: string, active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_items")
    .update({ is_active: active })
    .eq("id", id);

  if (!error) revalidatePath("/admin/gallery");
  return { success: !error, error: error?.message };
}
