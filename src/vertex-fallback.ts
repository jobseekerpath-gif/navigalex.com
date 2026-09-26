import { GoogleGenAI } from "@google/genai";

export async function vertexFallback(prompt: string) {
  const client = new GoogleGenAI({
    vertexai: true,
    project: process.env.GOOGLE_CLOUD_PROJECT!,
    location: process.env.GOOGLE_CLOUD_LOCATION || "global",
  });

  const response = await client.models.generateContent({
    model: process.env.VERTEX_MODEL || "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text || "";
}

