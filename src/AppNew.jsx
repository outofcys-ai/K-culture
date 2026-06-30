import { useEffect, useMemo, useState } from "react";
import HeaderNew from "./components/HeaderNew";
import HeroSectionNew from "./components/HeroSectionNew";
import QuickFilters from "./components/QuickFilters";
import ComboGridNew from "./components/ComboGridNew";
import RecommendationQuiz from "./components/RecommendationQuiz";
import ComboDetailModalNew from "./components/ComboDetailModalNew";
import ConvenienceGuideNew from "./components/ConvenienceGuideNew";
import SavedCombosNew from "./components/SavedCombosNew";
import NearbyStoreMap from "./components/NearbyStoreMap";
import BottomNavigationNew from "./components/BottomNavigationNew";
import KoreanPhraseCardNew from "./components/KoreanPhraseCardNew";
import { combos, filterOptions, guideCards, koreanPhraseCards } from "./data/content";

const SAVED_KEY = "konbini-saved-combos";
const CHECKED_KEY = "konbini-checked-items";

function getInitialJson(key, fallback) {
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function matchesFilter(combo, filter) {
  if (!filter) return true;
  if (filter === "5,000ウォン以下") return combo.priceValue <= 5000;
  if (filter === "甘いもの") return combo.tags.includes("甘いもの");
  if (filter === "韓国っぽい") return combo.tags.includes("韓国っぽい");
  return combo.tags.includes(filter);
}

function scoreCombo(combo, answers) {
  let score = 0;

  if (answers.mood === "ごはん系" && (combo.tags.includes("朝ごはん") || combo.tags.includes("夜食"))) score += 2;
  if (answers.mood === "甘いもの" && combo.tags.includes("甘いもの")) score += 3;
  if (answers.mood === "辛いもの" && combo.spicyLevel >= 2) score += 3;
  if (answers.mood === "軽く食べたい" && combo.tags.includes("ひとり旅")) score += 2;
  if (answers.mood === "韓国っぽい体験" && combo.tags.includes("韓国っぽい")) score += 3;

  if (answers.spice === "辛くないものがいい" && combo.spicyLevel === 0) score += 3;
  if (answers.spice === "少しならOK" && combo.spicyLevel <= 2) score += 2;
  if (answers.spice === "辛いもの大好き" && combo.spicyLevel >= 2) score += 2;

  if (answers.place === "ホテル" && combo.situationTags.includes("ホテル向け")) score += 2;
  if (answers.place === "移動中" && combo.situationTags.includes("移動中")) score += 2;
  if (answers.place === "コンビニ店内" && combo.requiredTools.some((tool) => tool === "お湯" || tool === "電子レンジ")) score += 1;
  if (answers.place === "外で食べる" && combo.tags.includes("調理なし")) score += 2;

  return score;
}

export default function AppNew() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [savedIds, setSavedIds] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    setSavedIds(getInitialJson(SAVED_KEY, []));
    setCheckedItems(getInitialJson(CHECKED_KEY, {}));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    window.localStorage.setItem(CHECKED_KEY, JSON.stringify(checkedItems));
  }, [checkedItems]);

  const filteredCombos = useMemo(
    () => combos.filter((combo) => matchesFilter(combo, activeFilter)),
    [activeFilter]
  );

  const quizResults = useMemo(() => {
    if (Object.keys(quizAnswers).length !== 3) return [];
    return [...combos]
      .map((combo) => ({ combo, score: scoreCombo(combo, quizAnswers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.combo);
  }, [quizAnswers]);

  const savedCombos = useMemo(
    () => combos.filter((combo) => savedIds.includes(combo.id)),
    [savedIds]
  );

  const similarCombos = useMemo(() => {
    if (!selectedCombo) return [];
    return combos
      .filter((combo) => combo.id !== selectedCombo.id)
      .filter((combo) => combo.tags.some((tag) => selectedCombo.tags.includes(tag)))
      .slice(0, 3);
  }, [selectedCombo]);

  const handleToggleSave = (comboId) => {
    setSavedIds((current) =>
      current.includes(comboId) ? current.filter((id) => id !== comboId) : [...current, comboId]
    );
  };

  const handleToggleItem = (nameKo) => {
    if (!selectedCombo) return;
    setCheckedItems((current) => {
      const comboItems = current[selectedCombo.id] || [];
      const nextItems = comboItems.includes(nameKo)
        ? comboItems.filter((item) => item !== nameKo)
        : [...comboItems, nameKo];
      return { ...current, [selectedCombo.id]: nextItems };
    });
  };

  const handleCopyPhrase = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <div className="app-shell" id="top">
      <HeaderNew />
      <HeroSectionNew
        onPrimary={() => document.getElementById("combos")?.scrollIntoView({ behavior: "smooth" })}
        onSecondary={() => setActiveFilter("辛くない")}
      />

      <NearbyStoreMap />

      <QuickFilters options={filterOptions} activeFilter={activeFilter} onSelect={setActiveFilter} />

      <div id="combos">
        <ComboGridNew
          title="人気コンボ"
          combos={combos.slice(0, 4)}
          savedIds={savedIds}
          onOpen={setSelectedCombo}
          onToggleSave={handleToggleSave}
        />

        <RecommendationQuiz
          answers={quizAnswers}
          onAnswer={(key, value) => setQuizAnswers((current) => ({ ...current, [key]: value }))}
          results={quizResults}
          onOpen={setSelectedCombo}
        />

        <ComboGridNew
          title={activeFilter ? `${activeFilter} コンボ` : "すべてのコンボ"}
          combos={filteredCombos}
          savedIds={savedIds}
          onOpen={setSelectedCombo}
          onToggleSave={handleToggleSave}
        />
      </div>

      <section className="section">
        <div className="section-heading">
          <h3>韓国語フレーズ</h3>
        </div>
        <div className="phrase-grid">
          {koreanPhraseCards.map((phrase) => (
            <KoreanPhraseCardNew key={phrase.ja} phrase={phrase} onCopy={handleCopyPhrase} />
          ))}
        </div>
      </section>

      <ConvenienceGuideNew guides={guideCards} />
      <SavedCombosNew combos={savedCombos} onOpen={setSelectedCombo} />
      <BottomNavigationNew />

      <ComboDetailModalNew
        combo={selectedCombo}
        isSaved={selectedCombo ? savedIds.includes(selectedCombo.id) : false}
        checkedItems={selectedCombo ? checkedItems[selectedCombo.id] || [] : []}
        onClose={() => setSelectedCombo(null)}
        onToggleSave={handleToggleSave}
        onToggleItem={handleToggleItem}
        onCopyPhrase={handleCopyPhrase}
        similarCombos={similarCombos}
        onOpenSimilar={setSelectedCombo}
      />
    </div>
  );
}
