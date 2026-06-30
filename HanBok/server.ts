import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

// Increase payload limits to support base64 selfie image uploads safely
app.use(express.json({ limit: "15mb" }));

// Helper to map color hex codes to traditional, high-fidelity descriptive words for AI matching
function getHexColorName(hex: string): string {
  if (!hex) return "exquisite traditional Korean color scheme";
  const h = hex.toUpperCase();
  if (h === "#BE123C" || h.includes("BE12")) return "royal deep crimson red";
  if (h === "#1D4ED8" || h.includes("1D4E")) return "noble deep royal indigo blue";
  if (h === "#047857" || h.includes("0478")) return "royal emerald forest pastel green";
  if (h === "#D97706" || h.includes("D977")) return "traditional imperial marigold yellow";
  if (h === "#6D28D9" || h.includes("6D28")) return "elegant plum dark purple";
  if (h === "#BFDBFE" || h.includes("BFDB")) return "gentle high-society water sky blue";
  if (h === "#FBCFE8" || h.includes("FBCF")) return "graceful blushing pink peach blossom";
  if (h === "#111827" || h.includes("1118")) return "sophisticated obsidian charcoal black";
  return `traditional refined color tone (${hex})`;
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
});

// 2. High-Fidelity AI Realistic Dressing Pictorial Generator Endpoint
app.post("/api/ai-portrait", async (req, res) => {
  try {
    const {
      characterName,
      activeTab,
      userPhotoData,          // base64 data url from face capture
      hanbokTitle,
      accessoryTitle,
      dyeColor,
      conceptStyle,           // "palace" | "garden" | "studio" | "night"
      aspectRatio,            // "1:1" | "3:4" | "9:16" | "4:3"
      imageSize,              // "512px" | "1K" | "2K"
      framing,                // "full" | "half"
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: "GEMINI_API_KEY이 설정되지 않았습니다. AI Studio 설정에서 API 키를 입력해 주세요.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // Formulate a color descriptor
    const colorDesc = getHexColorName(dyeColor);

    // Formulate stylistic backdrop setting instructions
    let backdropStr = "inside the beautiful front courtyard of a historic Joseon Dynasty Hanok palace, surrounded by glowing golden daylight.";
    if (conceptStyle === "garden") {
      backdropStr = "a serene traditional Korean garden with graceful weeping cherry blossoms, stepping stone path, and vibrant wildflowers under warm sunlight.";
    } else if (conceptStyle === "night") {
      backdropStr = "a mysterious, romantic evening landscape at Gyeongbokgung Palace with decorative traditional paper lanterns (Cheongsa Chorong) casting soft warm candlelight reflections.";
    } else if (conceptStyle === "studio") {
      backdropStr = "a premium, minimalist photographic studio backdrop with traditional Korean handcraft screens, wooden frame, and professional gentle studio lighting gradient.";
    }

    // Framing prompt additions
    let framingPrompt = "";
    if (framing === "half") {
      framingPrompt = "Composition style: A gorgeous half-body portrait / medium shot from the waist up. This focuses on the details of the face, traditional head accessory, and upper-body Hanbok (Jeogori/collar) with a clean portrait crop.";
    } else {
      // Default to full body
      framingPrompt = "Crucial composition style: Generate a complete standing FULL-BODY portrait showing the person/character gracefully from head to toe. The entire Hanbok outfit must be fully visible in the frame, including the elegant flowing skirt (Chima) draping down to the ground and showing traditional Korean footwear (Kkotshin). The entire pose must be centered with sufficient spacing around the head and feet to ensure nothing is cropped.";
    }

    // Build the AI text instructions
    let promptText = "";

    if (activeTab === "myphoto" && userPhotoData) {
      // Selfie mode (Face-swap style / dress-up enhancement prompt)
      promptText = `Generate an ultra-realistic, photorealistic high-fidelity masterpiece portrait of the person shown in the reference face photo, realistically dressed up in an exquisite, luxurious royal Korean traditional Hanbok. 
      The Hanbok features beautiful intricate silken patterns and embroideries, with key fabric tone of lovely ${colorDesc}.
      The person is wearing the traditional accessory: "${accessoryTitle || "none"}".
      The background must be: ${backdropStr}
      ${framingPrompt}
      Crucial: The generated person's eyes, nose, lips, facial shape, and general ethnic resemblance must strictly respect the reference image's facial structure and features to maintain close identity, beautifully rendering them as if they are in a professional k-drama historical movie poster or premium magazine pictorial. Gorgeous professional photography, 8k resolution, photorealistic, sharp focus, natural volumetric light.`;
    } else {
      // Character model mode
      const animalType = (characterName || "rabbit").includes("토끼") ? "adorable white fluffy bunny rabbit" :
                         (characterName || "").includes("야옹") ? "charming sleek white cat" : "fluffy cuddly brown baby bear";
      
      promptText = `An incredibly cute, photorealistic 3D rendering of an adorable fluffy anthropomorphic ${animalType} character, standing on two legs, wearing a fully detailed Korean traditional luxury Hanbok.
      The Hanbok is beautifully custom dyed in gorgeous ${colorDesc} with shiny intricate golden royal embroideries and beautiful fabric folds.
      The cute character is wearing ${accessoryTitle || "nothing"} on its head.
      The background setting is: ${backdropStr}
      ${framingPrompt}
      High-end 3D visual, Pixar or realist hybrid aesthetic, fluffy soft fur textures, charming big bright warm eyes, volumetric lighting, rich traditional color depth, masterpiece illustration, detailed materials.`;
    }

    // Config for image generation
    const chosenAspect = aspectRatio || "1:1";
    const chosenSize = imageSize || "1K";

    // Check if we are passing an image reference
    if (activeTab === "myphoto" && userPhotoData) {
      let base64Part = "";
      let mimeType = "image/png";

      if (userPhotoData.includes(",")) {
        const commaIdx = userPhotoData.indexOf(",");
        const prefix = userPhotoData.substring(0, commaIdx);
        const match = prefix.match(/data:(.*?);base64/);
        if (match) {
          mimeType = match[1];
        }
        base64Part = userPhotoData.substring(commaIdx + 1);
      } else {
        base64Part = userPhotoData;
      }

      // Generate content using gemini-3.1-flash-image with an image part + text part context!
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Part,
                mimeType: mimeType,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: chosenAspect,
            imageSize: chosenSize,
          },
        },
      });

      // Find image part in the response candidates
      let generatedImageBase64 = null;
      let modelSpeech = "";

      if (response?.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageBase64 = part.inlineData.data;
          } else if (part.text) {
            modelSpeech += part.text;
          }
        }
      }

      if (!generatedImageBase64) {
        throw new Error("AI가 이미지 생성 데이터 파트를 반환하지 않았습니다. 프롬프트나 화질 제한을 확인해 주세요.");
      }

      return res.json({
        success: true,
        imageData: `data:image/png;base64,${generatedImageBase64}`,
        commentary: modelSpeech || "한복 화보가 눈부시게 단장되어 탄생했습니다!"
      });

    } else {
      // Text-driven realistic portrait generation for characters
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: {
          parts: [
            {
              text: promptText,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: chosenAspect,
            imageSize: chosenSize,
          },
        },
      });

      let generatedImageBase64 = null;
      let modelSpeech = "";

      if (response?.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageBase64 = part.inlineData.data;
          } else if (part.text) {
            modelSpeech += part.text;
          }
        }
      }

      if (!generatedImageBase64) {
        throw new Error("캐릭터 AI 화보 데이터를 불러오는 데 실패했습니다.");
      }

      return res.json({
        success: true,
        imageData: `data:image/png;base64,${generatedImageBase64}`,
        commentary: modelSpeech || "앙증맞고 고운 전통 한복 화보가 현실처럼 완성되었습니다."
      });
    }

  } catch (error: any) {
    console.error("AI Portrait Error:", error);
    let errorMsg = error.message || "AI 생성 연산 중 심각한 예외 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    
    // Check if it's a quota or billing-related issue and provide a friendly hint
    if (errorMsg.includes("quota") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("billing") || errorMsg.includes("limit: 0")) {
      errorMsg = "RESOURCE_EXHAUSTED_LIMIT_0_NEED_PAID_KEY: Gemini AI 실사 화보 생성 모델은 고성능 이미지 전용 서비스로, Google AI Studio의 유료 결제 계정(Paid-tier Key) 연결이 필요합니다. 우측 상단 'Settings > Secrets' 패널에 등록된 API 키의 결제 연동(Paid model flow) 상태를 점검해 주시기 바랍니다.";
    }
    
    res.status(500).json({
      error: errorMsg,
    });
  }
});

// 3. Integrate Vite as dev middleware or static compiler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware mounted successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files mounted from: " + distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Dev Server is listening on port ${PORT}`);
  });
}

startServer();
