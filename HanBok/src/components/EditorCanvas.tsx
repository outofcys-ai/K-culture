import React, { useRef, useState, useEffect } from 'react';
import { Character, HanbokItem, TransformState, ActiveTab } from '../types';
import { TraditionalGrid, FloatingCloud } from './KoreanPattern';
import { Maximize2, RotateCw, Move, Check, Download, Layers, Sparkles, RefreshCw, EyeOff, FlipHorizontal, Palette, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditorCanvasProps {
  activeTab: ActiveTab;
  selectedCharacter: Character;
  userPhotoUrl: string | null;
  selectedHanbok: HanbokItem | null;
  selectedAccessory: HanbokItem | null;
  dyeColor: string;
  
  // Transform states
  characterTransform: TransformState;
  setCharacterTransform: React.Dispatch<React.SetStateAction<TransformState>>;
  hanbokTransform: TransformState;
  setHanbokTransform: React.Dispatch<React.SetStateAction<TransformState>>;
  accessoryTransform: TransformState;
  setAccessoryTransform: React.Dispatch<React.SetStateAction<TransformState>>;
  wardrobeNode?: React.ReactNode;

  // Lifted panel states
  showAdjustPanel: boolean;
  setShowAdjustPanel: (show: boolean) => void;
}

type EditTarget = 'character' | 'hanbok' | 'accessory';

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  activeTab,
  selectedCharacter,
  userPhotoUrl,
  selectedHanbok,
  selectedAccessory,
  dyeColor,
  characterTransform,
  setCharacterTransform,
  hanbokTransform,
  setHanbokTransform,
  accessoryTransform,
  setAccessoryTransform,
  wardrobeNode,
  showAdjustPanel,
  setShowAdjustPanel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTarget, setActiveTarget] = useState<EditTarget>('character');
  const [isDownloading, setIsDownloading] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [activePresetFit, setActivePresetFit] = useState<string>('default');
  const [mobileSubTab, setMobileSubTab] = useState<'wardrobe' | 'adjust' | 'save'>('wardrobe');

  // AI Realistic Portrait Studio States
  const [conceptStyle, setConceptStyle] = useState<'palace' | 'garden' | 'night' | 'studio'>('palace');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [imageSize, setImageSize] = useState<string>('1K');
  const [framing, setFraming] = useState<string>('full');
  const [showAiPanel, setShowAiPanel] = useState(false); // AI 세부옵션을 미세조정 아래 인라인으로 표시
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);
  const [aiCommentary, setAiCommentary] = useState<string>('');
  const [aiError, setAiError] = useState<string | null>(null);

  const generateAiPortrait = async () => {
    setIsAiGenerating(true);
    setAiError(null);
    setAiImageUrl(null);
    setAiCommentary('');

    try {
      const response = await fetch('/api/ai-portrait', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterName: selectedCharacter.name,
          activeTab,
          userPhotoData: activeTab === 'myphoto' ? userPhotoUrl : null,
          hanbokTitle: selectedHanbok ? selectedHanbok.name : '기본 흰 단아한 한복',
          accessoryTitle: selectedAccessory ? selectedAccessory.name : '없음',
          dyeColor,
          conceptStyle,
          aspectRatio,
          imageSize,
          framing,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'AI 화보 그리기 중 서버 연결 또는 생성 오류가 발생했습니다.');
      }

      setAiImageUrl(data.imageData);
      setAiCommentary(data.commentary);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || '네트워크 원격 주소 결함 또는 API 한도를 넘어섰습니다. 잠시 후 재시도 바랍니다.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const downloadAiPortrait = () => {
    if (!aiImageUrl) return;
    const dlLink = document.createElement('a');
    dlLink.download = `AI_Hanbok_Portrait_${selectedCharacter.id}_${Date.now()}.png`;
    dlLink.href = aiImageUrl;
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
  };

  const activeTransform = 
    activeTarget === 'character' 
      ? characterTransform 
      : activeTarget === 'hanbok' 
        ? hanbokTransform 
        : accessoryTransform;
        
  const setActiveTransform = 
    activeTarget === 'character' 
      ? setCharacterTransform 
      : activeTarget === 'hanbok' 
        ? setHanbokTransform 
        : setAccessoryTransform;

  // Reset transforms to default calibrations
  const resetTransform = () => {
    if (activeTarget === 'character') {
      setCharacterTransform({
        x: 0,
        y: 45,
        scale: 1.0,
        rotation: 0,
        flipX: false,
        opacity: 1,
      });
    } else if (activeTarget === 'hanbok' && selectedHanbok) {
      setHanbokTransform({
        x: 0,
        y: activeTab === 'character' ? selectedHanbok.defaultYOffset - 160 : 30, // Calibrate vertical fitting
        scale: activeTab === 'character' ? selectedCharacter.defaultHanbokScale * (selectedHanbok.defaultScale || 1.0) : 1.0,
        rotation: 0,
        flipX: false,
        opacity: 1,
      });
      setActivePresetFit('default');
    } else if (activeTarget === 'accessory' && selectedAccessory) {
      setAccessoryTransform({
        x: 0,
        y: activeTab === 'character' ? selectedAccessory.defaultYOffset - 180 : -100, // head level
        scale: 1.0,
        rotation: 0,
        flipX: false,
        opacity: 1,
      });
    }
  };

  // Synchronize defaults on item change
  useEffect(() => {
    if (selectedHanbok) {
      setHanbokTransform((prev) => ({
        ...prev,
        scale: activeTab === 'character' ? selectedCharacter.defaultHanbokScale * (selectedHanbok.defaultScale || 1.0) : 1.0,
        y: activeTab === 'character' ? selectedHanbok.defaultYOffset - 160 : 30,
        rotation: 0,
        x: 0,
        flipX: false
      }));
    }
  }, [selectedHanbok, selectedCharacter, activeTab]);

  useEffect(() => {
    if (selectedAccessory) {
      setAccessoryTransform((prev) => ({
        ...prev,
        scale: 1.0,
        y: activeTab === 'character' ? selectedAccessory.defaultYOffset - 180 : -110,
        rotation: 0,
        x: 0,
        flipX: false
      }));
    }
  }, [selectedAccessory, selectedCharacter, activeTab]);

  // Pointer Drag Handlers on Preview Container
  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
      containerRef.current?.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStart) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      setActiveTransform((prev) => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStart) {
      setDragStart(null);
      containerRef.current?.releasePointerCapture(e.pointerId);
    }
  };

  // High-Resolution Composite PNG compiler (800x800 square format)
  const compileAndDownload = async () => {
    setIsDownloading(true);
    try {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 800; // high res width
      exportCanvas.height = 800; // High quality square post
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not create standard 2D canvas context');

      // 1. Draw Cream Background Silk Pattern
      ctx.fillStyle = '#FCF9F2';
      ctx.fillRect(0, 0, 800, 800);

      // Traditional grid lines details
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.05)';
      ctx.lineWidth = 4;
      for (let x = 0; x < 800; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 800);
        ctx.stroke();
      }
      for (let y = 0; y < 800; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(800, y);
        ctx.stroke();
      }

      // Draw traditional red/gold thin borders around image
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, 740, 740);

      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = (e) => reject(e);
        });
      };

      const serializeSVGToDataUrl = (svgElement: SVGElement): string => {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        return URL.createObjectURL(svgBlob);
      };

      // Helper function to draw transformed SVG/Image overlay
      const drawTransformLayer = async (
        elementId: string,
        transform: TransformState,
        isCustomImage: boolean = false,
        customImgElement: HTMLImageElement | null = null
      ) => {
        let overlayImg: HTMLImageElement;
        let dataUrlToRevoke: string | null = null;

        if (isCustomImage && customImgElement) {
          overlayImg = customImgElement;
        } else {
          const element = document.getElementById(elementId);
          if (!element) return;
          const svgElement = element.tagName === 'svg' ? element : element.querySelector('svg');
          if (svgElement) {
            const dataUrl = serializeSVGToDataUrl(svgElement as unknown as SVGElement);
            overlayImg = await loadImage(dataUrl);
            dataUrlToRevoke = dataUrl;
          } else {
            // Support transparent image overlays
            const imgElement = element.tagName === 'img' ? element : element.querySelector('img');
            if (imgElement) {
              overlayImg = await loadImage((imgElement as HTMLImageElement).src);
            } else {
              return;
            }
          }
        }

        ctx.save();
        
        // Translate to the customized center of the canvas
        // Canvas is 800x800, preview was custom square layout scaled by 2
        const canvasCx = 400 + (transform.x * 2);
        const canvasCy = 400 + (transform.y * 2);

        ctx.translate(canvasCx, canvasCy);
        
        // Handle rotation in radians
        ctx.rotate((transform.rotation * Math.PI) / 180);

        // Handle scaling and mirroring
        const finalScaleX = transform.scale * (transform.flipX ? -1 : 1) * 2;
        const finalScaleY = transform.scale * 2;
        ctx.scale(finalScaleX, finalScaleY);

        // Adjust Opacity
        ctx.globalAlpha = transform.opacity;

        // Circular clipping region to only show face
        if (elementId.includes('active-character')) {
          ctx.beginPath();
          ctx.arc(0, 0, 114, 0, Math.PI * 2); // Elegant slightly smaller circle radius in local coords
          ctx.clip();
        }

        // Draw image centered.
        let defaultW = 320;
        let defaultH = 320;
        if (elementId.includes('hanbok')) {
          defaultW = 320;
          defaultH = 280;
        } else if (elementId.includes('accessory')) {
          defaultW = 200;
          defaultH = 120;
        }
        
        if (elementId === 'active-character-svg') {
          // Adjust position and zoom of SVG to focus beautifully on character face
          ctx.save();
          ctx.translate(0, -32); // Shift SVG face up inside circular mask
          ctx.scale(1.35, 1.35); // Zoom in on face
          ctx.drawImage(
            overlayImg,
            -defaultW / 2,
            -defaultH / 2,
            defaultW,
            defaultH
          );
          ctx.restore();
        } else {
          ctx.drawImage(
            overlayImg,
            -defaultW / 2,
            -defaultH / 2,
            defaultW,
            defaultH
          );
        }

        ctx.restore();
        if (dataUrlToRevoke) {
          URL.revokeObjectURL(dataUrlToRevoke);
        }
      };

      // 2. Draw Base Model (Cute Character or Custom Photo)
      if (activeTab === 'character') {
        await drawTransformLayer('active-character-svg', characterTransform);
      } else if (activeTab === 'myphoto' && userPhotoUrl) {
        const userImg = await loadImage(userPhotoUrl);
        await drawTransformLayer('active-character-img', characterTransform, true, userImg);
      }

      // 3. Render Hanbok Clothing Overlay
      if (selectedHanbok) {
        await drawTransformLayer('active-hanbok-svg', hanbokTransform);
      }

      // 4. Render Accessory Hat/Pendant Overlay
      if (selectedAccessory) {
        await drawTransformLayer('active-accessory-svg', accessoryTransform);
      }

      // 5. Add custom watermark stamp text
      ctx.fillStyle = '#C82538';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('꼬마 한복 스튜디오', 710, 715);
      
      ctx.fillStyle = '#78350F';
      ctx.font = 'normal 11px monospace';
      ctx.fillText(`${new Date().getFullYear()} Playful Hanbok Dress Up`, 710, 735);

      // Trigger download
      const finalUrl = exportCanvas.toDataURL('image/png');
      const dlLink = document.createElement('a');
      dlLink.download = `Hanbok_Studio_${selectedCharacter.id}_${Date.now()}.png`;
      dlLink.href = finalUrl;
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);

    } catch (err) {
      console.error('Save synthesis failed:', err);
      alert('이미지 저장 중 오류가 발생했습니다. 권한 혹은 지원되지 않는 형식일 수 있습니다.');
    } finally {
      setIsDownloading(false)
    }
  };

  // Quick preset sizes helper to speed up fitting
  const applyPresetSize = (fit: 'snug' | 'large' | 'small' | 'tall') => {
    setActivePresetFit(fit);
    setActiveTransform((prev) => {
      let scale = prev.scale;
      let y = prev.y;
      if (fit === 'snug') { scale = 0.95; }
      else if (fit === 'large') { scale = 1.35; }
      else if (fit === 'small') { scale = 0.78; }
      else if (fit === 'tall') { y -= 15; }
      return { ...prev, scale, y };
    });
  };

  // 수학 공식 기반 자동 맞춤 (7~8등신 비율 + 카드 중앙 정렬):
  // 1) 캐릭터를 0.6배로 축소해 얼굴을 한복에 비해 작게 (등신 비율 개선)
  // 2) 턱 위치에 한복 목선을 정렬
  // 3) 머리 꼭대기/이마 기준으로 장신구를 머리 폭에 비례해 배치
  // 4) 전체 구성(머리~한복단)을 계산해 carY를 역산 → 카드 중앙에 자동 배치
  const applySmartFitting = () => {
    setActivePresetFit('smart');

    const s = 0.6; // 캐릭터(얼굴) 축소 배율
    const { headTopOffset, headRadius } = selectedCharacter;
    const headRadiusEff = headRadius * s; // 축소 후 머리 반지름

    // 한복은 자체 비율만 사용(얼굴이 작아졌으므로 캐릭터 배수 제거 + 카드폭 안에 들어오게 0.85)
    const sH = selectedHanbok ? (selectedHanbok.defaultScale || 1.0) * 0.85 : 1.0;
    const necklineFromTop = selectedHanbok ? (selectedHanbok.necklineFromTop ?? 30) : 30;

    const accId = selectedAccessory?.id;
    const hasHat = accId === 'gat_hat' || accId === 'jokduri_crown' || accId === 'baessi_daenggi';

    // charY 기준 상대 좌표로 전체 구성의 위/아래 끝을 구해 중앙 정렬
    const relTop = headTopOffset * s - (hasHat ? 55 : 12); // 모자 헤드룸 확보
    const chinRel = 120 * s; // 턱
    const relBottom = selectedHanbok
      ? chinRel + (280 - necklineFromTop) * sH // 한복 단(밑단)
      : chinRel + 20;
    const charY = -Math.round((relTop + relBottom) / 2);

    setCharacterTransform({ x: 0, y: charY, scale: s, rotation: 0, flipX: false, opacity: 1 });

    const chinY = charY + chinRel;
    const headTopY = charY + headTopOffset * s;

    if (selectedHanbok) {
      // 턱(chinY)에 목선이 닿도록: hanbokCenter = chinY + (140 - necklineFromTop)*sH
      const hanbokY = chinY + (140 - necklineFromTop) * sH;
      setHanbokTransform({ x: 0, y: hanbokY, scale: sH, rotation: 0, flipX: false, opacity: 1 });
    }

    if (selectedAccessory) {
      let accX = 0;
      let accY = 0;
      let accScale = 1.0;

      if (accId === 'gat_hat') {
        // 갓 챙(폭 170)을 머리보다 살짝 넓게, 챙 하단을 머리 꼭대기에 얹음
        accScale = ((headRadiusEff * 2) / 170) * 1.15;
        accY = headTopY - 43 * accScale + 8;

      } else if (accId === 'jokduri_crown') {
        // 족두리(폭 64)는 머리보다 좁게, 하단을 머리 꼭대기에 얹음
        accScale = ((headRadiusEff * 2) / 64) * 0.55;
        accY = headTopY - 25 * accScale + 6;

      } else if (accId === 'baessi_daenggi') {
        // 배씨댕기(폭 120)는 이마(머리 꼭대기+반지름 50%) 위에 배치
        accScale = ((headRadiusEff * 2) / 120) * 0.9;
        accY = headTopY + headRadiusEff * 0.5;

      } else if (accId === 'daenggi_ribbon') {
        // 댕기는 머리 옆에서 아래로 늘어짐
        accX = headRadiusEff * 0.7;
        accY = headTopY + headRadiusEff;
        accScale = 0.6;

      } else if (accId === 'norigae_pendant') {
        // 노리개는 가슴 앞 옷고름 위치
        accX = 18;
        accY = chinY + 70 * sH;
        accScale = 0.5;

      } else {
        accY = headTopY;
        accScale = 0.7;
      }

      setAccessoryTransform({ x: accX, y: accY, scale: accScale, rotation: 0, flipX: false, opacity: 1 });
    }
  };

  // Micro adjustments helper for touch-friendly taps
  const adjustValue = (type: 'x' | 'y' | 'scale' | 'rotation' | 'opacity', step: number) => {
    setActiveTransform((prev) => {
      let val = prev[type];
      if (type === 'scale') {
        val = Math.max(0.4, Math.min(2.0, Number((val + step).toFixed(2))));
      } else if (type === 'opacity') {
        val = Math.max(0.1, Math.min(1.0, Number((val + step).toFixed(2))));
      } else if (type === 'rotation') {
        val = Math.max(-180, Math.min(180, val + step));
      } else if (type === 'y') {
        val = Math.max(-150, Math.min(220, val + step));
      } else {
        val = Math.max(-150, Math.min(150, val + step));
      }
      return { ...prev, [type]: val };
    });
  };

  const renderSlidersConsole = (transparent = false) => (
    <div className="flex flex-col gap-3">
      {/* Target toggle layers selector */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
        <button
          id="btn-target-character"
          onClick={() => setActiveTarget('character')}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-sans font-medium transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTarget === 'character'
              ? 'bg-white text-emerald-950 font-semibold shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <Palette className="w-3 h-3 text-emerald-600" />
          1단계: 캐릭터
        </button>
        <button
          id="btn-target-hanbok"
          onClick={() => setActiveTarget('hanbok')}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-sans font-medium transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTarget === 'hanbok'
              ? 'bg-white text-rose-950 font-semibold shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <Layers className="w-3 h-3 text-rose-700" />
          2단계: 한복 옷
        </button>
        <button
          id="btn-target-accessory"
          onClick={() => setActiveTarget('accessory')}
          disabled={!selectedAccessory}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-sans font-medium transition-all flex items-center justify-center gap-1 cursor-pointer ${
            !selectedAccessory ? 'opacity-40 cursor-not-allowed' : ''
          } ${
            activeTarget === 'accessory'
              ? 'bg-white text-blue-950 font-semibold shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <Sparkles className="w-3 h-3 text-blue-700" />
          3단계: 장신구
        </button>
      </div>

      {/* Individual Sliders Calibration Console */}
      <div className={`flex flex-col gap-3 p-3.5 border rounded-2xl ${
        transparent 
          ? 'bg-transparent border-transparent shadow-none' 
          : 'bg-stone-50/70 border-stone-200/60 shadow-sm'
      }`}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-stone-800">
            {activeTarget === 'character' 
              ? '캐릭터/사진 배치 미세조정' 
              : activeTarget === 'hanbok' 
                ? '한복 의상 미세 레이아웃' 
                : '장신구 미세 레이아웃'}
          </span>
          <button
            onClick={resetTransform}
            className="text-[10px] px-2 py-1 border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 rounded-md transition-all flex items-center gap-1"
          >
            <RefreshCw className="w-2.5 h-2.5" /> 초기화
          </button>
        </div>

        {/* A. X offset */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-sans text-stone-600">
            <span>좌/우 위치 조정</span>
            <span className="font-mono text-stone-900">{activeTransform.x}px</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustValue('x', -5)}
              className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 hover:border-stone-300 font-bold text-xs shadow-sm transition-all select-none active:scale-95"
            >
              -
            </button>
            <input
              type="range"
              min="-150"
              max="150"
              value={activeTransform.x}
              onChange={(e) =>
                setActiveTransform((prev) => ({ ...prev, x: parseInt(e.target.value) }))
              }
              className="flex-1 accent-rose-600 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
            />
            <button
              onClick={() => adjustValue('x', 5)}
              className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 hover:border-stone-300 font-bold text-xs shadow-sm transition-all select-none active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* B. Y offset */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-sans text-stone-600">
            <span>상/하 위치 조정</span>
            <span className="font-mono text-stone-900">{activeTransform.y}px</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustValue('y', -5)}
              className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 hover:border-stone-300 font-bold text-xs shadow-sm transition-all select-none active:scale-95"
            >
              -
            </button>
            <input
              type="range"
              min="-150"
              max="220"
              value={activeTransform.y}
              onChange={(e) =>
                setActiveTransform((prev) => ({ ...prev, y: parseInt(e.target.value) }))
              }
              className="flex-1 accent-rose-600 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
            />
            <button
              onClick={() => adjustValue('y', 5)}
              className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 hover:border-stone-300 font-bold text-xs shadow-sm transition-all select-none active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* C. Scale sizing */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-sans text-stone-600">
            <span>크기 조절</span>
            <span className="font-mono text-stone-900">{(activeTransform.scale * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustValue('scale', -0.05)}
              className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 hover:border-stone-300 font-bold text-xs shadow-sm transition-all select-none active:scale-95"
            >
              -
            </button>
            <input
              type="range"
              min="0.4"
              max="2.0"
              step="0.02"
              value={activeTransform.scale}
              onChange={(e) =>
                setActiveTransform((prev) => ({ ...prev, scale: parseFloat(e.target.value) }))
              }
              className="flex-1 accent-rose-600 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
            />
            <button
              onClick={() => adjustValue('scale', 0.05)}
              className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 hover:border-stone-300 font-bold text-xs shadow-sm transition-all select-none active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* D. Rotation angle */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-sans text-stone-600">
            <span>회전 각도</span>
            <span className="font-mono text-stone-900">{activeTransform.rotation}°</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustValue('rotation', -5)}
              className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 hover:border-stone-300 font-bold text-xs shadow-sm transition-all select-none active:scale-95"
            >
              -
            </button>
            <input
              type="range"
              min="-180"
              max="180"
              value={activeTransform.rotation}
              onChange={(e) =>
                setActiveTransform((prev) => ({ ...prev, rotation: parseInt(e.target.value) }))
              }
              className="flex-1 accent-rose-600 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
            />
            <button
              onClick={() => adjustValue('rotation', 5)}
              className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 hover:border-stone-300 font-bold text-xs shadow-sm transition-all select-none active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* E. Opacity layer */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-sans text-stone-600">
            <span>투명도 조절</span>
            <span className="font-mono text-stone-900">{(activeTransform.opacity * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustValue('opacity', -0.05)}
              className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 hover:border-stone-300 font-bold text-xs shadow-sm transition-all select-none active:scale-95"
            >
              -
            </button>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={activeTransform.opacity}
              onChange={(e) =>
                setActiveTransform((prev) => ({ ...prev, opacity: parseFloat(e.target.value) }))
              }
              className="flex-1 accent-rose-600 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
            />
            <button
              onClick={() => adjustValue('opacity', 0.05)}
              className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 hover:border-stone-300 font-bold text-xs shadow-sm transition-all select-none active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Mirror/Flip element toggle button */}
        <div className="flex items-center justify-between pt-1 text-[11px] font-sans text-stone-600 border-t border-stone-200/50">
          <span>좌우 대칭 반전</span>
          <button
            id="btn-flip-element"
            onClick={() => setActiveTransform((prev) => ({ ...prev, flipX: !prev.flipX }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              activeTransform.flipX
                ? 'bg-rose-50 border-rose-200 text-rose-700 font-semibold'
                : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            {activeTransform.flipX ? '반전 켜짐' : '반전 하기'}
          </button>
        </div>
      </div>

      {/* AI 실사 화보 세부옵션 (미세조정 바로 아래) */}
      {showAiPanel && renderAiOptions()}
    </div>
  );

  const renderSaveButton = () => (
    <div className="flex flex-col gap-2.5">
      <button
        id="btn-save-creation"
        onClick={compileAndDownload}
        disabled={isDownloading || (!selectedHanbok && !selectedAccessory)}
        className={`w-full py-3.5 px-4 rounded-2xl font-sans text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md ${
          isDownloading || (!selectedHanbok && !selectedAccessory)
            ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white active:scale-95 cursor-pointer'
        }`}
      >
        {isDownloading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
            추억 기록 합성 중...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            한복 사진으로 소장하기
          </>
        )}
      </button>

      {/* Sparks-trigger AI Wear realistic generation */}
      <button
        id="btn-ai-portrait-studio"
        onClick={() => {
          setAiImageUrl(null);
          setAiCommentary('');
          setAiError(null);
          setShowAiPanel(true);
          setShowAdjustPanel(true);
          setMobileSubTab('adjust');
        }}
        className="w-full py-3.5 px-4 rounded-2xl font-sans text-sm font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white shadow-md active:scale-95 flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-400/20"
      >
        <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
        AI로 입어보기 (실사 화보 그리기)
      </button>

      <p className="text-[10px] text-center text-stone-500 font-sans leading-relaxed">
        고른 옷을 캔버스 위 수동 합성하여 PNG로 내려받거나, <strong>AI 화보관</strong>에서 실사형 고품격 한복 착장 이미지를 즉시 그려내 소장(무료)하세요!
      </p>
    </div>
  );

  // AI 실사 화보 세부옵션 패널 (미세조정 아래 인라인 표시)
  const renderAiOptions = () => (
    <div className="flex flex-col gap-3 p-3.5 border border-amber-200 rounded-2xl bg-amber-50/60 shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          AI 실사 화보 세부 설정
        </span>
        <button
          onClick={() => setShowAiPanel(false)}
          className="text-[10px] px-2 py-1 border border-amber-200 bg-white hover:bg-amber-50 text-amber-700 rounded-md transition-all flex items-center gap-1"
        >
          <X className="w-2.5 h-2.5" /> 닫기
        </button>
      </div>

      {/* 배경 테마 */}
      <div>
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider select-none">🏞️ 배경 테마</span>
        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
          {[
            { id: 'palace', name: '🏰 궁궐 앞뜰' },
            { id: 'garden', name: '🌸 매화 정원' },
            { id: 'night', name: '🏮 은은한 야경' },
            { id: 'studio', name: '📸 전통 스튜디오' },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => setConceptStyle(style.id as any)}
              className={`py-1.5 px-2 rounded-lg border text-[11px] font-sans font-semibold transition-all cursor-pointer text-center ${
                conceptStyle === style.id
                  ? 'bg-amber-900 text-amber-50 border-amber-900 shadow'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* 구도 */}
      <div>
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider select-none">📐 화보 구도</span>
        <div className="flex gap-1.5 mt-1.5">
          {[
            { id: 'full', name: '전신' },
            { id: 'half', name: '상반신' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFraming(f.id)}
              className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-sans font-semibold transition-all cursor-pointer text-center ${
                framing === f.id
                  ? 'bg-amber-900 text-amber-50 border-amber-900 shadow'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* 비율 */}
      <div>
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider select-none">🖼️ 크기 비율</span>
        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
          {[
            { id: '1:1', name: '정사각형 (1:1)' },
            { id: '3:4', name: '세로형 (3:4)' },
            { id: '9:16', name: '스마트폰 (9:16)' },
            { id: '4:3', name: '가로형 (4:3)' },
          ].map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => setAspectRatio(ratio.id)}
              className={`py-1.5 px-2 rounded-lg border text-[11px] font-sans font-semibold transition-all cursor-pointer text-center ${
                aspectRatio === ratio.id
                  ? 'bg-amber-900 text-amber-50 border-amber-900 shadow'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              {ratio.name}
            </button>
          ))}
        </div>
      </div>

      {/* 해상도 */}
      <div>
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider select-none">✨ 이미지 해상도</span>
        <div className="flex gap-1.5 mt-1.5">
          {[
            { id: '512px', name: '512px' },
            { id: '1K', name: '1K' },
            { id: '2K', name: '2K' },
          ].map((sz) => (
            <button
              key={sz.id}
              onClick={() => setImageSize(sz.id)}
              className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-sans font-semibold transition-all cursor-pointer text-center ${
                imageSize === sz.id
                  ? 'bg-amber-900 text-amber-50 border-amber-900 shadow'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              {sz.name}
            </button>
          ))}
        </div>
      </div>

      {/* 생성 버튼 */}
      <button
        onClick={generateAiPortrait}
        disabled={isAiGenerating}
        className={`w-full py-3 rounded-xl text-xs font-sans font-bold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border ${
          isAiGenerating
            ? 'bg-amber-100 text-amber-800 border-amber-200 cursor-wait'
            : 'bg-amber-900 hover:bg-amber-950 text-amber-50 border-amber-950 active:scale-95'
        }`}
      >
        {isAiGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-amber-800" />
            붓자국을 누비는 중...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            실사 한복 화보 그리기 (무료)
          </>
        )}
      </button>
      <p className="text-[10px] text-center text-stone-500 font-sans leading-relaxed">
        생성하면 위 한복 입히기 카드의 그림이 선택한 세부설정의 AI 실사 화보로 바뀝니다.
      </p>
    </div>
  );

  return (
    <>
      <div className={`flex flex-col lg:flex-row w-full items-stretch transition-all duration-300 ${showAdjustPanel ? 'gap-6' : 'gap-0'}`}>
      {/* LEFT: Live Interactive SVG staging viewport */}
      <div className="flex-1 flex flex-col items-center">
        
        {/* Stage & Adjust Row (Desktop: Side-by-side, Mobile: Vertical) */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 w-full max-w-full lg:max-w-[800px]">
          
          {/* Left Block: Stage Card + Underneath controls */}
          <div className="flex flex-col items-center w-full max-w-[340px] md:max-w-[380px] flex-shrink-0">
            {/* Active Stage Container Box */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative w-full border border-stone-200 rounded-3xl bg-[#FCF9F2] shadow-md overflow-hidden cursor-move touch-none select-none" style={{ aspectRatio: '3/4' }}
            >
              {/* Aesthetic background patterns */}
              <TraditionalGrid />
              <FloatingCloud className="absolute top-6 left-6 w-16" />
              <FloatingCloud className="absolute bottom-8 right-6 w-20" />

              {/* Model Container Layer wrapper */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative w-full h-full flex items-center justify-center">
                  
                  {/* Layer 1: Base Template */}
                  <div
                    onPointerDown={() => { setActiveTarget('character'); setShowAdjustPanel(true); setMobileSubTab('adjust'); }}
                    className="absolute pointer-events-auto cursor-move transition-all duration-75 flex items-center justify-center rounded-full overflow-hidden"
                    style={{
                      width: '240px',
                      height: '240px',
                      zIndex: 20, // 얼굴 클릭 우선
                      transform: `translate(${characterTransform.x}px, ${characterTransform.y}px) rotate(${characterTransform.rotation}deg) scale(${characterTransform.scale * (characterTransform.flipX ? -1 : 1)}, ${characterTransform.scale})`,
                      opacity: characterTransform.opacity,
                      outline: activeTarget === 'character' ? '2px dashed #10B981' : 'none',
                      outlineOffset: '4px',
                    }}
                  >
                    {activeTab === 'character' ? (
                      <div id="active-character-svg" className="w-[240px] h-[240px] flex items-center justify-center relative bg-transparent rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 w-[240px] h-[270px] -mt-[24px] scale-[1.38] origin-top flex items-center justify-center">
                          {selectedCharacter.render()}
                        </div>
                      </div>
                    ) : userPhotoUrl ? (
                      <div className="w-[240px] h-[240px] rounded-full overflow-hidden bg-transparent flex items-center justify-center relative">
                        <img
                          id="active-character-img"
                          src={userPhotoUrl}
                          alt="Custom model upload"
                          className="w-full h-full object-cover max-w-full max-h-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="text-center p-6 text-stone-400">
                        <EyeOff className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-xs font-sans">촬영 완료된 사진이 없습니다.</p>
                      </div>
                    )}
                  </div>

                  {/* Layer 2: Hanbok Active Overlay */}
                  {selectedHanbok && (
                    <div
                      onPointerDown={() => { setActiveTarget('hanbok'); setShowAdjustPanel(true); setMobileSubTab('adjust'); }}
                      className="absolute pointer-events-auto cursor-move transition-all duration-75 flex items-center justify-center"
                      style={{
                        width: '320px',
                        height: '280px',
                        zIndex: 10, // 한복은 배경(클릭 우선순위 낮음)
                        transform: `translate(${hanbokTransform.x}px, ${hanbokTransform.y}px) rotate(${hanbokTransform.rotation}deg) scale(${hanbokTransform.scale * (hanbokTransform.flipX ? -1 : 1)}, ${hanbokTransform.scale})`,
                        opacity: hanbokTransform.opacity,
                        outline: activeTarget === 'hanbok' ? '2px dashed #DC2626' : 'none',
                        outlineOffset: '-24px',
                      }}
                    >
                      <div className="hidden">
                        <div id="active-hanbok-svg">
                          {selectedHanbok.render(1, dyeColor)}
                        </div>
                      </div>
                      {selectedHanbok.render(1, dyeColor)}
                    </div>
                  )}

                  {/* Layer 3: Accessory Active Overlay */}
                  {selectedAccessory && (
                    <div
                      onPointerDown={() => { setActiveTarget('accessory'); setShowAdjustPanel(true); setMobileSubTab('adjust'); }}
                      className="absolute pointer-events-auto cursor-move transition-all duration-75 flex items-center justify-center"
                      style={{
                        width: '200px',
                        height: '120px',
                        zIndex: 30, // 장신구(모자) 최상위 클릭 우선
                        transform: `translate(${accessoryTransform.x}px, ${accessoryTransform.y}px) rotate(${accessoryTransform.rotation}deg) scale(${accessoryTransform.scale * (accessoryTransform.flipX ? -1 : 1)}, ${accessoryTransform.scale})`,
                        opacity: accessoryTransform.opacity,
                        outline: activeTarget === 'accessory' ? '2px dashed #1D4ED8' : 'none',
                        outlineOffset: '-2px',
                      }}
                    >
                      <div className="hidden">
                        <div id="active-accessory-svg">
                          {selectedAccessory.render(1)}
                        </div>
                      </div>
                      {selectedAccessory.render(1)}
                    </div>
                  )}

                </div>
              </div>

              {/* Quick Indicator tag on the top of stage */}
              <div className="absolute top-4 right-4 bg-stone-900/40 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-mono">
                {activeTab === 'character' ? selectedCharacter.name : '나의 사진'}
              </div>

              <div className="absolute bottom-4 left-4 flex gap-1 z-10">
                <span className="text-[10px] font-sans font-medium text-stone-500 bg-white/85 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Move className="w-3 h-3" />
                  {activeTarget === 'character' 
                    ? '캐릭터/사진 위치 드래그가능' 
                    : activeTarget === 'hanbok'
                      ? '한복 위치 드래그가능'
                      : '장신구 위치 드래그가능'}
                </span>
              </div>

              {/* AI 실사 화보 결과/로딩 오버레이 (기존 그림을 덮어 카드 안에 표시) */}
              {(isAiGenerating || aiImageUrl || aiError) && (
                <div className="absolute inset-0 z-40 bg-[#FCF9F2] flex flex-col items-center justify-center p-3 text-center">
                  {isAiGenerating ? (
                    <>
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-amber-200/50 animate-ping" />
                        <div className="absolute inset-0 rounded-full border-t-4 border-amber-800 animate-spin" />
                        <span className="text-2xl animate-bounce">🖌️</span>
                      </div>
                      <p className="text-[11px] text-stone-600 font-sans leading-relaxed mt-4 px-2">
                        선택한 세부설정으로 실사 한복 화보를 그리는 중입니다... (3~7초)
                      </p>
                    </>
                  ) : aiError ? (
                    <>
                      <span className="text-3xl select-none">🏮</span>
                      <h4 className="font-sans font-bold text-rose-950 mt-2 text-sm">생성 오류</h4>
                      <p className="text-[11px] text-rose-800 leading-relaxed font-sans mt-1.5 px-2 max-h-[120px] overflow-y-auto">
                        {aiError}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={generateAiPortrait}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-semibold font-sans transition-all active:scale-95 cursor-pointer"
                        >
                          다시 시도
                        </button>
                        <button
                          onClick={() => { setAiError(null); }}
                          className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-lg text-[11px] font-semibold font-sans transition-all active:scale-95 cursor-pointer"
                        >
                          편집으로 돌아가기
                        </button>
                      </div>
                    </>
                  ) : aiImageUrl ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2.5">
                      <img
                        src={aiImageUrl}
                        alt="AI 한복 실사 화보"
                        className="max-w-full max-h-[calc(100%-46px)] object-contain rounded-xl shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                      {aiCommentary && (
                        <p className="text-[10px] text-stone-600 font-sans italic leading-snug line-clamp-2 px-2">
                          &ldquo;{aiCommentary}&rdquo;
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={downloadAiPortrait}
                          className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 text-white rounded-lg text-[11px] font-bold font-sans flex items-center gap-1 transition-all shadow active:scale-95 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> 화보 저장
                        </button>
                        <button
                          onClick={() => { setAiImageUrl(null); setAiCommentary(''); }}
                          className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-lg text-[11px] font-semibold font-sans transition-all active:scale-95 cursor-pointer"
                        >
                          편집으로 돌아가기
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Quick fitting buttons */}
            {selectedHanbok && (
              <div className="flex gap-1.5 mt-3 select-none flex-wrap justify-center items-center w-full">
                <button
                  onClick={() => applyPresetSize('small')}
                  className={`text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                    activePresetFit === 'small' ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  상체 작게 
                </button>
                <button
                  onClick={() => applyPresetSize('snug')}
                  className={`text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                    activePresetFit === 'snug' ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  어깨에 딱 맞춤
                </button>
                <button
                  onClick={() => applyPresetSize('large')}
                  className={`text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                    activePresetFit === 'large' ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  상체 크게
                </button>
                <button
                  onClick={() => applyPresetSize('tall')}
                  className="text-[10px] px-2 py-1 bg-white hover:bg-stone-50 text-stone-700 border rounded-lg transition-all cursor-pointer"
                >
                  옷 올리기 ↑
                </button>
                <button
                  onClick={applySmartFitting}
                  className={`text-[10px] px-2 py-1 rounded-lg border font-semibold shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-0.5 ${
                    activePresetFit === 'smart' 
                      ? 'bg-gradient-to-r from-amber-700 to-rose-700 text-white border-amber-800' 
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                  }`}
                >
                  알아서 잘 입히기 ✨
                </button>
                <button
                  onClick={() => {
                    setShowAdjustPanel(!showAdjustPanel);
                    if (mobileSubTab !== 'adjust') {
                      setMobileSubTab('adjust');
                    }
                  }}
                  className={`text-[10px] px-2 py-1 rounded-lg border font-semibold shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-0.5 ${
                    showAdjustPanel 
                      ? 'bg-emerald-800 text-emerald-50 border-emerald-950 font-bold shadow-sm' 
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                  }`}
                >
                  위치 조절 ⚙️
                </button>
              </div>
            )}

            {/* DESKTOP SAVE BUTTON (always aligned under stage card) */}
            <div className="hidden lg:block w-full mt-4 pt-4 border-t border-stone-200/40">
              {renderSaveButton()}
            </div>
          </div>

          {/* RIGHT: DESKTOP ADJUSTMENT CONSOLE (Side-by-side with exact same height & transparent bg) */}
          <AnimatePresence initial={false}>
            {showAdjustPanel && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="hidden lg:flex flex-col h-[340px] md:h-[380px] w-[330px] overflow-y-auto px-1 flex-shrink-0 scrollbar-none"
              >
                {renderSlidersConsole(true)}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* MOBILE CONTROL LAYOUT SYSTEM: Render tabbed panel under viewport (<lg: hidden) */}
        <div className="lg:hidden w-full flex flex-col gap-3.5 mt-5">
          <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200 shadow-sm">
            <button
              onClick={() => setMobileSubTab('wardrobe')}
              className={`flex-1 py-2 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all ${
                mobileSubTab === 'wardrobe' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-600 font-semibold'
              }`}
            >
              <Palette className="w-4 h-4 text-rose-600" />
              한복 옷장
            </button>
            <button
              onClick={() => setMobileSubTab('adjust')}
              className={`flex-1 py-2 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all ${
                mobileSubTab === 'adjust' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-600 font-semibold'
              }`}
            >
              <Move className="w-4 h-4 text-emerald-600" />
              위치 조절
            </button>
            <button
              onClick={() => setMobileSubTab('save')}
              className={`flex-1 py-2 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all ${
                mobileSubTab === 'save' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-600 font-semibold'
              }`}
            >
              <Download className="w-4 h-4 text-blue-600" />
              사진 소장
            </button>
          </div>

          <div className="bg-white border border-stone-200/80 p-4 rounded-3xl shadow-sm">
            {mobileSubTab === 'wardrobe' && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block mb-1">
                  아래에서 한복 의상과 장신구를 탭하여 옷을 갈아입혀 보세요
                </span>
                {wardrobeNode}
              </div>
            )}
            {mobileSubTab === 'adjust' && (
              <div className="flex flex-col gap-2">
                {renderSlidersConsole()}
              </div>
            )}
            {mobileSubTab === 'save' && (
              <div className="flex flex-col gap-4">
                <div className="border-b border-rose-100/60 pb-2">
                  <h3 className="text-xs font-bold text-stone-800">합성된 한복 사진 내려받기</h3>
                  <p className="text-[10px] text-stone-500 mt-1 leading-relaxed">
                    예쁜 나만의 스타일 아바타 꾸미기를 완료했다면 아래 버튼을 눌러 고화질 정사각 이미지로 기기 저장하세요!
                  </p>
                </div>
                {renderSaveButton()}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>

  </>
);
};
