"use server";

import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";
import { safariEmailTemplate } from "@/utils/emailTemplates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeToNewsletter(email: string, locale: string = 'en', source: string = 'footer') {
  if (!email || !email.includes('@')) {
    return { success: false, error: "Invalid email coordinate." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('newsletter_subscriptions').insert({
    email,
    locale,
    source,
    status: 'subscribed'
  });

  if (error) {
    if (error.code === '23505') { // Unique violation
        return { success: true, message: "Already in the registry." };
    }
    console.error("Newsletter Subscription Failure:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getNewsletterSubscribers() {
  const supabase = await createClient();
  const { data, count, error } = await supabase
    .from("newsletter_subscriptions")
    .select("*", { count: 'exact' });
  return { subscribers: data || [], count: count || 0, error: error?.message };
}

export async function uploadNewsletterAsset(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { success: false, error: "No file provided" };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `newsletters/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('asili-images')
    .upload(filePath, file);

  if (uploadError) return { success: false, error: uploadError.message };

  const { data: publicData } = supabase.storage
    .from('asili-images')
    .getPublicUrl(filePath);

  return { success: true, url: publicData.publicUrl, fileName: file.name };
}

export async function broadcastNewsletter(subject: string, title: string, content: string, attachments: { url: string, name: string }[] = []) {
  const supabase = await createClient();
  const { data: subscribers, error } = await supabase
    .from("newsletter_subscriptions")
    .select("email, locale")
    .eq("status", "subscribed");

  if (error || !subscribers) return { success: false, error: error?.message || "No subscribers found." };

  const results = await Promise.all(subscribers.map(async (sub) => {
    try {
      const html = safariEmailTemplate(
        'Explorer',
        title,
        'Great Migration Alert',
        content,
        undefined,
        sub.locale || 'en',
        'Join the Migration'
      );

      await resend.emails.send({
        from: 'Asili Yetu Safaris and Tours <info@asiliyetusafaris.com>',
        to: [sub.email],
        subject: subject,
        html: html,
        attachments: attachments.length > 0 ? attachments.map(a => ({
          filename: a.name,
          path: a.url
        })) : undefined
      });
      return true;
    } catch (e) {
      console.error(`Failed to send newsletter to ${sub.email}:`, e);
      return false;
    }
  }));

  const successCount = results.filter(Boolean).length;
  return { success: true, count: successCount };
}
