import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY or GEMINI_API_KEY is not set");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const prompts = {
  fitness_hero: "A high-intensity gym workout scene, cinematic lighting, focused athlete, dark and moody atmosphere, photorealistic, 4k",
  gym_interior: "A modern gym interior with equipment, wide angle, clean, bright lighting, photorealistic, 4k",
  bench_press: "Close up of a barbell bench press setup in a gym, professional photography, photorealistic, 4k",
  incline_press: "Dumbbell incline bench press setup in a gym, professional photography, photorealistic, 4k",
  cable_flys: "Cable crossover machine setup in a gym, professional photography, photorealistic, 4k",
  skullcrushers: "EZ bar on a bench in a gym, professional photography, photorealistic, 4k",
  sprint: "A running track or treadmill, dynamic angle, photorealistic, 4k"
};

async function generateImage(prompt: string): Promise<string | null> {
  try {
    console.log(`Generating image for prompt: "${prompt}"...`);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        // imageConfig is not supported for gemini-2.5-flash-image in the same way as imagen, 
        // but let's try to just use the prompt.
        // Actually the guidance says: "Generate images using gemini-2.5-flash-image by default... Call generateContent... The output response may contain both image and text parts"
      }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    console.error("No image found in response");
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}

async function main() {
  const images: Record<string, string> = {};

  for (const [key, prompt] of Object.entries(prompts)) {
    const dataUrl = await generateImage(prompt);
    if (dataUrl) {
      images[key] = dataUrl;
      console.log(`Generated ${key}`);
    } else {
      console.error(`Failed to generate ${key}`);
      // Fallback to placeholder if generation fails
      images[key] = `https://picsum.photos/seed/${key}/800/600`;
    }
  }

  const outputContent = `// Auto-generated images
export const GENERATED_IMAGES = {
${Object.entries(images).map(([key, value]) => `  ${key}: "${value}",`).join('\n')}
};
`;

  const outputPath = path.join(process.cwd(), 'src', 'assets', 'generated_images.ts');
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, outputContent);
  console.log(`Images saved to ${outputPath}`);
}

main();
