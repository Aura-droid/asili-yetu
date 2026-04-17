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
    founder_image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&q=80",
    founder_name: "Jeyson",
    legacy_image: "https://images.unsplash.com/photo-1616527027589-91307b2ab138?auto=format&fit=crop&q=80",
    hero_image: "/hero/ngorongoro-hero.jpg",
    en: {
      ceo_message: [
        "Asili Yetu Tours and Safari started from something very simple: love for my home. I was born and raised in Tanzania. This land shaped everything about me.", 
        "I started Asili Yetu because I felt something was missing in tourism. Many people came to Tanzania, but they often left without really feeling it. They saw the animals, but they didn’t always connect with the people and the real life of this country.", 
        "What matters most to me is the future. I want tourism that protects nature, supports local communities, and gives young people hope and opportunity. For us, tourism must always give back more than it takes."
      ]
    }
  };

  const { error } = await supabase
    .from("site_content")
    .upsert([{ key: 'about_page', data: defaultData }], { onConflict: 'key' });

  return { success: !error, error: error?.message };
}
