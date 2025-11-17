
import { GoogleGenAI } from "@google/genai";
import type { Business } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJsonString = (str: string): string => {
  // Remove markdown backticks and 'json' language identifier
  const cleaned = str.replace(/```json/g, '').replace(/```/g, '');
  return cleaned.trim();
};

export const findBusinessesWithoutWebsite = async (
    businessType: string, 
    location: GeolocationCoordinates
): Promise<Business[]> => {
    const prompt = `
      Using Google Maps data, find '${businessType}' near the user's location (${location.latitude}, ${location.longitude}).
      For each business found, provide its name, full address, phone number (if available), the direct Google Maps URL, and its website URL if it has one.
      Return the results as a valid JSON array of objects.
      Each object must have the following keys: "name", "address", "phone", "mapsUrl", and "website".
      If a phone number or website is not available for a business, set its value to null.
      If no businesses are found, return an empty JSON array.
      Do not include any explanatory text or markdown formatting outside of the JSON array itself.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: location.latitude,
                            longitude: location.longitude
                        }
                    }
                }
            },
        });

        const jsonString = cleanJsonString(response.text);

        if (!jsonString) {
          return [];
        }

        const parsedResult = JSON.parse(jsonString);

        if (Array.isArray(parsedResult)) {
            // Explicitly type the result from parsing
            const allBusinesses: Business[] = parsedResult;

            // Filter out businesses that have a website. A website value of null, undefined, or "" is considered as no website.
            const businessesWithoutWebsite = allBusinesses.filter(business => !business.website);
            
            return businessesWithoutWebsite;
        }

        throw new Error("Invalid response format from API. Expected a JSON array.");
    } catch (error) {
        console.error("Error calling Gemini API or parsing response:", error);
        if (error instanceof SyntaxError) {
          throw new Error("Failed to parse the response from the AI. The format was invalid.");
        }
        throw new Error("Failed to fetch business data. Please try again later.");
    }
};