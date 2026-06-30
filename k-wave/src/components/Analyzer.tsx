import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PRESET_ANALYSES } from "../data";
import { PungryuAnalysisResult, PresetContent } from "../types";
import { Sparkles, Compass, AlertCircle, FileText, Share2, HelpCircle, Loader2 } from "lucide-react";
import PungryuRadarChart from "./PungryuRadarChart";

const LOADING_STEPS = [
  "최치원의 자취를 따라 천 년의 바람 소리를 고르는 중...",
  "사물놀이의 신명과 마당놀이의 흥겨운 장단을 분석하는 중...",
  "조선 분청사기의 자연스러운 붓선과 여백의 멋을 읽어내는 중...",
  "하층민의 아픈 한(恨)을 따스한 정(情)으로 녹여내던 옛가락을 더듬는 중...",
  "서양의 일렉트로닉 비트 가닥과 한국의 민초 추임새 사이 교차점을 찾는 중..."
];

export default function Analyzer() {
  const [selectedPreset, setSelectedPreset] = useState<string>("bts");
  const [customName, setCustomName] = useState<string>("");
  const [selectedDims, setSelectedDims] = useState<string[]>(["흥", "한과정", "멋", "융합성"]);
  const [customNotes, setCustomNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<PungryuAnalysisResult | null>(
    PRESET_ANALYSES[0].data
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Interval timer for changing loading text poetic steps
  const startLoadingCycle = () => {
    setLoadingStepIdx(0);
    const interval = setInterval(() => {
      setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2800);
    return interval;
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    setErrorMsg(null);
    const preset = PRESET_ANALYSES.find(p => p.id === presetId);
    if (preset) {
      setAnalysisResult(preset.data);
      setCustomName("");
    }
  };

  const toggleDim = (dim: string) => {
    if (selectedDims.includes(dim)) {
      if (selectedDims.length > 1) {
        setSelectedDims(selectedDims.filter(d => d !== dim));
      }
    } else {
      setSelectedDims([...selectedDims, dim]);
    }
  };

  const handleCustomAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setSelectedPreset("");
    
    const loadingInterval = startLoadingCycle();

    try {
      const response = await fetch("/api/analyze-pungryu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentName: customName.trim(),
          selectedDimensions: selectedDims,
          customNotes: customNotes.trim()
        })
      });

      const data = await response.json();
      clearInterval(loadingInterval);

      if (response.ok && data.success) {
        setAnalysisResult(data.data);
      } else {
        setErrorMsg(
          data.error || "풍류 소리를 분석하는 도중 장애가 발생했습니다. API 키 구성을 확인하시거나 제공형 프리셋을 경험해 보세요."
        );
      }
    } catch (err: any) {
      clearInterval(loadingInterval);
      setErrorMsg("서버와의 연결이 올바르지 않습니다. 프리셋 데이터를 로딩하겠습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto px-6 pb-16">
      
      {/* LEFT: Creator Workbench Form */}
      <div className="lg:col-span-5 space-y-8">
        
        {/* Curated Presets Selection */}
        <div className="bg-paper-dark border border-clay/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-clay font-bold text-sm">
            <Compass className="w-4 h-4" />
            <span className="font-serif">명작 풍류 프리셋 맛보기</span>
          </div>
          <p className="text-xs text-ink-light leading-relaxed">
            한류를 대표하는 대표적 마스터피스들의 미학적 원형을 1초 만에 확인해 보세요.
          </p>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {PRESET_ANALYSES.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  id={`preset-selector-${preset.id}`}
                  onClick={() => handleSelectPreset(preset.id)}
                  type="button"
                  className={`text-left p-3.5 rounded-xl border text-sm transition-all relative overflow-hidden group ${
                    isSelected
                      ? "bg-paper-white border-clay ring-1 ring-clay shadow-sm"
                      : "bg-paper-white/60 border-clay/10 text-ink-dark hover:bg-paper-white hover:border-clay/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-ink-black">{preset.name}</span>
                    <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded ${
                      preset.category === "music" ? "bg-clay/10 text-clay" : "bg-celadon/10 text-celadon"
                    }`}>
                      {preset.category === "music" ? "음악" : preset.category === "drama" ? "드라마" : "영화"}
                    </span>
                  </div>
                  <p className="text-xs text-ink-light leading-normal mt-1.5 line-clamp-2">
                    {preset.shortDesc}
                  </p>
                  {isSelected && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-clay" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom AI Analysis Form */}
        <form onSubmit={handleCustomAnalyze} className="bg-paper-dark border border-clay/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center space-x-2 text-clay font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span className="font-serif">실시간 커스텀 풍류 분석기</span>
          </div>
          <p className="text-xs text-ink-light leading-relaxed">
            원하는 아티스트, 곡명, 예능, 혹은 드라마를 입력하면 Gemini가 천 년 전 전통 사유의 갈래와 맞물린 풍류 지표를 그려냅니다.
          </p>

          {/* Target Content Name Input */}
          <div className="space-y-2">
            <label htmlFor="content-name-input" className="block text-xs font-serif font-bold text-ink-dark tracking-wide">
              문화 콘텐츠 명칭/대표 성정
            </label>
            <input
              id="content-name-input"
              type="text"
              required
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="예: 뉴진스 Ditto, 미스터 션샤인, 아이유..."
              className="w-full bg-paper-white border border-clay/15 rounded-xl px-4 py-3 text-sm text-ink-black placeholder-ink-light/70 focus:outline-none focus:ring-1 focus:ring-clay focus:border-clay transition-all"
            />
          </div>

          {/* Selected Focus Dimensions */}
          <div className="space-y-2">
            <label className="block text-xs font-serif font-bold text-ink-dark tracking-wide">
              분석할 풍류 차원 (중복 선택)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "흥", name: "흥 (생명력)" },
                { key: "한과정", name: "한과 정 (정서)" },
                { key: "멋", name: "멋 (진정성)" },
                { key: "융합성", name: "융합성 (종합)" }
              ].map((dim) => {
                const checked = selectedDims.includes(dim.key);
                return (
                  <button
                    key={dim.key}
                    id={`dim-checkbox-${dim.key}`}
                    type="button"
                    onClick={() => toggleDim(dim.key)}
                    className={`py-2 px-3 rounded-lg border text-xs font-serif text-center transition-all ${
                      checked
                        ? "bg-clay/10 border-clay text-clay font-bold"
                        : "bg-paper-white border-clay/10 text-ink-light hover:border-clay/20"
                    }`}
                  >
                    {dim.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Custom Notes */}
          <div className="space-y-2">
            <label htmlFor="custom-notes-input" className="block text-xs font-serif font-bold text-ink-dark tracking-wide">
              나만의 통찰 얹기 (선택)
            </label>
            <textarea
              id="custom-notes-input"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="비트에 풍물 장단이 연상되거나, 멤버 관계가 한옥처럼 조화롭다는 등의 느낌을 보태주세요."
              rows={3}
              className="w-full bg-paper-white border border-clay/15 rounded-xl p-3 text-xs text-ink-black focus:outline-none focus:ring-1 focus:ring-clay focus:border-clay transition-all resize-none"
            />
          </div>

          {/* Trigger Button */}
          <button
            id="analyze-submit-btn"
            type="submit"
            disabled={loading || !customName.trim()}
            className="w-full bg-ink-black hover:bg-clay text-paper-white font-serif font-bold py-3.5 px-4 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center space-x-2 text-sm disabled:opacity-40 disabled:hover:bg-ink-black cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-paper-white" />
                <span>풍류 짚어가는 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-clay fill-clay/20" />
                <span>AI 풍류 프로필 도출하기</span>
              </>
            )}
          </button>
        </form>

        {/* Error notification banner if api fails */}
        {errorMsg && (
          <div className="bg-clay/5 border border-clay/20 rounded-xl p-4 flex items-start space-x-3 text-ink-black animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-clay shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold font-serif text-clay block">인공지능 가락 분석 중 안내</span>
              <p className="text-xs text-ink-medium leading-relaxed">
                {errorMsg}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Dashboard Panels (Highly Stylized Visual Display) */}
      <div className="lg:col-span-7">
        <AnimatePresence mode="wait">
          {loading ? (
            /* Breathtaking Poetic Loading Terminal screen */
            <motion.div
              key="loading-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-paper-dark border border-clay/10 rounded-2xl p-10 h-full flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]"
            >
              <div className="relative flex items-center justify-center">
                {/* Simulated circle wind sweep animation */}
                <span className="absolute animate-ping w-16 h-16 bg-clay/5 rounded-full" />
                <span className="absolute animate-spin duration-[4000ms] w-12 h-12 border border-clay/20 border-t-clay rounded-full" />
                <span className="font-serif text-xl font-bold text-clay select-none z-10">風</span>
              </div>
              
              <div className="space-y-3 max-w-sm">
                <span className="text-[10px] font-mono tracking-widest text-clay font-bold block uppercase">
                  AESTHETIC DEEP REASONING INDEX
                </span>
                <p className="font-serif text-base text-ink-black h-12 font-bold leading-relaxed px-4">
                  {LOADING_STEPS[loadingStepIdx]}
                </p>
                <p className="text-xs text-ink-light leading-snug">
                  잠시만 침묵해 보세요. 바람이 옛 궁궐의 서까래를 스치며 현대 문화의 뼈대를 짚고 올라오고 있습니다.
                </p>
              </div>
            </motion.div>
          ) : analysisResult ? (
            /* Rich Analytics profile dashboard */
            <motion.div
              key="result-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Profile Main HeaderCard */}
              <div className="bg-paper-dark border border-clay/10 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-6 opacity-5 flex flex-col text-slate-400 select-none">
                  <span className="font-serif text-7xl leading-none">興</span>
                </div>

                <div className="space-y-3 relative">
                  <span className="text-[10px] tracking-wide font-mono font-bold bg-clay/15 text-clay px-3 py-1 rounded-full uppercase">
                    PUNGRYU ANALYZED REPORT
                  </span>
                  <div className="space-y-1">
                    <h2 className="font-serif text-3xl font-bold text-ink-black">
                      {customName ? customName : PRESET_ANALYSES.find(p => p.id === selectedPreset)?.name}
                    </h2>
                    <p className="font-serif text-base text-clay font-semibold italic border-b border-clay/15 pb-4 leading-normal">
                      &ldquo;{analysisResult.headline}&rdquo;
                    </p>
                  </div>
                </div>

                {/* The Custom Calligraphic Score Grid with Astro-Radar Chart */}
                <div className="mt-8 space-y-6">
                  <span className="text-xs font-mono font-bold text-ink-light block uppercase tracking-wider">
                    풍류 계통 지표 (Pungryu Vector Score & Radar Chart)
                  </span>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-paper-white p-6 rounded-2xl border border-clay/10 shadow-sm">
                    {/* Left Column: Traditional Astrolabe Radar Chart */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center">
                      <PungryuRadarChart scores={analysisResult.scores} />
                    </div>

                    {/* Right Column: Individual Score Detail Cards */}
                    <div className="lg:col-span-7 grid grid-cols-1 gap-4 w-full">
                      {/* Heung */}
                      <div className="space-y-1 bg-paper-dark/40 p-3.5 rounded-xl border border-clay/5">
                        <div className="flex justify-between text-xs font-serif font-bold text-ink-black">
                          <span>흥 (興) — 신명과 에너지</span>
                          <span className="font-mono text-clay font-bold">{analysisResult.scores.heung}%</span>
                        </div>
                        <div className="w-full bg-paper-white h-2 rounded-full overflow-hidden border border-clay/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisResult.scores.heung}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="bg-clay h-full rounded-full" 
                          />
                        </div>
                        <p className="text-[11px] text-ink-medium leading-relaxed pt-1 select-text">
                          {analysisResult.scoresExplanation.heung}
                        </p>
                      </div>

                      {/* Han & Jeong */}
                      <div className="space-y-1 bg-paper-dark/40 p-3.5 rounded-xl border border-clay/5">
                        <div className="flex justify-between text-xs font-serif font-bold text-ink-black">
                          <span>한(恨)과 정(情) — 상처 승화</span>
                          <span className="font-mono text-amber-600 font-bold">{analysisResult.scores.hanAndJeong}%</span>
                        </div>
                        <div className="w-full bg-paper-white h-2 rounded-full overflow-hidden border border-clay/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisResult.scores.hanAndJeong}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="bg-amber-600 h-full rounded-full" 
                          />
                        </div>
                        <p className="text-[11px] text-ink-medium leading-relaxed pt-1 select-text">
                          {analysisResult.scoresExplanation.hanAndJeong}
                        </p>
                      </div>

                      {/* Meot */}
                      <div className="space-y-1 bg-paper-dark/40 p-3.5 rounded-xl border border-clay/5">
                        <div className="flex justify-between text-xs font-serif font-bold text-ink-black">
                          <span>멋 —自由로운 절제미</span>
                          <span className="font-mono text-celadon font-bold">{analysisResult.scores.meot}%</span>
                        </div>
                        <div className="w-full bg-paper-white h-2 rounded-full overflow-hidden border border-clay/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisResult.scores.meot}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="bg-celadon h-full rounded-full" 
                          />
                        </div>
                        <p className="text-[11px] text-ink-medium leading-relaxed pt-1 select-text">
                          {analysisResult.scoresExplanation.meot}
                        </p>
                      </div>

                      {/* Integration */}
                      <div className="space-y-1 bg-paper-dark/40 p-3.5 rounded-xl border border-clay/5">
                        <div className="flex justify-between text-xs font-serif font-bold text-ink-black">
                          <span>융합성 (融合) — 어우러짐</span>
                          <span className="font-mono text-slate-700 font-bold">{analysisResult.scores.integration}%</span>
                        </div>
                        <div className="w-full bg-paper-white h-2 rounded-full overflow-hidden border border-clay/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisResult.scores.integration}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="bg-slate-700 h-full rounded-full" 
                          />
                        </div>
                        <p className="text-[11px] text-ink-medium leading-relaxed pt-1 select-text">
                          {analysisResult.scoresExplanation.integration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Traditional Ancestors Cards */}
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-ink-light block uppercase tracking-wider">
                  대응되는 전통 연희·미학 조상 (Traditional Ancestors)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.traditionalAncestors.map((ancestor, i) => (
                    <div key={i} className="bg-paper-white border border-clay/15 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-clay" />
                          <h4 className="font-serif text-base font-bold text-ink-black">
                            {ancestor.traditionalName}
                          </h4>
                        </div>
                        <p className="text-xs text-clay font-serif font-bold leading-normal">
                          대응 양상: {ancestor.modernMap}
                        </p>
                        <p className="text-xs text-ink-medium leading-relaxed font-sans">
                          {ancestor.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profound Text Criticism */}
              <div className="bg-paper-white border border-clay/15 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                <div className="flex items-center space-x-2 pb-3 border-b border-clay/10 text-ink-black">
                  <FileText className="w-4.5 h-4.5 text-clay" />
                  <span className="font-serif text-sm font-bold">심층 예학적 비평 (Millennial Aesthetics Review)</span>
                </div>
                <div className="text-ink-dark text-sm leading-relaxed whitespace-pre-line font-sans prose max-w-none">
                  {analysisResult.deepAnalysis}
                </div>
              </div>

              {/* Poetic Verdict Banner */}
              <div className="bg-ink-black text-paper-white rounded-2xl p-6 border-l-4 border-clay flex items-center shadow-lg">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-clay font-bold block uppercase">
                    AESTHETIC VERDICT
                  </span>
                  <p className="font-serif text-base md:text-lg italic text-paper-dark leading-relaxed font-bold">
                    &ldquo;{analysisResult.poeticVerdict}&rdquo;
                  </p>
                </div>
              </div>

            </motion.div>
          ) : (
            /* Blank empty instructions state */
            <div className="bg-paper-dark border border-clay/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[500px]">
              <Compass className="w-12 h-12 text-clay/40" />
              <h3 className="font-serif text-lg font-bold text-ink-black">바람의 거울이 비어 있습니다</h3>
              <p className="text-xs text-ink-light max-w-sm leading-relaxed mx-auto">
                좌측 프리셋 버튼을 클릭해 기분석 레포트를 구경해 보시거나, 직접 커스텀 아티스트 장르를 입력하여 명도 높은 AI 수사 비평을 시작해 보세요.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
      
    </div>
  );
}
