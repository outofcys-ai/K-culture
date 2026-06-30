// HanBok AI 화보 생성 Vercel 서버리스 함수 (Pollinations.ai 무료 이미지 생성, API 키 불필요)

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

// 비율 + 해상도 → 픽셀 크기 (긴 변 기준). 서버리스 타임아웃을 고려해 상한을 둔다.
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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      characterName, activeTab,
      accessoryTitle, dyeColor,
      conceptStyle, aspectRatio, imageSize, framing,
    } = req.body;

    const colorDesc = getHexColorName(dyeColor);

    let backdropStr = "inside the beautiful front courtyard of a historic Joseon Dynasty Hanok palace, surrounded by glowing golden daylight.";
    if (conceptStyle === "garden") backdropStr = "a serene traditional Korean garden with graceful weeping cherry blossoms, stepping stone path, and vibrant wildflowers under warm sunlight.";
    else if (conceptStyle === "night") backdropStr = "a mysterious, romantic evening landscape at Gyeongbokgung Palace with decorative traditional paper lanterns casting soft warm candlelight reflections.";
    else if (conceptStyle === "studio") backdropStr = "a premium, minimalist photographic studio backdrop with traditional Korean handcraft screens, wooden frame, and professional gentle studio lighting gradient.";

    const framingPrompt = framing === "half"
      ? "A gorgeous half-body portrait, medium shot from the waist up."
      : "A complete standing FULL-BODY portrait from head to toe, the entire Hanbok outfit fully visible, centered with spacing so nothing is cropped.";

    let promptText = "";
    if (activeTab === "myphoto") {
      // Pollinations는 업로드 얼굴 보존(img2img)이 어려워 텍스트 기반 한복 인물 화보로 생성한다.
      promptText = `Ultra-realistic, photorealistic high-fidelity masterpiece portrait of an elegant young Korean person dressed in an exquisite luxurious royal Korean traditional Hanbok with intricate silk patterns, key fabric tone of ${colorDesc}, wearing the traditional accessory "${accessoryTitle || "none"}". Background: ${backdropStr} ${framingPrompt} Gorgeous professional photography, 8k, sharp focus, natural volumetric light.`;
    } else {
      const animalType = (characterName || "rabbit").includes("토끼") ? "adorable white fluffy bunny rabbit"
        : (characterName || "").includes("야옹") ? "charming sleek white cat" : "fluffy cuddly brown baby bear";
      promptText = `An incredibly cute photorealistic 3D rendering of an adorable fluffy anthropomorphic ${animalType} character standing on two legs, wearing a fully detailed Korean traditional luxury Hanbok custom dyed in gorgeous ${colorDesc} with shiny golden royal embroideries, wearing ${accessoryTitle || "nothing"} on its head. Background: ${backdropStr} ${framingPrompt} High-end 3D visual, Pixar-style, fluffy soft fur, big bright warm eyes, volumetric lighting, masterpiece.`;
    }

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

    res.json({
      success: true,
      imageData: `data:${mime};base64,${base64}`,
      commentary: buildCommentary(conceptStyle),
    });
  } catch (error: any) {
    console.error("AI Portrait Error:", error);
    res.status(500).json({ error: error.message || "AI 화보 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." });
  }
}
