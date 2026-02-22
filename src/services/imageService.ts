import { GoogleGenAI } from "@google/genai";

const GENERATED_IMAGES_KEY = 'fit_track_generated_images';

export const ImageService = {
  getImages: (): Record<string, string> | null => {
    try {
      const data = localStorage.getItem(GENERATED_IMAGES_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  generateImages: async (apiKey: string): Promise<Record<string, string>> => {
    const ai = new GoogleGenAI({ apiKey });
    const prompts: Record<string, string> = {
      fitness_hero: "A high-intensity gym workout scene, cinematic lighting, focused athlete, dark and moody atmosphere, photorealistic, 4k",
      gym_interior: "A modern gym interior with equipment, wide angle, clean, bright lighting, photorealistic, 4k",
      // Exercise specific images
      ex_1: "Close up of a barbell bench press setup in a gym, professional photography, photorealistic, 4k", // Bench Press
      ex_2: "Dumbbell incline bench press setup in a gym, professional photography, photorealistic, 4k", // Incline Press
      ex_3: "Cable crossover machine setup in a gym, professional photography, photorealistic, 4k", // Cable Flys
      ex_4: "EZ bar on a bench in a gym for skullcrushers, professional photography, photorealistic, 4k", // Skullcrushers
      ex_5: "A running track or treadmill, dynamic angle, photorealistic, 4k" // Sprints
    };

    const images: Record<string, string> = {};

    // Generate in parallel
    const promises = Object.entries(prompts).map(async ([key, prompt]) => {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: prompt }]
          }
        });

        if (response.candidates && response.candidates[0].content.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              images[key] = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
              return;
            }
          }
        }
        // Fallback
        images[key] = `https://picsum.photos/seed/${key}/800/600`;
      } catch (error) {
        console.error(`Failed to generate ${key}`, error);
        images[key] = `https://picsum.photos/seed/${key}/800/600`;
      }
    });

    await Promise.all(promises);
    localStorage.setItem(GENERATED_IMAGES_KEY, JSON.stringify(images));
    return images;
  }
};
