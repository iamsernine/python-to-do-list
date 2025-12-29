
import { GoogleGenAI, Type } from "@google/genai";

/**
 * All AI services use the user-selected key from the environment.
 * Branded references to the provider have been removed from logs and returns.
 */

export const getAIAssistance = async (topic: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a very brief, 3-sentence summary and one simple code example for the following Python study topic: "${topic}". Format the code example clearly using Markdown.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error: any) {
    console.error("AI Assistance Error:", error);
    if (error?.message?.includes("Requested entity was not found") || error?.status === 404) {
      throw new Error("API_KEY_RESET");
    }
    return "Assistance is currently unavailable. Please verify your connection or API configuration.";
  }
};

export const generateQuiz = async (categoryName: string, topics: string[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a 3-question multiple choice quiz about the following Python topics within the category "${categoryName}": ${topics.join(", ")}. Provide questions that test practical understanding.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of exactly 4 options"
              },
              correctAnswer: { 
                type: Type.INTEGER, 
                description: "Index of the correct option (0-3)"
              },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error: any) {
    console.error("Quiz Generation Error:", error);
    if (error?.message?.includes("Requested entity was not found") || error?.status === 404) {
       throw new Error("API_KEY_RESET");
    }
    throw error;
  }
};
