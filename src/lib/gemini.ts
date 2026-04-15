import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface DiseaseAnalysis {
  diseaseName: string;
  confidence: number;
  causes: string[];
  organicRemedies: string[];
  chemicalRemedies: string[];
}

export async function analyzePlantDisease(imageBase64: string): Promise<DiseaseAnalysis> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze this plant leaf image for diseases. 
  Provide the result in JSON format with the following structure:
  {
    "diseaseName": "Name of the disease",
    "confidence": 0.95,
    "causes": ["cause 1", "cause 2"],
    "organicRemedies": ["remedy 1", "remedy 2"],
    "chemicalRemedies": ["remedy 1", "remedy 2"]
  }
  If no disease is found, state "Healthy" as the diseaseName.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diseaseName: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          causes: { type: Type.ARRAY, items: { type: Type.STRING } },
          organicRemedies: { type: Type.ARRAY, items: { type: Type.STRING } },
          chemicalRemedies: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["diseaseName", "confidence", "causes", "organicRemedies", "chemicalRemedies"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function getVoiceAssistantResponse(query: string, language: string): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are "Smart Krishi AI", a helpful assistant for farmers and gardeners. 
  Respond in ${language}. Keep your answers simple, practical, and focused on farming, gardening, and agriculture. 
  If the question is not related to agriculture, politely redirect the user.`;

  const response = await ai.models.generateContent({
    model,
    contents: query,
    config: {
      systemInstruction
    }
  });

  return response.text || "I'm sorry, I couldn't process that.";
}

export async function getCropRecommendations(weatherData: any): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Based on this weather data: ${JSON.stringify(weatherData)}, 
  recommend 3-5 crops that are best to grow right now and 3 crops for the upcoming months. 
  Provide practical advice for each crop. Format the response in Markdown.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt
  });

  return response.text || "No recommendations available at the moment.";
}
