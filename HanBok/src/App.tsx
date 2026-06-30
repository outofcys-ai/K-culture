import React, { useState } from 'react';
import { CHARACTERS } from './data/characters';
import { HANBOKS, ACCESSORIES } from './data/hanboks';
import { ActiveTab, Character, HanbokItem, TransformState } from './types';
import { EditorCanvas } from './components/EditorCanvas';
import { HanbokSelector } from './components/HanbokSelector';
import { CameraCapture } from './components/CameraCapture';
import { DancheongBorder, HanjiCardFrame } from './components/KoreanPattern';
import { motion, AnimatePresence } from 'motion/react';
import { Rabbit, Camera, Palette, Sparkles, BookOpen, Heart, RefreshCw, Upload, Eye } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('character');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [selectedHanbok, setSelectedHanbok] = useState<HanbokItem | null>(HANBOKS[0]);
  const [selectedAccessory, setSelectedAccessory] = useState<HanbokItem | null>(ACCESSORIES[1]); // Default Jokduri
  const [dyeColor, setDyeColor] = useState<string>('#BE123C'); // Default royal crimson
  const [showPhotoUtility, setShowPhotoUtility] = useState<boolean>(false);
  const [showAdjustPanel, setShowAdjustPanel] = useState<boolean>(false);

  // Layout transform parameters
  const [characterTransform, setCharacterTransform] = useState<TransformState>({
    x: 0,
    y: 45, // default vertical offset on high aspect canvas
    scale: 1.0,
    rotation: 0,
    flipX: false,
    opacity: 1,
  });

  const [hanbokTransform, setHanbokTransform] = useState<TransformState>({
    x: 0,
    y: selectedCharacter.defaultHanbokYOffset - 160, // alignment pivot
    scale: selectedCharacter.defaultHanbokScale * (selectedHanbok?.defaultScale || 1.0),
    rotation: 0,
    flipX: false,
    opacity: 1,
  });

  const [accessoryTransform, setAccessoryTransform] = useState<TransformState>({
    x: 0,
    y: ACCESSORIES[1].defaultYOffset - 180, // head level
    scale: 0.9,
    rotation: 0,
    flipX: false,
    opacity: 1,
  });

  const handleSelectCharacter = (char: Character) => {
    setSelectedCharacter(char);
    // Reset or adjust components
    setCharacterTransform({
      x: 0,
      y: 45,
      scale: 1.0,
      rotation: 0,
      flipX: false,
      opacity: 1,
    });
    if (selectedHanbok) {
      setHanbokTransform((prev) => ({
        ...prev,
        scale: char.defaultHanbokScale * (selectedHanbok.defaultScale || 1.0),
        y: selectedHanbok.defaultYOffset - 160,
        x: 0,
        rotation: 0,
      }));
    }
  };

  const handlePhotoSelected = (dataUrl: string) => {
    setUserPhotoUrl(dataUrl);
    setShowPhotoUtility(false);
    // Switch to photo tab
    setActiveTab('myphoto');
    // Align Hanbok snug for photo mode
    if (selectedHanbok) {
      setHanbokTransform({
        x: 0,
        y: 20, // default overlay fitting on photo
        scale: 1.0,
        rotation: 0,
        flipX: false,
        opacity: 0.95, // slight transparency looks stunning on human photo blends
      });
    }
  };

  const handleResetAllOutfit = () => {
    setSelectedHanbok(null);
    setSelectedAccessory(null);
    setDyeColor('#BE123C');
  };

  return (
    <div id="main-frame" className="h-screen overflow-hidden bg-[#FDFBF7] flex flex-col selection:bg-rose-100">
      
      {/* 1. Traditional Dancheong top border */}
      <DancheongBorder />

      {/* Main Core View Area */}
      <main className={`flex-1 min-h-0 overflow-y-auto w-full mx-auto px-4 py-3 md:py-4 flex flex-col gap-4 transition-all duration-300 ${showAdjustPanel ? 'max-w-7xl' : 'max-w-6xl'}`}>
        
        {/* Navigation & Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none">🏮</span>
            <div>
              <h1 className="font-sans font-bold text-2xl md:text-3xl text-stone-900 tracking-tight">
                꼬마 한복 스튜디오
              </h1>
              <p className="text-xs md:text-sm text-stone-600 font-sans mt-0.5">
                가상 귀요미 캐릭터나 직접 찍은 본인의 얼굴 위에 단아한 우리 옷 한복을 곱게 입혀보세요.
              </p>
            </div>
          </div>
          
          {/* Quick guide popover detail */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-900 font-sans font-medium">추석/설날 명절 기념 카드 제작소</span>
          </div>
        </header>

        {/* Studio Tabs Navigation */}
        <div className="flex justify-between flex-col sm:flex-row gap-3">
          <div className="flex bg-stone-100 p-1 rounded-xl sm:rounded-2xl border border-stone-200 w-full sm:w-auto">
            <button
              id="tab-btn-character"
              onClick={() => {
                setActiveTab('character');
                setShowPhotoUtility(false);
              }}
              className={`flex-1 sm:flex-none px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-sans font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'character' && !showPhotoUtility
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Rabbit className="w-3.5 h-3.5" />
              가상 캐릭터 꾸미기
            </button>
            <button
              id="tab-btn-photo"
              onClick={() => {
                if (userPhotoUrl) {
                  setActiveTab('myphoto');
                  setShowPhotoUtility(false);
                } else {
                  setShowPhotoUtility(true);
                }
              }}
              className={`flex-1 sm:flex-none px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-sans font-semibold transition-all flex items-center justify-center gap-1.5 ${
                (activeTab === 'myphoto' || showPhotoUtility)
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              직접 얼굴 사진 촬영/합성하기
            </button>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleResetAllOutfit}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-stone-600 bg-stone-50 hover:bg-stone-100 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-medium border border-stone-200 transition-all flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              의상 벗기기 (초기화)
            </button>
          </div>
        </div>

        {/* Dynamic Studio Stage Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: Main viewport interactive Stage */}
          <section className={`${showAdjustPanel ? 'lg:col-span-8' : 'lg:col-span-7'} flex flex-col gap-4 transition-all duration-300`}>
            
            <HanjiCardFrame>
              <AnimatePresence mode="wait">
                {showPhotoUtility ? (
                  // Active Camera streaming/dragging module template
                  <motion.div
                    key="camera-module"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="min-h-[380px] flex flex-col justify-between"
                  >
                    <CameraCapture
                      onPhotoSelected={handlePhotoSelected}
                      onClose={() => {
                        setShowPhotoUtility(false);
                        if (userPhotoUrl) {
                          setActiveTab('myphoto');
                        } else {
                          setActiveTab('character');
                        }
                      }}
                    />
                  </motion.div>
                ) : (
                  // General canvas dressing studio
                  <motion.div
                    key="canvas-studio"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-5"
                  >
                    
                    {/* Character Switch Bar: Rendered only when Character tab is active */}
                    {activeTab === 'character' && (
                      <div className="flex flex-col gap-2 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/50">
                        <span className="text-[11px] font-sans font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 select-none">
                          <Palette className="w-3.5 h-3.5 text-rose-600" />
                          캐릭터 모델 선택
                        </span>
                        
                        <div className="grid grid-cols-3 gap-2">
                          {CHARACTERS.map((char) => {
                            const isCharSelected = selectedCharacter.id === char.id;
                            return (
                              <button
                                key={char.id}
                                id={`char-select-${char.id}`}
                                onClick={() => handleSelectCharacter(char)}
                                className={`px-3 py-2 rounded-xl text-left border transition-all flex items-center gap-2 select-none ${
                                  isCharSelected
                                    ? 'bg-rose-50/80 border-rose-600 text-rose-950 font-semibold ring-1 ring-rose-100'
                                    : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                                }`}
                              >
                                <span className="text-xl">{char.avatar}</span>
                                <div className="leading-tight overflow-hidden">
                                  <div className="text-xs font-semibold truncate font-sans">{char.name}</div>
                                  <div className="text-[9px] text-stone-500 truncate font-sans hidden md:block">
                                    {char.description}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Photo Switch Bar: Rendered under photo mode */}
                    {activeTab === 'myphoto' && userPhotoUrl && (
                      <div className="flex items-center justify-between bg-stone-50/70 p-3 rounded-2xl border border-stone-200/50 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-stone-300 shadow-sm bg-stone-200">
                            <img src={userPhotoUrl} alt="Snippet" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-stone-800 font-sans block">나의 합성용 얼굴 사진</span>
                            <span className="text-[10px] text-emerald-700 font-sans flex items-center gap-0.5 leading-none mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              얼굴 실루엣 정렬 완료
                            </span>
                          </div>
                        </div>

                        <button
                          id="btn-re-upload-photo"
                          onClick={() => setShowPhotoUtility(true)}
                          className="px-3 py-1.5 text-rose-900 hover:text-rose-950 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-all border border-rose-200 flex items-center gap-1 shadow-sm"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          다른 사진 촬영/올리기
                        </button>
                      </div>
                    )}

                      {/* Primary interactive staging area */}
                      <EditorCanvas
                       activeTab={activeTab}
                       selectedCharacter={selectedCharacter}
                       userPhotoUrl={userPhotoUrl}
                       selectedHanbok={selectedHanbok}
                       selectedAccessory={selectedAccessory}
                       dyeColor={dyeColor}
                       characterTransform={characterTransform}
                       setCharacterTransform={setCharacterTransform}
                       hanbokTransform={hanbokTransform}
                       setHanbokTransform={setHanbokTransform}
                       accessoryTransform={accessoryTransform}
                       setAccessoryTransform={setAccessoryTransform}
                       showAdjustPanel={showAdjustPanel}
                       setShowAdjustPanel={setShowAdjustPanel}
                       wardrobeNode={
                         <HanbokSelector
                           selectedHanbokId={selectedHanbok ? selectedHanbok.id : null}
                           selectedAccessoryId={selectedAccessory ? selectedAccessory.id : null}
                           onSelectHanbok={setSelectedHanbok}
                           onSelectAccessory={setSelectedAccessory}
                           dyeColor={dyeColor}
                           onChangeDyeColor={setDyeColor}
                         />
                       }
                     />

                  </motion.div>
                )}
              </AnimatePresence>
            </HanjiCardFrame>
          </section>

          {/* RIGHT COLUMN: Garments wardrobe selector list */}
          <section className={`hidden lg:flex ${showAdjustPanel ? 'lg:col-span-4' : 'lg:col-span-5'} flex-col gap-4 transition-all duration-300 min-h-0 max-h-[calc(100vh-160px)]`}>

            <HanjiCardFrame className="h-full overflow-hidden">
              <div className="flex flex-col h-full justify-between gap-4 min-h-0">
                
                {/* Wardrobe Header */}
                <div className="border-b border-rose-100 pb-3">
                  <h2 className="font-sans font-bold text-lg text-stone-900 flex items-center gap-2 select-none">
                    <span>👑</span>
                    경복궁 한복 옷장 (Wardrobe)
                  </h2>
                  <p className="text-xs text-stone-600 font-sans mt-0.5 leading-relaxed">
                    전통 한복부터 로맨틱 퓨전 패밀리, 귀여운 아기 색동 한복까지 마음에 쏙 드는 고운 옷을 입혀주세요.
                  </p>
                </div>

                {/* Grid Item lists catalog */}
                <div className="flex-1 flex flex-col min-h-0">
                  <HanbokSelector
                    selectedHanbokId={selectedHanbok ? selectedHanbok.id : null}
                    selectedAccessoryId={selectedAccessory ? selectedAccessory.id : null}
                    onSelectHanbok={setSelectedHanbok}
                    onSelectAccessory={setSelectedAccessory}
                    dyeColor={dyeColor}
                    onChangeDyeColor={setDyeColor}
                  />
                </div>

                {/* Interactive Guide steps snippet */}
                <div className="mt-2 pt-3 border-t border-stone-200/60 flex items-start gap-2.5 bg-rose-50/30 p-2.5 rounded-xl border border-rose-100/60">
                  <BookOpen className="w-4 h-4 text-rose-700 mt-0.5 flex-none" />
                  <div className="leading-tight">
                    <span className="text-[11px] font-bold text-stone-800 font-sans block">예쁘게 얼굴 합성하는 비결!</span>
                    <span className="text-[10px] text-stone-600 font-sans leading-normal block mt-1">
                      1. 우측 옷장에서 한복과 모자 장신구를 먼저 선택합니다.<br/>
                      2. 왼쪽 가로세로 조절 슬라이더로 크기와 상하 위치를 조절합니다.<br/>
                      3. 마우스로 한복을 잡고 슬그머니 끌고 가 대어 맞추면 최고로 자연스럽습니다!
                    </span>
                  </div>
                </div>

              </div>
            </HanjiCardFrame>
          </section>

        </div>

      </main>

    </div>
  );
}
