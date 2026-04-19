"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getDestinations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .order("name", { ascending: true });

  if (error) return { error: error.message, data: [] };
  return { error: null, data: data || [] };
}

export async function upsertDestination(formData: FormData) {
  const supabase = await createClient();
  
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const file = formData.get("image") as File | null;
  const description = formData.get("description") as string;
  const best_time = formData.get("best_time") as string;
  const key_wildlife = formData.get("key_wildlife") as string;
  const size = formData.get("size") as string;
  const latitude = formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null;
  const longitude = formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null;

  let image_url = formData.get("existing_image_url") as string || null;

  // Handle new file upload if provided
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `destinations/${fileName}`;

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
    
    image_url = publicData.publicUrl;
  }

  const destData = {
    name,
    type,
    image_url,
    description,
    best_time,
    key_wildlife,
    size,
    latitude,
    longitude
  };

  let error;
  if (id) {
    const { error: err } = await supabase
      .from("destinations")
      .update(destData)
      .eq("id", id);
    error = err;
  } else {
    const { error: err } = await supabase
      .from("destinations")
      .insert([destData]);
    error = err;
  }

  if (!error) {
    revalidatePath("/admin/destinations");
    revalidatePath("/[locale]/destinations", "page");
  }
  return { success: !error, error: error?.message };
}

export async function deleteDestination(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("destinations")
    .delete()
    .eq("id", id);

  if (!error) {
    revalidatePath("/admin/destinations");
  }
  return { success: !error, error: error?.message };
}
