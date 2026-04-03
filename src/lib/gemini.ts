import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

/**
 * Los modelos disponibles:
 * - gemini-1.5-flash (Rápido, económico, ideal para resúmenes)
 * - gemini-1.5-pro (Más inteligente, mejor para análisis profundo)
 */
export const getGeminiModel = (modelName: string = "gemini-1.5-flash") => {
  return genAI.getGenerativeModel({ model: modelName });
};

export const SCRIP_ANALYSIS_PROMPT = `
Eres un experto en producción cinematográfica y desglose de guiones (Script Breakdown).
Analiza el siguiente texto de un guion de cine o comercial.

Extrae los siguientes elementos de forma estructurada en un formato JSON puro (sin markdown, solo el objeto):

{
  "items": [
    {
      "scene_number": "número",
      "category": "personaje | locacion | utileria | vestuario | extras",
      "name": "NOMBRE EN MAYÚSCULAS",
      "description": "breve descripción de su participación o apariencia en la escena",
      "status": "pending"
    }
  ]
}

Instrucciones:
- Identifica cada personaje con diálogo o acción relevante.
- Identifica locaciones (Interior/Exterior).
- Identifica objetos clave (Utilería/Props).
- Mantén las descripciones breves y profesionales.
- Idioma: Español.

Texto del Guion:
`;
