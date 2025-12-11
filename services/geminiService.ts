import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "../types";

// Helper to check for API key selection for premium models
const ensureApiKey = async () => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
  }
};

export const generateEventDescription = async (title: string, category: string): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing. Cannot generate description.";
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a catchy, short event description (max 50 words) for a college event titled "${title}" in the category "${category}" at P.A. College of Engineering (PACE).`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate description.";
  }
};

export const generateEventImage = async (prompt: string, aspectRatio: string = "16:9"): Promise<string> => {
  // Trigger API key selection if needed for gemini-3-pro-image-preview
  await ensureApiKey();

  if (!process.env.API_KEY) throw new Error("API Key missing");
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: aspectRatio as any, 
            imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

export const searchEventsTopics = async (query: string): Promise<{text: string, links: {title: string, url: string}[]}> => {
    if (!process.env.API_KEY) return { text: "API Key missing", links: [] };
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        
        const text = response.text || "No results found.";
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        const links = groundingChunks
            .map((chunk: any) => chunk.web ? { title: chunk.web.title, url: chunk.web.uri } : null)
            .filter((link: any) => link !== null);

        return { text, links };

    } catch (error) {
        console.error("Search Error:", error);
        return { text: "Error performing search.", links: [] };
    }
};

export const chatWithGemini = async (history: ChatMessage[], message: string): Promise<string> => {
    if (!process.env.API_KEY) return "API Key missing.";
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Convert internal chat format to Gemini API format
        const formattedHistory = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        const chat = ai.chats.create({
            model: 'gemini-3-pro-preview',
            history: formattedHistory,
            config: {
                systemInstruction: "You are a helpful assistant for P.A. College of Engineering (PACE) event management system. You help students find events, clubs plan them, and answer questions about the college. Keep answers concise."
            }
        });

        const result = await chat.sendMessage({ message });
        return result.text || "I didn't understand that.";
    } catch (error) {
        console.error("Chat Error:", error);
        return "Sorry, I'm having trouble connecting right now.";
    }
}