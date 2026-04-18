"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPackages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select("*");

  console.log("DATABASE_PROBE [getPackages]:", { count: data?.length, error });
  if (error) {
    if (error.code === '42P01') {
      return { error: 'needs_migration', data: [] };
    }
    return { error: error.message, data: [] };
  }
  return { error: null, data: data || [] };
}

export async function getDestinations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("id, name")
    .order("name", { ascending: true });

  return { data: data || [], error: error?.message };
}

export async function createPackage(formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price_usd = parseInt(formData.get("price_usd") as string);
  const duration_days = parseInt(formData.get("duration_days") as string);
  const difficulty_level = formData.get("difficulty_level") as string;
  const destination_id = formData.get("destination_id") as string;
  const discount_price_raw = formData.get("discount_price") as string;
  const discount_price = discount_price_raw ? parseInt(discount_price_raw) : null;
  const file = formData.get("image") as File | null;
  const is_featured = formData.get("is_featured") === "on";
  const biome_orientation = formData.get("biome_orientation") as string || "Savannah Majesty";
  const temperature_profile = formData.get("temperature_profile") as string || "Warm & Sun-drenched";
  const intensity_vibe = formData.get("intensity_vibe") as string || "Classic Safari";
  const itineraryRaw = formData.get("itinerary") as string;
  let itinerary = [];
  try {
    itinerary = JSON.parse(itineraryRaw || "[]");
  } catch (e) {
    console.warn("Invalid itinerary JSON, defaulting to empty array.");
  }

  let main_image = null;

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `packages/${fileName}`;

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
    
    main_image = publicData.publicUrl;
  }

  const { error } = await supabase
    .from("packages")
    .insert([{
      title,
      description,
      price_usd,
      duration_days,
      difficulty_level,
      destination_id: destination_id || null,
      main_image: main_image || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80",
      is_featured,
      itinerary,
      discount_price,
      biome_orientation,
      temperature_profile,
      intensity_vibe
    }]);

  if (!error) revalidatePath("/admin/packages");
  return { success: !error, error: error?.message };
}

export async function deletePackage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("packages")
    .delete()
    .eq("id", id);

  if (!error) revalidatePath("/admin/packages");
  return { success: !error, error: error?.message };
}

export async function toggleFeatured(id: string, currentlyFeatured: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("packages")
    .update({ is_featured: !currentlyFeatured })
    .eq("id", id);

  if (!error) revalidatePath("/admin/packages");
  return { success: !error, error: error?.message };
}

export async function updatePackage(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price_usd = parseInt(formData.get("price_usd") as string);
  const duration_days = parseInt(formData.get("duration_days") as string);
  const difficulty_level = formData.get("difficulty_level") as string;
  const destination_id = formData.get("destination_id") as string;
  const file = formData.get("image") as File | null;
  const is_featured = formData.get("is_featured") === "on";
  const biome_orientation = formData.get("biome_orientation") as string || "Savannah Majesty";
  const temperature_profile = formData.get("temperature_profile") as string || "Warm & Sun-drenched";
  const intensity_vibe = formData.get("intensity_vibe") as string || "Classic Safari";
  const itineraryRaw = formData.get("itinerary") as string;
  let itinerary = [];
  try {
    itinerary = JSON.parse(itineraryRaw || "[]");
  } catch (e) {
    console.warn("Invalid itinerary JSON.");
  }

  const updateData: any = {
    title,
    description,
    price_usd,
    duration_days,
    difficulty_level,
    destination_id: destination_id || null,
    is_featured,
    itinerary,
    discount_price: formData.get("discount_price") ? parseInt(formData.get("discount_price") as string) : null,
    biome_orientation,
    temperature_profile,
    intensity_vibe
  };

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `packages/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('asili-images')
      .upload(filePath, file);

    if (!uploadError) {
      const { data: publicData } = supabase.storage
        .from('asili-images')
        .getPublicUrl(filePath);
      updateData.main_image = publicData.publicUrl;
    }
  }

  const { error } = await supabase
    .from("packages")
    .update(updateData)
    .eq("id", id);

  if (!error) revalidatePath("/admin/packages");
  return { success: !error, error: error?.message };
}
