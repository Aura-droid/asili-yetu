"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateBusinessInsight(metrics: {
    totalInquiries: number;
    conversionRate: number;
    totalRevenue: number;
    avgYield: number;
}) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { error: "Gemini API Key missing. Please check your .env.local file." };

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
              You are the 'Asili Yetu AI Concierge', an elite business analyst for a luxury Tanzanian safari company.
              Analyze the following business metrics:
              - Total Safari Inquiries: ${metrics.totalInquiries}
              - Conversion Rate: ${metrics.conversionRate}%
              - Total Confirmed Revenue: $${metrics.totalRevenue}
              - Average Expedition Yield: $${metrics.avgYield}

              Provide a high-fidelity business insight in exactly two parts:
              1. A 'Summary': A cinematic one-sentence summary of current performance.
              2. A 'Strategy': A one-sentence bold suggestion to increase ROI or fleet utilization.

              Tone: Professional, elite, visionary, safari-focused.
              Language: English.
            `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Simple parser
        const summary = text.match(/Summary:?\s*(.*)/i)?.[1]?.split('\n')[0] || "Your safari operations are steadying for peak season.";
        const strategy = text.match(/Strategy:?\s*(.*)/i)?.[1]?.split('\n')[0] || "Consider optimizing fleet routes to reduce fuel burn across long-haul Serengeti circuits.";

        return { success: true, summary, strategy };
    } catch (err: any) {
        console.error("Gemini Error:", err);
        return { 
            success: false, 
            error: err.message || "The Savannah is quiet. AI could not be reached." 
        };
    }
}
