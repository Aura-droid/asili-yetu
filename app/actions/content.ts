"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAboutContent() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("key", "about_page")
    .single();

  if (error) {
    console.error("About Content Pulse Error:", error.message);
    return null;
  }
  return data.data;
}

export async function updateAboutContent(newData: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_content")
    .update({ data: newData, updated_at: new Date().toISOString() })
    .eq("key", "about_page");

  if (!error) {
    revalidatePath("/about");
    revalidatePath("/[locale]/about", "page");
  }

  return { success: !error, error: error?.message };
}

export async function initializeAboutVault() {
  const supabase = await createClient();
  const defaultData = {
    hero_image: "/hero/ngorongoro-hero.jpg",
    legacy_image: "https://images.unsplash.com/photo-1616527027589-91307b2ab138?auto=format&fit=crop&q=80",
    story_image_1: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80",
    story_image_2: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&q=80",
    // Leadership message - fully editable, no hardcoded names
    leader_photo: "",
    leader_name: "",
    leader_role: "",
    en: {
      leader_message: [
        "Asili Yetu Tours and Safari started from something very simple: love for our home. This land shaped everything about us.",
        "We started Asili Yetu because we felt something was missing in tourism. Many people came to Tanzania, but they often left without really feeling it.",
        "What matters most to us is the future. We want tourism that protects nature, supports local communities, and gives young people hope and opportunity."
      ]
    }
  };

  const { error } = await supabase
    .from("site_content")
    .upsert([{ key: 'about_page', data: defaultData }], { onConflict: 'key' });

  return { success: !error, error: error?.message };
}

// Migrate existing about_page row to new schema (safe - only adds missing fields)
export async function migrateAboutVault() {
  const supabase = await createClient();
  
  const { data: existing } = await supabase
    .from("site_content")
    .select("data")
    .eq("key", "about_page")
    .single();

  if (!existing) return { success: false, error: "No existing record found" };

  const old = existing.data || {};
  
  // Build merged data - preserve existing, add new fields
  const merged = {
    hero_image: old.hero_image || "/hero/ngorongoro-hero.jpg",
    legacy_image: old.legacy_image || "",
    story_image_1: old.story_image_1 || "",
    story_image_2: old.story_image_2 || "",
    leader_photo: old.leader_photo || old.founder_image || "",
    leader_name: old.leader_name || "",
    leader_role: old.leader_role || "",
    en: {
      // Migrate ceo_message → leader_message if exists
      leader_message: old.en?.leader_message || old.en?.ceo_message || []
    }
  };

  const { error } = await supabase
    .from("site_content")
    .update({ data: merged })
    .eq("key", "about_page");

  if (!error) revalidatePath("/[locale]/about", "page");
  return { success: !error, error: error?.message };
}
