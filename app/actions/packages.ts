"use server";

import { supabase } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPackages() {
  const { data, error } = await supabase
    .from("packages")
    .select("*");

  if (error) return { error: error.message, data: [] };
  return { error: null, data: data || [] };
}

export async function createPackage(formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price_usd = parseInt(formData.get("price_usd") as string);
  const duration_days = parseInt(formData.get("duration_days") as string);
  const difficulty_level = formData.get("difficulty_level") as string;
  const destination_id = formData.get("destination_id") as string;
  const file = formData.get("image") as File;
  const is_featured = formData.get("is_featured") === "on";
  const biome_orientation = formData.get("biome_orientation") as string || "Savannah Majesty";
  const temperature_profile = formData.get("temperature_profile") as string || "Warm & Sun-drenched";
  const intensity_vibe = formData.get("intensity_vibe") as string || "Classic Safari";
  const itineraryRaw = formData.get("itinerary") as string;
  const inclusionsRaw = formData.get("inclusions") as string;
  let itinerary = [];
  let inclusions = [];
  try {
    itinerary = JSON.parse(itineraryRaw || "[]");
    inclusions = JSON.parse(inclusionsRaw || "[]");
  } catch (e) {
    console.warn("Invalid JSON for itinerary or inclusions.");
  }

  if (!title || !description || isNaN(price_usd) || !file) {
    return { success: false, error: "Missing required fields" };
  }

  // Upload image to Supabase Storage
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
    return { success: false, error: `Image upload failed: ${uploadError.message}. Check your storage permissions or session.` };
  }

  const { data: publicData } = supabase.storage
    .from('asili-images')
    .getPublicUrl(filePath);

  const { error } = await supabase
    .from("packages")
    .insert([
      {
        title,
        description,
        price_usd,
        duration_days,
        difficulty_level,
        destination_id: destination_id || null,
        main_image: publicData.publicUrl,
        is_featured,
        itinerary,
        inclusions,
        discount_price: formData.get("discount_price") ? parseInt(formData.get("discount_price") as string) : null,
        max_people: formData.get("max_people") ? parseInt(formData.get("max_people") as string) : 8,
        people_count_text: (formData.get("people_count_text") as string) || "For 2-8 People",
        biome_orientation,
        temperature_profile,
        intensity_vibe
      },
    ]);

  if (!error) {
    revalidatePath("/admin/packages");
    revalidatePath("/", "layout");
  }
  return { success: !error, error: error?.message };
}

export async function toggleFeatured(id: string, currentlyFeatured: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("packages")
    .update({ is_featured: !currentlyFeatured })
    .eq("id", id);

  if (!error) {
    revalidatePath("/admin/packages");
    revalidatePath("/", "layout");
  }
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
  const inclusionsRaw = formData.get("inclusions") as string;
  let itinerary = [];
  let inclusions = [];
  try {
    itinerary = JSON.parse(itineraryRaw || "[]");
    inclusions = JSON.parse(inclusionsRaw || "[]");
  } catch (e) {
    console.warn("Invalid JSON for itinerary or inclusions.");
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
    inclusions,
    discount_price: formData.get("discount_price") ? parseInt(formData.get("discount_price") as string) : null,
    max_people: formData.get("max_people") ? parseInt(formData.get("max_people") as string) : 8,
    people_count_text: (formData.get("people_count_text") as string) || "For 2-8 People",
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
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return { success: false, error: `Image upload failed: ${uploadError.message}. Check your permissions or session.` };
    }

    const { data: publicData } = supabase.storage
      .from('asili-images')
      .getPublicUrl(filePath);
    updateData.main_image = publicData.publicUrl;
  }

  const { error } = await supabase
    .from("packages")
    .update(updateData)
    .eq("id", id);

  if (!error) {
    revalidatePath("/admin/packages");
    revalidatePath("/", "layout");
  }
  
  // If we get an error here, it's likely the missing column 'inclusions' 
  // or an RLS issue. We return the message clearly.
  return { success: !error, error: error?.message || (error ? "Database update rejected." : null) };
}

export async function deletePackage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("packages")
    .delete()
    .eq("id", id);

  if (!error) {
    revalidatePath("/admin/packages");
    revalidatePath("/", "layout");
  }
  return { success: !error, error: error?.message };
}
