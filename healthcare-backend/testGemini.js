import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // or gemini-2.5-flash if available
      contents: "Explain how AI works in a few words",
    });

    // ✅ Updated access pattern for the new SDK
    const text = response.output_text || response.text || JSON.stringify(response, null, 2);

    console.log("✅ Gemini says:", text);
  } catch (error) {
    console.error("❌ Gemini Error:", error);
  }
}

main();