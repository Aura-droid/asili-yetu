"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCultureStories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("culture_stories")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("order_index", { ascending: true });

  if (error) return [];
  return data;
}

export async function createCultureStory(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const accent_color = formData.get('accent_color') as string;
  const file = formData.get('image') as File | null;

  const is_featured = formData.get('is_featured') === 'on';

  if (!title || !description) return { error: "Title and description are required" };

  let image_url = null;
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('asili-images')
      .upload(`culture/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) return { error: `Upload failed: ${uploadError.message}` };
    const { data } = supabase.storage.from('asili-images').getPublicUrl(`culture/${fileName}`);
    image_url = data.publicUrl;
  }

  const { error } = await supabase.from('culture_stories').insert({
    title,
    description,
    category: category || 'Traditions',
    accent_color: accent_color || '#a3cc4c',
    image_url,
    is_active: true,
    is_featured
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/culture");
  revalidatePath("/culture");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function toggleFeaturedStory(id: string, current: boolean) {
  const supabase = await createClient();
  await supabase.from('culture_stories').update({ is_featured: !current }).eq('id', id);
  revalidatePath("/admin/culture");
  revalidatePath("/culture");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function toggleStoryStatus(id: string, current: boolean) {
  const supabase = await createClient();
  await supabase.from('culture_stories').update({ is_active: !current }).eq('id', id);
  revalidatePath("/admin/culture");
  revalidatePath("/culture");
  revalidatePath("/", "layout");
}

export async function deleteStory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('culture_stories').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath("/admin/culture");
  revalidatePath("/culture");
  revalidatePath("/", "layout");
  return { success: true };
}
