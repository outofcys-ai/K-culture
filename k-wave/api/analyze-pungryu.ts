// k-wave 풍류 분석 Vercel 서버리스 함수
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { contentName, selectedDimensions, customNotes } = req.body;
  if (!contentName) {
    return res.status(400).json({ error: "contentName is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY가 설정되지 않았습니다." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });

    const dimensionsText =
      selectedDimensions && selectedDimensions.length > 0
        ? `Focus on analyzing these dimensions of Pungryu (풍류): ${selectedDimensions.join(", ")}.`
        : "Analyze across all four dimensions of Pungryu (풍류): 흥 (Heung), 한과 정 (Han & Jeong), 멋 (Meot), and 융합성 (Integration).";

    const prompt = `You are an expert Korean aesthetics researcher and philosopher.
Analyze the contemporary Korean culture work: "${contentName}".
${dimensionsText}
${customNotes ? `The user also provided this custom insight/note: "${customNotes}".` : ""}

Explain how this modern work connects to Pungryu (풍류). Return a beautiful, deeply academic yet poetic Korean response conforming exactly to the specified JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You represent the voice of traditional Korean aesthetics. Your analysis must be poetic, highly academic yet emotionally resonant, completely written in Korean.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            scores: {
              type: Type.OBJECT,
              properties: {
                heung: { type: Type.INTEGER },
                hanAndJeong: { type: Type.INTEGER },
                meot: { type: Type.INTEGER },
                integration: { type: Type.INTEGER },
              },
              required: ["heung", "hanAndJeong", "meot", "integration"],
            },
            scoresExplanation: {
              type: Type.OBJECT,
              properties: {
                heung: { type: Type.STRING },
                hanAndJeong: { type: Type.STRING },
                meot: { type: Type.STRING },
                integration: { type: Type.STRING },
              },
              required: ["heung", "hanAndJeong", "meot", "integration"],
            },
            traditionalAncestors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  traditionalName: { type: Type.STRING },
                  modernMap: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["traditionalName", "modernMap", "description"],
              },
            },
            deepAnalysis: { type: Type.STRING },
            poeticVerdict: { type: Type.STRING },
          },
          required: ["headline", "scores", "scoresExplanation", "traditionalAncestors", "deepAnalysis", "poeticVerdict"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
}
