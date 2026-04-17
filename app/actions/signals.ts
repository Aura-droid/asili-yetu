"use server";

import { createClient } from "@/utils/supabase/server";

export async function signalRangers(inquiryId: string, locale: string = 'en') {
    const supabase = await createClient();

    // 1. Fetch Inquiry details
    const { data: inquiry } = await supabase
        .from("inquiries")
        .select("*")
        .eq("id", inquiryId)
        .single();

    if (!inquiry) return { success: false, error: "Expedition not found" };

    // 2. Fetch Active Rangers
    const { data: rangers } = await supabase
        .from("guides")
        .select("name, phone_number")
        .eq("is_active", true);

    const rangerNumbers = rangers?.filter(r => r.phone_number).map(r => r.phone_number) || [];

    try {
        // 3. Create Mission Record (Mission Sentinel Registry)
        const { data: mission, error: missionError } = await supabase
            .from("missions")
            .insert({ inquiry_id: inquiryId })
            .select()
            .single();

        if (missionError) throw missionError;

        // 4. Generate the Sentinel Activation Link
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const missionLink = `${baseUrl}/${locale}/mission/${mission.secret_token}`;

        const message = `🚨 NEW ASILI MISSION ALERT!\n\nPROSPECT: ${inquiry.client_name}\nSAFARI: ${inquiry.itinerary_details?.recommendedTitle || 'Custom Expedition'}\n\nACTION REQUIRED: Read briefing & claim mission below:\n🔗 ${missionLink}\n\nPrepare the fleet! 🦒🚙`;

        console.log("------------------------------------------");
        console.log("MISSION SENTINEL TRANSMISSION:");
        console.log(`POLLING: ${rangers?.length || 0} active guides found.`);
        console.log(`LINK: ${missionLink}`);
        console.log("------------------------------------------");

        const waLink = `https://wa.me/?text=${encodeURIComponent(message)}`;

        // 5. Log the signal in the DB
        await supabase
            .from("inquiries")
            .update({ 
                admin_notes: `${inquiry.admin_notes || ''}\n[MISSION DISPATCHED] at ${new Date().toLocaleTimeString()}. Link: ${missionLink}`
            })
            .eq("id", inquiryId);

        return { 
            success: true, 
            message: `Mission dispatched to ${rangerNumbers.length} rangers. Acceptance link active.`,
            whatsappLink: waLink
        };
    } catch (err: any) {
        console.error("Signal Error:", err);
        return { success: false, error: "Signal interference. Manual contact required." };
    }
}
