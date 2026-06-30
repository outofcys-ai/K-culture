import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PUNGRYU_PILLARS, CONVERGENCE_LINES } from "../data";
import { Sparkles, ArrowRight, CornerDownRight, Compass, ShieldAlert, Award, Star } from "lucide-react";

export default function Exhibition() {
  const [selectedPillar, setSelectedPillar] = useState<string>("heung");
  const [activeLine, setActiveLine] = useState<number>(0);

  const activePillarData = PUNGRYU_PILLARS.find(p => p.id === selectedPillar) || PUNGRYU_PILLARS[0];

  return (
    <div className="space-y-24 pb-20">
      {/* Dynamic Intro Hero with Poetic Overlay */}
      <section className="relative py-20 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Artistic traditional background wave decoration */}
        <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none flex items-center justify-center">
          <svg width="600" height="300" viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-clay/15 animate-pulse duration-[8000ms]">
            <path d="M50 150 C 150 50, 250 250, 350 150 C 450 50, 500 150, 550 150" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M70 170 C 170 70, 270 270, 370 170 C 470 70, 520 170, 570 170" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 4" strokeLinecap="round"/>
            <path d="M30 130 C 130 30, 230 230, 330 130 C 430 30, 480 130, 530 130" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round"/>
          </svg>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl space-y-6"
        >
          <span className="text-clay font-mono text-sm tracking-wider font-semibold uppercase block">
            THE ROOTS & SPIRIT OF HALLYU
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink-black font-bold tracking-tight leading-tight">
            한류의 뿌리, <span className="text-celadon underline decoration-clay/30 underline-offset-8 inline-block whitespace-nowrap">풍류(風流)</span>에서 답을 찾다
          </h1>
          <p className="text-ink-medium text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            한류 열풍은 단순히 잘 만든 콘텐츠의 우연한 성공이 아닙니다. 
            그 깊은 뿌리에는 천 년 넘게 한국인의 정신 속에 흘러온 <strong>풍류(風流)</strong>라는 독특한 미의식이 자리하고 있습니다.
          </p>

          <div className="pt-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-paper-dark border border-clay/10 rounded-2xl p-6 md:p-8 max-w-xl mx-auto shadow-sm text-left relative"
            >
              <span className="font-serif text-5xl absolute top-3 right-5 text-clay/10 select-none">風流</span>
              <p 
                style={{ fontFamily: "'Gungsuh', 'GungsuhChe', 'Gowun Batang', serif" }}
                className="text-base text-ink-black font-semibold leading-relaxed border-l-2 border-clay pl-4"
              >
                &ldquo;우리나라에 현묘한 도가 있으니 이를 풍류(風流)라 한다. 
                그 가르침의 비밀은 선사(仙史)에 자세히 실려 있으니, 실로 곧 유·불·선 삼교를 아우르며 모든 살아있는 생명을 귀중히 여기는 전인적 풍토다.&rdquo;
              </p>
              <div 
                style={{ fontFamily: "'Gungsuh', 'GungsuhChe', 'Gowun Batang', serif" }}
                className="mt-4 text-xs text-ink-black font-bold text-right"
              >
                — 최치원, 〈난랑비서(鸞郞碑序)〉
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* The 4 Core Pillars Interactive Gallery */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-serif text-3xl font-bold text-ink-black">풍류의 본질 — 한국 미학의 사대원형</h2>
          <p className="text-ink-light text-sm max-w-lg mx-auto">
            자연과 인간, 예술과 삶이 하나로 어우러지는 한국식 마음 수련과 흥의 미학을 상징하는 네 가지 기둥입니다.
          </p>
        </div>

        <div className="space-y-6">
          {/* Navigation Grid (Horizontal 2x2 Layout on all screens) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 relative">
            {PUNGRYU_PILLARS.map((pillar) => {
              const isActive = selectedPillar === pillar.id;
              return (
                <button
                  key={pillar.id}
                  id={`pillar-btn-${pillar.id}`}
                  onClick={() => setSelectedPillar(pillar.id)}
                  className={`text-left p-3.5 sm:p-5 rounded-2xl transition-all duration-300 border flex items-center space-x-2.5 sm:space-x-4 group cursor-pointer relative ${
                    isActive 
                      ? "bg-ink-black border-ink-black text-paper-white shadow-md shadow-ink-black/10" 
                      : "bg-paper-white border-clay/15 text-ink-black hover:bg-paper-dark hover:border-clay/35"
                  }`}
                >
                  <span className={`font-serif text-lg sm:text-3xl font-bold w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg sm:rounded-xl shrink-0 transition-colors ${
                    isActive ? "bg-clay text-paper-white" : "bg-paper-dark text-clay group-hover:bg-clay/10"
                  }`}>
                    {pillar.char}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="block font-serif text-xs sm:text-lg font-bold truncate sm:whitespace-normal group-hover:translate-x-1 duration-200 transition-transform">
                      {pillar.title}
                    </span>
                    <span className={`text-[10px] sm:text-xs block truncate sm:whitespace-normal ${isActive ? "text-paper-dark/70" : "text-ink-light"}`}>
                      {pillar.subtitle}
                    </span>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 hidden xs:block ${
                    isActive ? "translate-x-1 opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Dynamic Authentic Calligraphic Connector Arrow */}
          <div className="relative h-14 w-full overflow-visible pointer-events-none -my-2 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-14 text-clay" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.g
                animate={{ x: (selectedPillar === "heung" || selectedPillar === "meot") ? "25%" : "75%" }}
                transition={{ type: "spring", stiffness: 160, damping: 18 }}
              >
                {/* Traditional red seal dynamic cursor anchoring point */}
                <circle cx="0" cy="2" r="3" fill="#b24d38" className="animate-ping" />
                <circle cx="0" cy="2" r="2.5" fill="#b24d38" />

                {/* Flowing traditional ink trail connection path */}
                <motion.path
                  d="M 0,2 C 12,18 -12,32 0,48"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  opacity="0.85"
                />
                
                {/* Hand-drawn look Arrowhead pointing downwards directly into the description box */}
                <path
                  d="M -5,40 L 0,48 L 5,40"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Floating miniature guide text explaining link connection */}
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  key={selectedPillar}
                  x={(selectedPillar === "heung" || selectedPillar === "meot") ? 18 : -18}
                  textAnchor={(selectedPillar === "heung" || selectedPillar === "meot") ? "start" : "end"}
                  y="26"
                  fill="#8c827c"
                  className="text-[10px] font-serif font-bold tracking-tight select-none"
                >
                  {activePillarData.title} 해설 연결됨
                </motion.text>
              </motion.g>
            </svg>
          </div>

          {/* Deep Description Card (Full Width Below) */}
          <div className="bg-paper-dark border border-clay/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
            {/* Ink wash artistic circle decoration in corner */}
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-clay/5 rounded-full filter blur-xl pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillarData.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-xs bg-clay/10 text-clay px-3 py-1.5 rounded-full font-mono font-semibold tracking-wider">
                    COLUMN SOURCE
                  </span>
                  <span className="font-serif text-sm text-celadon font-semibold">
                    {activePillarData.subtitle}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-ink-black">
                    {activePillarData.title}
                  </h3>
                  <p className="font-sans text-base text-ink-medium leading-relaxed">
                    {activePillarData.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-clay/10">
                  <span className="text-xs font-mono font-bold text-ink-light block uppercase tracking-wider">
                    DNA & INFLUENCE ON MODERN CONTENTS
                  </span>
                  <ul className="space-y-3">
                    {activePillarData.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start text-sm text-ink-dark leading-relaxed">
                        <CornerDownRight className="w-4 h-4 text-clay mr-3.5 mt-1 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-clay/15 flex items-center justify-between font-mono text-xs text-ink-light">
              <span>TRADITIONAL AESTHETICS METRIC</span>
              <span className="flex items-center space-x-1 text-clay font-bold font-sans">
                <Sparkles className="w-3.5 h-3.5 fill-clay animate-spin duration-[4000ms]" />
                <span>현묘한 도의 현대적 정수</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Rivers of Convergence Chronology */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs text-clay font-mono font-bold tracking-wider uppercase">
            THE FIVE CHANNELS OF RESURRECTED POWER
          </span>
          <h2 className="font-serif text-3xl font-bold text-ink-black">풍류와 한류가 만나는 다섯 갈래</h2>
          <p className="text-ink-light text-sm max-w-lg mx-auto">
            천 년 동안 쌓인 기개와 풍류의 에너지가 오늘날 K-콘텐츠의 폭발력으로 분출되는 생생한 교집합입니다.
          </p>
        </div>

        {/* Dynamic Chronological Timeline Explorer */}
        <div className="space-y-4">
          <div className="relative">
            {/* Fade overlay indicating scroll progress available on right side */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-paper-white to-transparent pointer-events-none z-10 md:hidden" />
            
            <div className="flex overflow-x-auto pb-2 scrollbar-none border-b border-clay/15 space-x-2 md:space-x-4">
              {CONVERGENCE_LINES.map((line, idx) => {
                const isSelected = activeLine === idx;
                return (
                  <button
                    key={line.num}
                    id={`line-tab-${idx}`}
                    onClick={() => setActiveLine(idx)}
                    className={`px-5 py-3.5 rounded-t-xl text-sm font-serif font-bold transition-all shrink-0 border-b-2 cursor-pointer ${
                      isSelected 
                        ? "text-clay border-clay bg-paper-dark" 
                        : "text-ink-light border-transparent hover:text-ink-black hover:bg-paper-dark/50"
                    }`}
                  >
                    <span className="font-mono text-xs text-clay/60 mr-2">{line.num}</span>
                    {line.title.split(" — ")[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Swipe indicator badge shown on small/medium screens */}
          <div className="flex items-center justify-between md:hidden text-[10px] text-ink-light font-medium px-1">
            <span className="font-mono">CHRONOLOGY TIMELINE</span>
            <span className="flex items-center space-x-1 text-clay font-bold animate-pulse">
              <span>옆으로 밀어서 연대기 더 보기</span>
              <span className="font-sans">➔</span>
            </span>
          </div>

          <div className="bg-paper-white border border-clay/15 rounded-3xl p-6 md:p-8 lg:p-10 shadow-sm relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 p-8 text-serif font-bold text-7xl text-clay/5 select-none font-mono">
              {CONVERGENCE_LINES[activeLine].num}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeLine}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Visual / Text content LEFT */}
                <div className="lg:col-span-7 space-y-6">
                  <h3 className="font-serif text-2xl font-bold text-ink-black leading-tight">
                    {CONVERGENCE_LINES[activeLine].title}
                  </h3>

                  <div className="bg-paper-dark rounded-xl p-5 border-l-4 border-clay text-ink-dark text-sm italic font-serif leading-relaxed">
                    &ldquo;{CONVERGENCE_LINES[activeLine].quote}&rdquo;
                  </div>

                  <p className="text-ink-medium text-base leading-relaxed font-sans">
                    {CONVERGENCE_LINES[activeLine].description}
                  </p>
                </div>

                {/* Analytical Contrast Card RIGHT */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="bg-paper-dark border border-clay/10 rounded-2xl p-6 space-y-6">
                    <span className="text-xs font-mono font-bold text-clay tracking-widest block uppercase">
                      THE DNA GENEALOGY MAP
                    </span>

                    {/* From */}
                    <div className="space-y-2">
                      <span className="text-xs text-ink-light block font-sans">
                        거슬러 올라가면 (그 깊은 옛 뿌리의 뿌리)
                      </span>
                      <div className="bg-paper-white rounded-lg p-3 border border-clay/10">
                        <span className="text-xs font-semibold px-2 py-0.5 bg-celadon/10 text-celadon rounded font-serif mr-2">
                          뿌리
                        </span>
                        <span className="font-serif text-sm font-bold text-ink-black leading-tight">
                          {CONVERGENCE_LINES[activeLine].traditionalAccent}
                        </span>
                      </div>
                    </div>

                    {/* Transform Icon */}
                    <div className="flex justify-center my-1 text-clay">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce">
                        <path d="M12 4V20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    {/* To */}
                    <div className="space-y-2">
                      <span className="text-xs text-ink-light block font-sans">
                        오늘날 꽃피운 열매 (글로벌 한류의 얼굴)
                      </span>
                      <div className="bg-paper-white rounded-lg p-3 border border-clay/10">
                        <span className="text-xs font-semibold px-2 py-0.5 bg-clay/10 text-clay rounded font-serif mr-2">
                          꽃
                        </span>
                        <span className="font-serif text-sm font-bold text-ink-black leading-tight">
                          {CONVERGENCE_LINES[activeLine].modernAccent}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Concluding Section */}
      <section className="max-w-4xl mx-auto px-6 text-center py-12 relative">
        <div className="absolute inset-0 -z-10 bg-paper-dark rounded-3xl border border-clay/10 filter blur-sm transform scale-98" />
        <div className="bg-paper-dark border border-clay/10 rounded-3xl p-8 md:p-12 space-y-6">
          <span className="font-serif text-2xl text-clay leading-none">♣</span>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-ink-black">
            왜 지금, 왜 한국의 풍류인가
          </h3>
          <p className="text-ink-medium text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            효율과 분업의 삭막한 현대 문명에서 한류는 잃어버렸던 <strong>종합성</strong>을, 
            치열한 각자 도생의 시대에 따스한 <strong>정(情)</strong>을, 
            지나치게 매끈한 가공의 문명에 날것 그대로의 <strong>신명(興)</strong>을 되돌려줍니다. 
            한류는 핏속에 도도히 흐르던 고대 풍류의 바람이 세계라는 거대한 평원을 만나 비로소 자유롭게 불어 나가는 소리입니다.
          </p>
          <div className="font-serif text-sm text-clay italic">
            바람이 마침내 제 길을 찾아 유유히 흐르듯이.
          </div>
        </div>
      </section>
    </div>
  );
}
