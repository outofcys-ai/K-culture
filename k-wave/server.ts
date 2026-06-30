import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Pungryu analysis
  app.post("/api/analyze-pungryu", async (req, res) => {
    try {
      const { contentName, selectedDimensions, customNotes } = req.body;
      if (!contentName) {
        return res.status(400).json({ error: "contentName is required" });
      }

      // Lazy check and load of Gemini SDK client
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY environment variable is not configured. Please add it via Settings > Secrets in the panel.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const dimensionsText = selectedDimensions && selectedDimensions.length > 0 
        ? `Focus on analyzing these dimensions of Pungryu (풍류): ${selectedDimensions.join(", ")}.`
        : "Analyze across all four dimensions of Pungryu (풍류): 흥 (Heung), 한과 정 (Han & Jeong), 멋 (Meot), and 융합성 (Integration).";

      const prompt = `You are an expert Korean aesthetics researcher and philosopher.
Analyze the contemporary Korean culture work: "${contentName}".
${dimensionsText}
${customNotes ? `The user also provided this custom insight/note: "${customNotes}".` : ""}

Explain how this modern work connects to Pungryu (풍류 - 'the flow of wind'), as documented in ancient historical texts (e.g., Choi Chi-won's description in Nanrangbiseo). Explain how it echoes traditional Korean physical arts, emotions, architecture, or crafts.

Return a beautiful, deeply academic yet poetic Korean response conforming exactly to the specified JSON schema. Keep the analysis strictly in Korean, and make sure the scores reflect a genuine proportional evaluation of the work.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You represent the voice of traditional Korean aesthetics. Your analysis must be poetic, highly academic yet emotionally resonant, completely written in Korean.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: {
                type: Type.STRING,
                description: "A short poetic headline in Korean summing up the Pungryu profile of this content."
              },
              scores: {
                type: Type.OBJECT,
                properties: {
                  heung: {
                    type: Type.INTEGER,
                    description: "Excitement/shynmyeong score from 1 to 100."
                  },
                  hanAndJeong: {
                    type: Type.INTEGER,
                    description: "Han and Jeong (emotional depth/sublimation) score from 1 to 100."
                  },
                  meot: {
                    type: Type.INTEGER,
                    description: "Meot (style/restrained elegance and natural beauty) score from 1 to 100."
                  },
                  integration: {
                    type: Type.INTEGER,
                    description: "Integration/convergence (complex combined art/multi-genre) score from 1 to 100."
                  }
                },
                required: ["heung", "hanAndJeong", "meot", "integration"]
              },
              scoresExplanation: {
                type: Type.OBJECT,
                properties: {
                  heung: { type: Type.STRING, description: "Detailed 1-2 sentence explanation of the '흥' score in Korean." },
                  hanAndJeong: { type: Type.STRING, description: "Detailed 1-2 sentence explanation of the '한과 정' score in Korean." },
                  meot: { type: Type.STRING, description: "Detailed 1-2 sentence explanation of the '멋' score in Korean." },
                  integration: { type: Type.STRING, description: "Detailed 1-2 sentence explanation of the '융합성' score in Korean." }
                },
                required: ["heung", "hanAndJeong", "meot", "integration"]
              },
              traditionalAncestors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    traditionalName: { type: Type.STRING, description: "Name of traditional Korean art form or concept (e.g., 판소리, 탈춤, 사물놀이, 한옥, 백자)." },
                    modernMap: { type: Type.STRING, description: "How this maps visually, sonically, or conceptually to the analyzed Hallyu work." },
                    description: { type: Type.STRING, description: "Deep cultural explanation of the link in Korean." }
                  },
                  required: ["traditionalName", "modernMap", "description"]
                },
                description: "At least 2 traditional artistic Ancestors matching this content."
              },
              deepAnalysis: {
                type: Type.STRING,
                description: "A deep core synthesis of 2 paragraphs in Korean, exploring the Pungryu philosophy connecting this Hallyu work."
              },
              poeticVerdict: {
                type: Type.STRING,
                description: "A beautiful concluding poetic sentence in Korean, starting with '바람이 흐르듯...' or a similar wind/water/natural flow motif."
              }
            },
            required: ["headline", "scores", "scoresExplanation", "traditionalAncestors", "deepAnalysis", "poeticVerdict"]
          }
        }
      });

      const responseText = response.text || "";
      const parsedData = JSON.parse(responseText);
      res.json({ success: true, data: parsedData });
    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: error?.message || "Internal server error" });
    }
  });

  // Serve static assets or mount Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
