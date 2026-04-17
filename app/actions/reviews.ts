"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getInstagramComments() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!accessToken || !businessId) return { data: [], error: "Instagram credentials missing in environment variables." };

  try {
    // 1. Get recent media IDs (Checking top 15 posts)
    const mediaRes = await fetch(
      `https://graph.facebook.com/v22.0/${businessId}/media?fields=id&limit=15&access_token=${accessToken}`
    );
    const mediaData = await mediaRes.json();
    
    if (mediaData.error) {
       return { data: [], error: `IG Media API: ${mediaData.error.message}` };
    }
    
    if (!mediaData.data) return { data: [], error: null };

    // 2. Fetch comments for each media in parallel
    const commentDataArray = await Promise.all(
      mediaData.data.map(async (post: any) => {
        try {
          const commentRes = await fetch(
            `https://graph.facebook.com/v22.0/${post.id}/comments?fields=id,text,username,timestamp&access_token=${accessToken}`
          );
          const data = await commentRes.json();
          if (data.error) {
             console.error(`IG Comment Error for post ${post.id}:`, data.error.message);
             return [];
          }
          return data.data || [];
        } catch (e) {
          console.error(`IG Fetch Failure for post ${post.id}:`, e);
          return [];
        }
      })
    );
    
    const allComments = commentDataArray.flat().map((c: any) => ({
      id: c.id,
      rating: 5,
      comment: c.text,
      user_name: `@${c.username}`,
      created_at: c.timestamp,
      source: 'instagram',
      packages: { title: "Social Discovery" }
    }));

    return { data: allComments, error: null };
  } catch (e: any) {
    return { data: [], error: e.message };
  }
}

export async function getReviews() {
  const supabase = await createClient();
  
  // Fetch only approved local reviews
  const { data: localReviews, error: localError } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  // If reviews table is missing, don't crash, just log Friendly
  if (localError) {
    console.error("Local Reviews Error:", localError.message);
  }

  // Fetch Instagram comments
  const { data: igReviews, error: igError } = await getInstagramComments();

  // Normalize local reviews to match our unified UI (client_name -> user_name)
  const normalizedLocal = (localReviews || []).map(r => ({
    ...r,
    user_name: r.client_name || r.user_name || "Guest Explorer",
    source: 'local'
  }));

  // Merge and sort
  const combined = [...normalizedLocal, ...igReviews].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return { error: localError ? localError.message : igError, data: combined };
}

export async function createReview(data: { client_name: string, comment: string, rating: number, is_approved?: boolean }) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("reviews")
    .insert([{
      ...data,
      is_approved: data.is_approved ?? false, // Default to false for guest submissions
      created_at: new Date().toISOString()
    }]);

  if (!error) revalidatePath("/");
  if (!error) revalidatePath("/admin/reviews");
  return { success: !error, error: error?.message };
}

export async function getAllReviews() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error: error?.message };
}

export async function approveReview(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: true })
    .eq("id", id);
  if (!error) revalidatePath("/");
  if (!error) revalidatePath("/admin/reviews");
  return { success: !error, error: error?.message };
}

export async function deleteReview(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id);

  if (!error) revalidatePath("/admin/reviews");
  return { success: !error, error: error?.message };
}
