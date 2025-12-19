import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY || import.meta.env.GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function generateContent(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating content with Gemini AI:", error);
    throw error;
  }
}

export { generateContent };