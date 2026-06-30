import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown, X } from "lucide-react";

export default function ScrollHint() {
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setHasScrolled(true);
        // Automatically hide on scroll down
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If the user dismissed or already scrolled, don't show
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-50 max-w-[90%] sm:max-w-sm"
      >
        <div className="bg-ink-black/95 backdrop-blur-md text-paper-white border border-clay/30 p-3.5 rounded-2xl shadow-xl flex items-start space-x-3 text-left relative overflow-hidden group">
          {/* Subtle line indicator */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-clay via-celadon to-clay opacity-80" />

          {/* Animated bouncing arrow container */}
          <div className="flex-shrink-0 mt-0.5">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-7 h-7 rounded-lg bg-clay/20 border border-clay/30 flex items-center justify-center text-clay"
            >
              <ArrowDown className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Guide Message Text */}
          <div className="flex-1 pr-4">
            <h4 className="font-serif font-bold text-xs text-paper-white flex items-center space-x-1">
              <span>아래에 이야기가 더 있습니다</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-celadon animate-pulse" />
            </h4>
            <p className="text-[11px] text-paper-dark/85 leading-relaxed mt-1 font-sans">
              페이지 내용이 화면에 한 번에 다 나오지 않을 경우, <span className="text-clay font-bold underline underline-offset-2">밑으로 스크롤해서</span> 감상해 보세요.
            </p>
          </div>

          {/* Inline Dismiss Button */}
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            aria-label="닫기"
            className="flex-shrink-0 text-paper-dark/60 hover:text-paper-white hover:bg-white/10 p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
