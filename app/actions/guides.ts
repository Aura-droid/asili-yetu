"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { translateContent } from "@/utils/translate";

export async function getActiveGuides() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    if (error.code === '42P01') {
      return { error: 'needs_migration', data: [] };
    }
    return { error: error.message, data: [] };
  }
  return { error: null, data: data || [] };
}

export async function getAllGuides() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === '42P01') return { error: 'needs_migration', data: [] };
    return { error: error.message, data: [] };
  }
  return { error: null, data: data || [] };
}

export async function createGuide(payload: any) {
  const supabase = await createClient();
  // Magic Translate
  const translations = await translateContent(`Role: ${payload.role}. Specialty: ${payload.specialty}. Bio: ${payload.bio}`);

  const { error } = await supabase
    .from("guides")
    .insert([{
      name: payload.name,
      role: payload.role,
      phone_number: payload.phone_number,
      fleet_assigned: payload.fleet_assigned || 'Land Cruiser 300',
      experience_years: payload.experience_years ? parseInt(payload.experience_years) : 0,
      languages: payload.languages.split(",").map((l: string) => l.trim()),
      specialty: payload.specialty,
      bio: payload.bio,
      image_url: payload.image_url,
      translations
    }]);

  if (error) return { error: error.message };
  revalidatePath("/admin/guides");
  revalidatePath("/guides");
  return { success: true };
}

export async function toggleGuideStatus(id: string, is_active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("guides")
    .update({ is_active })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/guides");
  revalidatePath("/guides");
  return { success: true };
}
