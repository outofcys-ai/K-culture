import React, { useState, useEffect } from "react";
import Exhibition from "./components/Exhibition";
import Analyzer from "./components/Analyzer";
import ScrollHint from "./components/ScrollHint";
import { Landmark, Sparkles, HelpCircle } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab ] = useState<"museum" | "lab">("museum");

  // Scroll to top automatically whenever activeTab (screen) changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-paper-white flex flex-col justify-between selection:bg-clay/10 selection:text-clay relative">
      
      {/* Dynamic Scroll Helper Hint */}
      <ScrollHint />
      <header className="border-b border-clay/10 backdrop-blur-md sticky top-0 bg-paper-white/80 z-20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Brand Logo & Calligraphic Title */}
          <div className="flex items-center space-x-3 shrink-0">
            <span className="font-serif text-2xl font-bold bg-clay text-paper-white w-9 h-9 flex items-center justify-center rounded-xl shadow-sm">
              風
            </span>
            <div className="leading-tight">
              <h1 className="font-serif text-lg font-bold text-ink-black tracking-tight flex items-center space-x-2">
                <span>풍류(風流)</span>
                <span className="text-xs font-sans text-clay font-normal border border-clay/20 px-1.5 py-0.5 rounded whitespace-nowrap">한류의 뿌리</span>
              </h1>
              <p className="text-[10px] text-ink-light font-mono tracking-wider">
                K-CULTURE ROOT MUSEUM
              </p>
            </div>
          </div>

          {/* Exhibition / Lab Navigation Tabs */}
          <nav className="flex space-x-1 bg-paper-dark p-1 rounded-xl border border-clay/10 max-w-full overflow-x-auto scrollbar-none" aria-label="Main Navigation">
            <button
              id="tab-btn-museum"
              onClick={() => setActiveTab("museum")}
              type="button"
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-serif font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
                activeTab === "museum"
                  ? "bg-paper-white text-clay shadow-sm border border-clay/5"
                  : "text-ink-medium hover:text-ink-black"
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>풍류 박물관</span>
            </button>
            <button
              id="tab-btn-lab"
              onClick={() => setActiveTab("lab")}
              type="button"
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-serif font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
                activeTab === "lab"
                  ? "bg-paper-white text-clay shadow-sm border border-clay/5"
                  : "text-ink-medium hover:text-ink-black"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 fill-clay/10" />
              <span>여기를 눌러 내용을 만들어 보세요</span>
            </button>
          </nav>
        </div>
      </header>

      {/* 2. Main Layout Render Content */}
      <main className="flex-1 py-8">
        <div className="transition-all duration-300">
          {activeTab === "museum" ? <Exhibition /> : <Analyzer />}
        </div>
      </main>

      {/* 3. Aesthetic Zen Footer */}
      <footer className="border-t border-clay/10 bg-paper-dark/60 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6 font-mono text-xs text-ink-light">
          <div className="space-y-1">
            <p className="text-ink-medium font-serif font-semibold">
              國有玄妙之道 曰風流 — 최치원 鸞郞碑序
            </p>
            <p>
              &ldquo;나라에 현묘해 마지않는 도가 있으니, 이를 풍류라 일컫는다.&rdquo;
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-sans text-xs text-ink-medium">
              &copy; {new Date().getFullYear()} 한류의 뿌리, 풍류 박물관 X 가락 연구소. All rights reserved.
            </p>
            <p className="text-[10px] text-ink-light text-center md:text-right">
              Powered by Gemini 3.5 Flash Model
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
