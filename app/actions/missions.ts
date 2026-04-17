"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMissionByToken(token: string) {
  const supabase = await createClient();
  
  console.log("SENTINEL AUTHENTICATION PULSE START");
  console.log("TOKEN RECEIVED:", token);

  const { data, error } = await supabase
    .from("missions")
    .select(`
      *,
      inquiry:inquiry_id (*)
    `)
    .eq("secret_token", token)
    .maybeSingle();

  if (error) console.error("DATABASE LOG:", error);
  console.log("RECORD FETCHED:", data ? "SUCCESS" : "NULL");

  return { data, error: error?.message };
}

export async function claimMission(missionId: string, rangerId: string) {
  const supabase = await createClient();

  // 1. Double check if already taken (First-Strike Protection)
  const { data: current } = await supabase
    .from("missions")
    .select("status, assigned_ranger_id")
    .eq("id", missionId)
    .single();

  if (current?.status === 'accepted') {
    return { success: false, error: "Mission already undertaken by another ranger." };
  }

  // 2. Perform the assignment
  const { error } = await supabase
    .from("missions")
    .update({
      status: 'accepted',
      assigned_ranger_id: rangerId,
      accepted_at: new Date().toISOString()
    })
    .eq("id", missionId);

  if (!error) revalidatePath(`/mission/${missionId}`);
  return { success: !error, error: error?.message };
}

export async function deleteMission(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("missions")
    .delete()
    .eq("id", id);
  
  revalidatePath("/admin");
  return { success: !error, error: error?.message };
}
