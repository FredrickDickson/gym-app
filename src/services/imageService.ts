import { GoogleGenAI } from "@google/genai";

const DB_NAME = 'FitTrackDB';
const STORE_NAME = 'images';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveToDB = async (key: string, value: string) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(value, key);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('Failed to save to IndexedDB', e);
  }
};

const getFromDB = async (key: string): Promise<string | null> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    return null;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ImageService = {
  getImages: async (): Promise<Record<string, string> | null> => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAllKeys();
      
      return new Promise((resolve) => {
        request.onsuccess = async () => {
          const keys = request.result as string[];
          if (keys.length === 0) return resolve(null);
          
          const images: Record<string, string> = {};
          for (const key of keys) {
            const val = await getFromDB(key);
            if (val) images[key] = val;
          }
          resolve(images);
        };
        request.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  },

  generateImages: async (apiKey: string): Promise<Record<string, string>> => {
    const ai = new GoogleGenAI({ apiKey });
    const prompts: Record<string, string> = {
      fitness_hero: "A high-intensity gym workout scene, cinematic lighting, focused athlete, dark and moody atmosphere, photorealistic, 4k",
      gym_interior: "A modern gym interior with equipment, wide angle, clean, bright lighting, photorealistic, 4k",
      ex_1: "Close up of a barbell bench press setup in a gym, professional photography, photorealistic, 4k",
      ex_2: "Dumbbell incline bench press setup in a gym, professional photography, photorealistic, 4k",
      ex_3: "Cable crossover machine setup in a gym, professional photography, photorealistic, 4k",
      ex_4: "EZ bar on a bench in a gym for skullcrushers, professional photography, photorealistic, 4k",
      ex_5: "A running track or treadmill, dynamic angle, photorealistic, 4k"
    };

    const images: Record<string, string> = {};

    // Process sequentially with delay to avoid 429
    for (const [key, prompt] of Object.entries(prompts)) {
      let success = false;
      let retries = 0;
      const maxRetries = 2;

      while (!success && retries <= maxRetries) {
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
                const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                images[key] = dataUrl;
                await saveToDB(key, dataUrl);
                success = true;
                break;
              }
            }
          }
          
          if (!success) {
             images[key] = `https://picsum.photos/seed/${key}/800/600`;
             success = true;
          }
        } catch (error: any) {
          if (error?.message?.includes('429') || error?.status === 429) {
            retries++;
            if (retries <= maxRetries) {
              console.warn(`Rate limited for ${key}, retrying in ${retries * 2000}ms...`);
              await delay(retries * 2000);
              continue;
            }
          }
          console.error(`Failed to generate ${key}`, error);
          images[key] = `https://picsum.photos/seed/${key}/800/600`;
          success = true;
        }
      }
      // Small delay between successful requests to be safe
      await delay(500);
    }

    return images;
  }
};
