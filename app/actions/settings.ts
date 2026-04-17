"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  return { data, error: error?.message };
}

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();
  
  const site_name = formData.get("site_name") as string;
  const contact_email = formData.get("contact_email") as string;
  const contact_phone = formData.get("contact_phone") as string;
  const whatsapp_number = formData.get("whatsapp_number") as string;
  const instagram_url = formData.get("instagram_url") as string;
  const facebook_url = formData.get("facebook_url") as string;
  const office_location = formData.get("office_location") as string;
  const is_maintenance_mode = formData.get("is_maintenance_mode") === "on";

  const { error } = await supabase
    .from("settings")
    .update({
      site_name,
      contact_email,
      contact_phone,
      whatsapp_number,
      instagram_url,
      facebook_url,
      office_location,
      is_maintenance_mode,
      updated_at: new Date().toISOString()
    })
    .eq("id", 1);

  if (!error) revalidatePath("/admin/settings");
  return { success: !error, error: error?.message };
}
