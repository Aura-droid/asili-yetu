'use server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const resend = new Resend(process.env.RESEND_API_KEY);
// Note: GoogleGenerativeAI client is now initialized within individual server functions for reliability.

export async function submitBookingInquiry(payload: any) {
    try {
        console.log("📡 INCOMING EXPLORER SIGNAL:", JSON.stringify(payload, null, 2));
        
        // We use the new server client
        const { createClient } = await import('@/utils/supabase/server');
        const supabaseServer = await createClient();
        
        // 1. Insert into Supabase (Inquiries CRM)
        const guestsMatch = payload.guests?.match(/\d+/);
        const partySize = guestsMatch ? parseInt(guestsMatch[0]) : (payload.guests ? 1 : null);

        // 0. Intelligent Price Capture: If this was bridged from a package, fetch its baseline price
        let initialQuotedPrice = null;
        if (payload.itinerary?.packageId) {
            const { data: pkg } = await supabaseServer
                .from('packages')
                .select('price_usd, discount_price')
                .eq('id', payload.itinerary.packageId)
                .single();
            
            if (pkg) {
                initialQuotedPrice = pkg.discount_price || pkg.price_usd;
            }
        }

        const { data: newInquiry, error: dbError } = await supabaseServer
            .from('inquiries')
            .insert([{
                client_name: payload.name,
                client_email: payload.email,
                client_phone: payload.phone || null,
                party_size: partySize,
                travel_dates: payload.dates || null,
                special_requests: (payload.dietary || "") + (payload.addons ? ` | Addons: ${payload.addons.join(", ")}` : ""),
                itinerary_details: payload.itinerary || null,
                quoted_price: initialQuotedPrice, // Seed the bargaining terminal
                locale: payload.locale || 'en', // Signal context
            }])
            .select('*')
            .single();

        if (dbError) {
            console.error("🚫 DATABASE SIGNAL FAILURE:", dbError);
            throw new Error(dbError.message);
        }

        // 2. Email Admin via Resend
        const { getAcknowledgmentEmailHtml, getAdminNotificationHtml } = await import('@/utils/emailTemplates');

        await resend.emails.send({
            from: 'Asili Yetu Safaris and Tours <onboarding@resend.dev>',
            to: ['bookings@asiliyetusafaris.com'], // Admin
            subject: `New Safari Quote Request: ${payload.name}`,
            html: getAdminNotificationHtml(payload),
        });

        // 3. Email the User acknowledging the inquiry with Magic Link
        await resend.emails.send({
            from: 'Asili Yetu Safaris and Tours <onboarding@resend.dev>',
            to: [payload.email],
            subject: 'Your Tanzanian Expedition: Inquiry Received',
            html: getAcknowledgmentEmailHtml({ ...payload, access_token: newInquiry.access_token }, payload.locale || 'en'),
        });

        return { success: true };
    } catch (error: any) {
        console.error("Inquiry Error:", error);
        return { error: error.message };
    }
}

export async function generateItinerary(query: { location: string, dates: string, guests: string }) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("Gemini API Key missing");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        // 1. Fetch available packages from Supabase
        const { data: packages, error: dbError } = await supabase.from('packages').select('id, title, duration_days, price_usd, discount_price, difficulty_level, destinations(name)');

        if (dbError) throw new Error(dbError.message);

        // 2. Formulate prompt
        const prompt = `
          You are an expert luxury safari planner. The user wants to go to: ${query.location}. Dates: ${query.dates}. Guests: ${query.guests}. 
          Here are our available packages: ${JSON.stringify(packages)}. 
          Recommend the best package from this list. If none fit perfectly, adapt the closest one.
          Provide a strategy and a fun daily breakdown. 
          Return ONLY a JSON response in the following schema:
          { 
             "packageId": "UUID string of the chosen package (or null if no packages provided)", 
             "recommendedTitle": "Title of your custom itinerary suggestion",
             "strategy": "Why this is perfect for them (1-2 sentences)", 
             "dailyBreakdown": [
                { "day": 1, "description": "Arrive and relax..." }
             ]
          }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) {
            throw new Error("No response from system");
        }

        // Robust JSON extraction (removes markdown backticks if present)
        const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return { success: true, data: JSON.parse(cleanJson) };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function translateContent(text: string, targetLangs: string[] = ['sw', 'es', 'fr', 'de', 'zh', 'ar']) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("Gemini API Key missing");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const prompt = `
          You are an expert polyglot translator for a luxury safari brand "Asili Yetu Safaris".
          Translate the following text into these languages: ${targetLangs.join(", ")}.
          Text to translate: "${text}"
          Maintain the luxury, professional, and evocative tone.
          Return ONLY a JSON object where keys are the language codes and values are the translations.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        if (!textResponse) throw new Error("Translation failed");
        return JSON.parse(textResponse);
    } catch (e) {
        console.error("Translation Error:", e);
        return {};
    }
}

export async function saveGlobalNotice(payload: { message: string, type: string, isActive: boolean }) {
    try {
        const { createClient } = await import('@/utils/supabase/server');
        const supabaseServer = await createClient();

        // 1. Automatically generate high-fidelity translations using Gemini AI
        const translations = await translateContent(payload.message);

        // 2. Ensure singleton active state: if this is active, deactivate others
        if (payload.isActive) {
            await supabaseServer
                .from('company_notices')
                .update({ is_active: false })
                .eq('is_active', true);
        }

        // 3. Persist with intelligence layer
        const { error } = await supabaseServer.from('company_notices').insert([{
            message: payload.message,
            type: payload.type,
            is_active: payload.isActive,
            translations: translations // Store AI generated translations
        }]);

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}