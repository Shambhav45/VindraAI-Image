import { GoogleGenAI } from "@google/genai";
import { IMAGE_STYLES } from "../constants";

// Initialize Gemini Client
// WARNING: process.env.API_KEY is required as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateImageWithGemini = async (prompt: string, styleId: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("Missing Gemini API Key in environment variables.");
  }

  const selectedStyle = IMAGE_STYLES.find(s => s.id === styleId);
  const stylePrompt = selectedStyle && selectedStyle.id !== 'none' 
    ? `, in ${selectedStyle.label} style, high quality, 1920x1080` 
    : ', high quality, 1920x1080';
  
  const finalPrompt = `${prompt}${stylePrompt}`;

  try {
    // Using the recommended model for image generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: finalPrompt }
        ]
      },
      // Note: While generateContent works for text, image models might return inlineData
      // However, for pure image generation models, the response structure depends on the specific model endpoint.
      // The guidelines suggest using `generateContent` for nano banana models (gemini-2.5-flash-image).
    });

    // Parse response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64String = part.inlineData.data;
          return `data:image/png;base64,${base64String}`;
        }
      }
    }
    
    throw new Error("No image data received from Gemini.");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
