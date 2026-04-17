"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { safariEmailTemplate } from "@/utils/emailTemplates";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getInquiries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      missions (
        status,
        accepted_at,
        guides:assigned_ranger_id (name)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === '42P01') {
      return { error: 'needs_migration', data: [] };
    }
    return { error: error.message, data: [] };
  }
  return { error: null, data: data || [] };
}

export async function updateInquiryStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", id);

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  return { success: !error };
}

export async function updateQuotedPrice(id: string, quoted_price: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ quoted_price })
    .eq("id", id);

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  return { success: !error };
}

export async function updateInquiryNotes(id: string, admin_notes: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ admin_notes })
    .eq("id", id);

  revalidatePath("/admin/bookings");
  return { success: !error };
}

export async function sendBrandedEmail(inquiryId: string, customMessage?: string) {
  const supabase = await createClient();
  
  const { data: inquiry } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", inquiryId)
    .single();

  if (!inquiry) return { success: false, error: "Inquiry not found" };

  try {
    const html = safariEmailTemplate(
      inquiry.client_name, 
      inquiry.itinerary_details?.recommendedTitle || "Custom Safari Expedition", 
      inquiry.status,
      customMessage,
      inquiry.access_token
    );

    const { data, error } = await resend.emails.send({
      from: 'Asili Yetu Safaris <info@asiliyetusafaris.com>',
      to: [inquiry.client_email],
      subject: `Update on your Asili Yetu Expedition: ${inquiry.status.replace('_', ' ').toUpperCase()}`,
      html: html,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("Email Error:", err);
    return { success: false, error: err.message };
  }
}

export async function getMessages(inquiryId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("inquiry_id", inquiryId)
    .order("created_at", { ascending: true });
  return { data, error: error?.message };
}

export async function sendMessage(inquiryId: string, text: string, sender: 'admin' | 'client') {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .insert([{ inquiry_id: inquiryId, text, sender }]);
    
  if (sender === 'admin' && !error) {
    // Optional: Send an email notification to the client that they have a new message
  }

  revalidatePath("/admin/bookings");
  return { success: !error, error: error?.message };
}

export async function clearUnreadCount(inquiryId: string) {
  const supabase = await createClient();
  await supabase
    .from("inquiries")
    .update({ unread_count: 0 })
    .eq("id", inquiryId);
  revalidatePath("/admin/bookings");
  return { success: true };
}

export async function deleteInquiry(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .delete()
    .eq("id", id);
  
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  
  // Return the fresh state to ensure absolute sync
  const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
  return { success: !error, error: error?.message, data: data || [] };
}

export async function sendInvoiceEmail(inquiryId: string) {
  const supabase = await createClient();
  const { data: inquiry } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", inquiryId)
    .single();

  if (!inquiry) return { success: false, error: "Inquiry not found" };
  if (!inquiry.quoted_price) return { success: false, error: "Please set a price first" };

  const { getInvoiceEmailHtml } = await import("@/utils/emailTemplates");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asiliyetusafaris.com';
  
  const html = getInvoiceEmailHtml(
    inquiry.client_name,
    inquiry.itinerary_details?.recommendedTitle || "Custom Safari Expedition",
    inquiry.quoted_price,
    siteUrl,
    inquiry.access_token
  );

  await resend.emails.send({
    from: 'Asili Yetu Safaris <onboarding@resend.dev>',
    to: [inquiry.client_email],
    subject: `Expedition Authorization: Final Quote for ${inquiry.itinerary_details?.recommendedTitle || "Your Safari"}`,
    html: html,
  });

  // Automatically update status
  await updateInquiryStatus(inquiryId, "quote_sent");

  return { success: true };
}

export async function updateInquiryDossier(inquiryId: string, updates: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update(updates)
    .eq("id", inquiryId);
  
  revalidatePath("/admin/bookings");
  return { success: !error, error: error?.message };
}

export async function sendSignalNotification(inquiryId: string, content: string) {
  const supabase = await createClient();
  const { data: inquiry } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", inquiryId)
    .single();

  if (!inquiry) return { success: false };

  // Presence Check: If the user was active in the last 2 minutes, we don't spam their email
  const lastActive = inquiry.last_active_at ? new Date(inquiry.last_active_at).getTime() : 0;
  const now = new Date().getTime();
  const diffuseTime = 2 * 60 * 1000; // 2 minutes

  if (now - lastActive < diffuseTime) {
    console.log("📡 SIGNAL DISPATCH: Suppressed (Explorer is active in Terminal)");
    return { success: true, suppressed: true };
  }

  const { safariEmailTemplate } = await import("@/utils/emailTemplates");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asiliyetusafaris.com';
  
  const html = safariEmailTemplate(
    inquiry.client_name,
    inquiry.itinerary_details?.recommendedTitle || "Your Safari Expedition",
    'new_message',
    `<b>Agent Signal:</b><br/>"${content}"<br/><br/>Your private agent has sent a new signal to your expedition portal. Please access your terminal to review and continue the strategy session.`,
    inquiry.access_token,
    'en',
    'Click to Bargain • Chat • Reply'
  );

  await resend.emails.send({
    from: 'Asili Yetu Safaris <onboarding@resend.dev>',
    to: [inquiry.client_email],
    subject: `New Message from Asili Yetu Agent`,
    html: html,
  });

  return { success: true };
}
