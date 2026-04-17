"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { translateContent } from "@/utils/translate";

export async function getNotices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_notices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === '42P01') {
      // Table doesn't exist - user hasn't run the migration yet
      return { error: 'needs_migration', data: [] };
    }
    return { error: error.message, data: [] };
  }
  return { error: null, data: data || [] };
}

export async function getActiveNotice() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_notices")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return null;
  }
  return data;
}

export async function createNotice(formData: FormData) {
  const supabase = await createClient();
  
  const message = formData.get("message") as string;
  const type = formData.get("type") as string;
  const is_active = formData.get("is_active") === "on" || formData.get("is_active") === "true";

  if (!message || !type) return { success: false, error: "Missing fields" };

  // Magic Translate: Generate high-fidelity translations for the global banner
  const translations = await translateContent(message);

  // If making active, deactivate others
  if (is_active) {
    await supabase.from("company_notices").update({ is_active: false }).eq("is_active", true);
  }

  const { error } = await supabase
    .from("company_notices")
    .insert([{ 
      message, 
      type, 
      is_active,
      translations // Apply AI-generated translations
    }]);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/notices");
  return { success: true };
}

export async function toggleNotice(id: string, is_active: boolean) {
  const supabase = await createClient();
  
  if (is_active) {
    await supabase.from("company_notices").update({ is_active: false }).neq("id", id);
  }
  
  const { error } = await supabase
    .from("company_notices")
    .update({ is_active })
    .eq("id", id);

  revalidatePath("/", "layout");
  revalidatePath("/admin/notices");
  return { success: !error };
}
