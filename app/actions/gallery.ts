"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getManualGallery() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("source", "manual")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: [] };
  return { error: null, data: data };
}

export async function getInstagramMedia() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("source", "instagram")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: [] };
  return { error: null, data: data };
}

export async function addGalleryItem(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("image") as File;
  const caption = formData.get("caption") as string;
  const is_featured = formData.get("is_featured") === "on";

  if (!file || file.size === 0) {
    return { success: false, error: "No image file provided" };
  }

  // Upload to Supabase Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `gallery/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('asili-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    return { success: false, error: `Upload failed: ${uploadError.message}` };
  }

  const { data: publicData } = supabase.storage
    .from('asili-images')
    .getPublicUrl(filePath);

  const { error } = await supabase
    .from("gallery_items")
    .insert([{
      url: publicData.publicUrl,
      caption,
      type: file.type.startsWith('video') ? 'video' : 'image',
      source: 'manual',
      is_featured
    }]);

  if (!error) {
    revalidatePath("/admin/gallery");
    revalidatePath("/", "layout");
  }
  return { success: !error, error: error?.message };
}

export async function toggleFeaturedGallery(id: string, current: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_items")
    .update({ is_featured: !current })
    .eq("id", id);

  if (!error) {
    revalidatePath("/admin/gallery");
    revalidatePath("/", "layout");
  }
  return { success: !error, error: error?.message };
}

export async function deleteGalleryItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_items")
    .delete()
    .eq("id", id);

  if (!error) {
    revalidatePath("/admin/gallery");
    revalidatePath("/", "layout");
  }
  return { success: !error, error: error?.message };
}

export async function toggleGalleryItem(id: string, current: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_items")
    .update({ is_active: !current })
    .eq("id", id);

  if (!error) {
    revalidatePath("/admin/gallery");
    revalidatePath("/", "layout");
  }
  return { success: !error, error: error?.message };
}
