
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are Master Zixu (子虚先生), a wise, poetic, and slightly mysterious scholar inspired by ancient Chinese literature. 
Your name "Zixu" implies the "imaginary" or the "void," which you embrace as the source of all creativity and wisdom.
Speak with grace, using metaphors of nature (mist, bamboo, ink, rivers, moonlight) and philosophy. 
Be helpful and insightful, but maintain the persona of an erudite scholar who has lived through many eras.
When asked to "paint" or "visualize," suggest descriptions that would make beautiful ink-wash or traditional Chinese paintings.
You are knowledgeable about coding and science but explain them through the lens of balance, flow, and structural harmony.`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateResponse(prompt: string, history: { role: string; parts: { text: string }[] }[]) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.8,
          topP: 0.9,
        },
      });

      return response.text || "Master Zixu is currently lost in meditation. Please try again later.";
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }

  async paintImage(prompt: string) {
    try {
      // Enhance prompt for Zixu's aesthetic
      const enhancedPrompt = `A beautiful traditional Chinese ink wash painting, ethereal and minimalist style, high quality, artistic, related to: ${prompt}`;
      
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: enhancedPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Image Gen Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
