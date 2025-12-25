
import { GoogleGenAI } from "@google/genai";
import { IMAGE_STYLES } from "../constants";

// Initialize Gemini Client
// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImageWithGemini = async (prompt: string, styleId: string): Promise<string> => {
  // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
  if (!process.env.API_KEY) {
    throw new Error("Missing Gemini API Key in environment variables.");
  }

  const selectedStyle = IMAGE_STYLES.find(s => s.id === styleId);
  const stylePrompt = selectedStyle && selectedStyle.id !== 'none' 
    ? `, in ${selectedStyle.label} style, high quality, 1920x1080` 
    : ', high quality, 1920x1080';
  
  const finalPrompt = `${prompt}${stylePrompt}`;

  try {
    const response = await ai.models.generateContent({
      // Use 'gemini-2.5-flash-image' for image generation tasks as per guidelines.
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: finalPrompt }
        ]
      },
    });

    // Iterate through candidates and parts to find the image part
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

export const enhancePromptWithAI = async (currentPrompt: string): Promise<string> => {
    // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
    if (!process.env.API_KEY) return currentPrompt;
    
    try {
        const response = await ai.models.generateContent({
            // Use 'gemini-3-flash-preview' for basic text tasks like prompt enhancement.
            model: 'gemini-3-flash-preview',
            contents: `You are an expert AI art prompt engineer. Rewrite the following user prompt to be more detailed, descriptive, and optimized for high-quality image generation. Add keywords about lighting, texture, composition, and mood. Keep it under 50 words. Do not add conversational text, just the prompt.
            
            User Prompt: "${currentPrompt}"`
        });
        
        // Use the .text property to get generated content as per latest SDK guidelines.
        return response.text?.trim() || currentPrompt;
    } catch (e) {
        console.error("Prompt enhancement failed", e);
        return currentPrompt;
    }
};
