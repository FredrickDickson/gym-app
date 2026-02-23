import { GoogleGenAI } from "@google/genai";

export interface PlaceResult {
  title: string;
  uri: string;
  rating?: number;
  address?: string;
}

export const LocationService = {
  getCurrentLocation: (): Promise<{lat: number, lng: number}> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err)
      );
    });
  },

  findNearbyPlaces: async (query: string, apiKey: string): Promise<PlaceResult[]> => {
    try {
      const location = await LocationService.getCurrentLocation();
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            // googleSearchRetrieval is not valid for googleMaps tool
          }
        }
      });

      // Extract grounding chunks
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const places: PlaceResult[] = [];

      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web?.uri && chunk.web?.title) {
             places.push({
                title: chunk.web.title,
                uri: chunk.web.uri
             });
          }
        });
      }
      
      // If no chunks, try to parse text (fallback) or return empty
      return places;

    } catch (error) {
      console.error("Maps Search Failed", error);
      return [];
    }
  }
};
