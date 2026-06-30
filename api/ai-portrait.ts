// HanBok 한복 AI 화보 생성 Vercel 서버리스 함수
import { GoogleGenAI } from "@google/genai";

function getHexColorName(hex: string): string {
  if (!hex) return "exquisite traditional Korean color scheme";
  const h = hex.toUpperCase();
  if (h.includes("BE12")) return "royal deep crimson red";
  if (h.includes("1D4E")) return "noble deep royal indigo blue";
  if (h.includes("0478")) return "royal emerald forest pastel green";
  if (h.includes("D977")) return "traditional imperial marigold yellow";
  if (h.includes("6D28")) return "elegant plum dark purple";
  if (h.includes("BFDB")) return "gentle high-society water sky blue";
  if (h.includes("FBCF")) return "graceful blushing pink peach blossom";
  if (h.includes("1118")) return "sophisticated obsidian charcoal black";
  return `traditional refined color tone (${hex})`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(400).json({ error: "GEMINI_API_KEY이 설정되지 않았습니다." });
  }

  try {
    const {
      characterName, activeTab, userPhotoData,
      hanbokTitle, accessoryTitle, dyeColor,
      conceptStyle, aspectRatio, imageSize, framing,
    } = req.body;

    const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
    const colorDesc = getHexColorName(dyeColor);

    let backdropStr = "inside the beautiful front courtyard of a historic Joseon Dynasty Hanok palace, surrounded by glowing golden daylight.";
    if (conceptStyle === "garden") backdropStr = "a serene traditional Korean garden with graceful weeping cherry blossoms, stepping stone path, and vibrant wildflowers under warm sunlight.";
    else if (conceptStyle === "night") backdropStr = "a mysterious, romantic evening landscape at Gyeongbokgung Palace with decorative traditional paper lanterns casting soft warm candlelight reflections.";
    else if (conceptStyle === "studio") backdropStr = "a premium, minimalist photographic studio backdrop with traditional Korean handcraft screens, wooden frame, and professional gentle studio lighting gradient.";

    const framingPrompt = framing === "half"
      ? "Composition style: A gorgeous half-body portrait / medium shot from the waist up."
      : "Crucial composition style: Generate a complete standing FULL-BODY portrait showing the person/character gracefully from head to toe. The entire Hanbok outfit must be fully visible in the frame.";

    let promptText = "";
    if (activeTab === "myphoto" && userPhotoData) {
      promptText = `Generate an ultra-realistic, photorealistic high-fidelity masterpiece portrait of the person shown in the reference face photo, realistically dressed up in an exquisite, luxurious royal Korean traditional Hanbok.
      The Hanbok features beautiful intricate silken patterns and embroideries, with key fabric tone of lovely ${colorDesc}.
      The person is wearing the traditional accessory: "${accessoryTitle || "none"}".
      The background must be: ${backdropStr}
      ${framingPrompt}
      Crucial: The generated person's facial structure must strictly respect the reference image to maintain close identity. Gorgeous professional photography, 8k resolution, photorealistic, sharp focus.`;
    } else {
      const animalType = (characterName || "rabbit").includes("토끼") ? "adorable white fluffy bunny rabbit"
        : (characterName || "").includes("야옹") ? "charming sleek white cat" : "fluffy cuddly brown baby bear";
      promptText = `An incredibly cute, photorealistic 3D rendering of an adorable fluffy anthropomorphic ${animalType} character, standing on two legs, wearing a fully detailed Korean traditional luxury Hanbok.
      The Hanbok is beautifully custom dyed in gorgeous ${colorDesc} with shiny intricate golden royal embroideries.
      The cute character is wearing ${accessoryTitle || "nothing"} on its head.
      The background setting is: ${backdropStr}
      ${framingPrompt}
      High-end 3D visual, Pixar or realist hybrid aesthetic, fluffy soft fur textures, masterpiece illustration.`;
    }

    const chosenAspect = aspectRatio || "1:1";
    const chosenSize = imageSize || "1K";

    const contents: any = activeTab === "myphoto" && userPhotoData
      ? {
          parts: [
            { inlineData: { data: userPhotoData.includes(",") ? userPhotoData.split(",")[1] : userPhotoData, mimeType: "image/png" } },
            { text: promptText },
          ],
        }
      : { parts: [{ text: promptText }] };

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents,
      config: { imageConfig: { aspectRatio: chosenAspect, imageSize: chosenSize } },
    });

    let generatedImageBase64 = null;
    let modelSpeech = "";
    for (const part of response?.candidates?.[0]?.content?.parts || []) {
      if ((part as any).inlineData) generatedImageBase64 = (part as any).inlineData.data;
      else if (part.text) modelSpeech += part.text;
    }

    if (!generatedImageBase64) throw new Error("AI가 이미지를 생성하지 못했습니다.");

    res.json({
      success: true,
      imageData: `data:image/png;base64,${generatedImageBase64}`,
      commentary: modelSpeech || "한복 화보가 완성되었습니다!",
    });
  } catch (error: any) {
    console.error("AI Portrait Error:", error);
    let errorMsg = error.message || "AI 생성 중 오류가 발생했습니다.";
    if (errorMsg.includes("quota") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
      errorMsg = "API 할당량을 초과했습니다. 잠시 후 다시 시도해 주세요.";
    }
    res.status(500).json({ error: errorMsg });
  }
}
