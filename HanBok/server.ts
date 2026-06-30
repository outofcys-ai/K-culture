import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

// 비율 + 해상도 → 픽셀 크기 (긴 변 기준)
function getDimensions(aspectRatio: string, imageSize: string): { width: number; height: number } {
  const base = imageSize === "512px" ? 512 : imageSize === "2K" ? 1280 : 1024;
  switch (aspectRatio) {
    case "3:4":
      return { width: Math.round((base * 3) / 4), height: base };
    case "9:16":
      return { width: Math.round((base * 9) / 16), height: base };
    case "4:3":
      return { width: base, height: Math.round((base * 3) / 4) };
    case "1:1":
    default:
      return { width: base, height: base };
  }
}

function buildCommentary(conceptStyle: string): string {
  if (conceptStyle === "garden") return "흐드러진 매화 정원에서 고운 한복 자락이 봄볕에 물들었습니다.";
  if (conceptStyle === "night") return "청사초롱 은은한 달빛 아래, 단아한 한복의 자태가 빛납니다.";
  if (conceptStyle === "studio") return "정갈한 전통 스튜디오에서 완성한 고품격 한복 화보입니다.";
  return "고궁 앞뜰의 황금빛 햇살 속, 기품 있는 한복 화보가 완성되었습니다.";
}

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
      accessoryTitle,
      dyeColor,
      conceptStyle,           // "palace" | "garden" | "studio" | "night"
      aspectRatio,            // "1:1" | "3:4" | "9:16" | "4:3"
      imageSize,              // "512px" | "1K" | "2K"
      framing,                // "full" | "half"
    } = req.body;

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

    if (activeTab === "myphoto") {
      // Pollinations는 업로드 얼굴 보존(img2img)이 어려워 텍스트 기반 한복 인물 화보로 생성한다.
      promptText = `Ultra-realistic, photorealistic high-fidelity masterpiece portrait of an elegant young Korean person dressed in an exquisite luxurious royal Korean traditional Hanbok with intricate silken patterns and embroideries, key fabric tone of lovely ${colorDesc}, wearing the traditional accessory "${accessoryTitle || "none"}".
      The background must be: ${backdropStr}
      ${framingPrompt}
      Gorgeous professional photography, 8k resolution, photorealistic, sharp focus, natural volumetric light.`;
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

    // Pollinations.ai 무료 이미지 생성 (API 키 불필요)
    const { width, height } = getDimensions(aspectRatio || "1:1", imageSize || "1K");
    const seed = Math.floor(Math.random() * 1_000_000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

    const imgResp = await fetch(url);
    if (!imgResp.ok) {
      throw new Error(`이미지 생성 서버 응답 오류 (${imgResp.status})`);
    }

    const arrayBuf = await imgResp.arrayBuffer();
    const base64 = Buffer.from(arrayBuf).toString("base64");
    const mime = imgResp.headers.get("content-type") || "image/jpeg";

    return res.json({
      success: true,
      imageData: `data:${mime};base64,${base64}`,
      commentary: buildCommentary(conceptStyle),
    });

  } catch (error: any) {
    console.error("AI Portrait Error:", error);
    res.status(500).json({
      error: error.message || "AI 화보 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
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
