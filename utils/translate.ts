import { GoogleGenerativeAI } from '@google/generative-ai';

// SDK initialization moved to function scope Status

export async function translateContent(text: string, targetLangs: string[] = ['sw', 'es', 'fr', 'de', 'zh', 'ar']) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY missing. Skipping auto-translation.");
            return {};
        }

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
