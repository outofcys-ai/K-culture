// 시작 이미지와 편스토랑 본편 화면 전환을 관리하는 메인 앱 컴포넌트
import { useEffect, useMemo, useRef, useState } from "react";
import HeaderNew from "./components/HeaderNew";
import HeroSectionNew from "./components/HeroSectionNew";
import ComboGridNew from "./components/ComboGridNew";
import ComboDetailModalNew from "./components/ComboDetailModalNew";
import ConvenienceGuideNew from "./components/ConvenienceGuideNew";
import SavedCombosNew from "./components/SavedCombosNew";
import NearbyStoreMap from "./components/NearbyStoreMap";
import BottomNavigationNew from "./components/BottomNavigationNew";
import KoreanPhraseCardNew from "./components/KoreanPhraseCardNew";
import { combos, guideCards, koreanPhraseCards } from "./data/content";

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

function scoreVoice(voice) {
  const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  let score = 0;
  if (voice.lang?.toLowerCase().startsWith("ko")) score += 100;
  if (voice.default) score += 20;
  if (/premium|enhanced|neural|natural/.test(name)) score += 15;
  if (/siri|apple|iphone|ipad|ios/.test(name)) score += 12;
  if (/google|microsoft|samsung/.test(name)) score += 10;
  return score;
}

function pickBestKoreanVoice(voices) {
  const koreanVoices = voices.filter((voice) => voice.lang?.toLowerCase().startsWith("ko"));
  if (koreanVoices.length === 0) return null;

  return [...koreanVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

function ImageStage({ imageSrc, imageAlt, children }) {
  return (
    <section className="story-stage">
      <div className="story-stage-frame">
        <img className="story-stage-image" src={imageSrc} alt={imageAlt} />
        <div className="story-stage-overlay">{children}</div>
      </div>
    </section>
  );
}

function ProjectHome({
  activePage,
  checkedItems,
  savedCombos,
  savedIds,
  selectedCombo,
  setActivePage,
  setSelectedCombo,
  handleToggleItem,
  handleToggleSave,
  handleCopyPhrase,
  handleSpeakPhrase,
  speechAvailable,
  similarCombos,
}) {
  return (
    <>
      <HeaderNew />
      {activePage === "home" ? (
        <>
          <HeroSectionNew />

          <div id="combos">
            <ComboGridNew
              title="おすすめ組み合わせ"
              combos={combos.slice(0, 4)}
              savedIds={savedIds}
              onOpen={setSelectedCombo}
              onToggleSave={handleToggleSave}
            />

            <ComboGridNew
              title="すべての組み合わせ"
              combos={combos}
              savedIds={savedIds}
              onOpen={setSelectedCombo}
              onToggleSave={handleToggleSave}
            />
          </div>
        </>
      ) : null}

      {activePage === "find" ? <NearbyStoreMap /> : null}

      {activePage === "saved" ? <SavedCombosNew combos={savedCombos} onOpen={setSelectedCombo} /> : null}

      {activePage === "guide" ? (
        <>
          <ConvenienceGuideNew guides={guideCards} />
          <section className="section">
            <div className="section-heading">
              <h3>買い物支援会話</h3>
            </div>
            <div className="phrase-grid">
              {koreanPhraseCards.map((phrase) => (
                <KoreanPhraseCardNew
                  key={phrase.ja}
                  phrase={phrase}
                  onCopy={handleCopyPhrase}
                  onSpeak={handleSpeakPhrase}
                  speechAvailable={speechAvailable}
                />
              ))}
            </div>
          </section>
        </>
      ) : null}

      <BottomNavigationNew activePage={activePage} onChangePage={setActivePage} />

      <ComboDetailModalNew
        combo={selectedCombo}
        isSaved={selectedCombo ? savedIds.includes(selectedCombo.id) : false}
        checkedItems={selectedCombo ? checkedItems[selectedCombo.id] || [] : []}
        onClose={() => setSelectedCombo(null)}
        onToggleSave={handleToggleSave}
        onToggleItem={handleToggleItem}
        onCopyPhrase={handleCopyPhrase}
        onSpeakPhrase={handleSpeakPhrase}
        speechAvailable={speechAvailable}
        similarCombos={similarCombos}
        onOpenSimilar={setSelectedCombo}
      />
    </>
  );
}

export default function AppFinal() {
  const [stage, setStage] = useState("landing");
  const [activePage, setActivePage] = useState("home");
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const voicesRef = useRef([]);
  const selectedVoiceRef = useRef(null);

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

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      voicesRef.current = voices;
      selectedVoiceRef.current = pickBestKoreanVoice(voices);
      setSpeechAvailable(Boolean(selectedVoiceRef.current));
    };

    updateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

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

  const handleSpeakPhrase = (text) => {
    if (!("speechSynthesis" in window)) return;

    const fallbackVoice = pickBestKoreanVoice(voicesRef.current);
    const voice = selectedVoiceRef.current || fallbackVoice;
    if (!voice) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  };

  const audioRef = useRef(null);

  const handleOpenVillage = () => {
    setStage("entering");
    const audio = new Audio("/bgm.mp3");
    audio.loop = true;
    audioRef.current = audio;

    const proceed = () => setStage("village");

    audio.addEventListener("canplaythrough", proceed, { once: true });
    // mp3 없거나 로딩 실패해도 2초 후 진행
    audio.addEventListener("error", () => setTimeout(proceed, 500), { once: true });
    setTimeout(proceed, 4000); // 최대 4초 대기
    audio.load();
  };

  const handleOpenProject = () => {
    setStage("project");
    setActivePage("home");
  };

  return (
    <div className={stage === "project" ? "app-shell" : "story-shell"} id="top">
      {stage === "landing" ? (
        <ImageStage imageSrc="/landing-palace.png" imageAlt="궁궐 입장 메인 화면">
          <button
            type="button"
            className="hotspot-button hotspot-palace"
            onClick={handleOpenVillage}
            aria-label="궁궐로 입장하기"
          />
          <div className="story-caption">
            <p className="story-caption-title">궁궐을 누르면 탐험 사랑방으로 들어갑니다.</p>
          </div>
        </ImageStage>
      ) : null}

      {stage === "entering" ? (
        <div className="entering-screen">
          <p className="entering-text">
            입장중입니다<span className="entering-dots"><span>.</span><span>.</span><span>.</span></span>
          </p>
        </div>
      ) : null}

      {stage === "village" ? (
        <ImageStage imageSrc="/village-map.png" imageAlt="탐험 사랑방 선택 화면">
          <button
            type="button"
            className="story-back-button"
            onClick={() => setStage("landing")}
          >
            처음으로
          </button>
          <button
            type="button"
            className="hotspot-button hotspot-mukbang"
            onClick={handleOpenProject}
            aria-label="먹방 사랑방 열기"
          />
          <button
            type="button"
            className="hotspot-button hotspot-kpop"
            onClick={() => setStage("kpop")}
            aria-label="케이팝 사랑방 열기"
          />
          <button
            type="button"
            className="hotspot-button hotspot-culture-center"
            onClick={() => setStage("monk")}
            aria-label="문화사랑채 열기"
          />
          <button
            type="button"
            className="hotspot-button hotspot-kgame"
            onClick={() => setStage("kgame")}
            aria-label="정 퀴즈 게임 열기"
          />
          <button
            type="button"
            className="hotspot-button hotspot-kbeauty"
            onClick={() => setStage("kbeauty")}
            aria-label="K-BEAUTY 뷰티 사랑방 열기"
          />
          <div className="story-caption story-caption-bottom">
            <p className="story-caption-title">먹방, K-POP, 문화사랑채, K-GAME 중 원하는 공간을 눌러 이동하세요.</p>
          </div>
        </ImageStage>
      ) : null}

      {stage === "kpop" ? (
        <ImageStage imageSrc="/kpop-room.png" imageAlt="케이팝 사랑방 화면">
          <button
            type="button"
            className="story-back-button"
            onClick={handleOpenVillage}
          >
            탐험 사랑방으로
          </button>
          <button
            type="button"
            className="hotspot-button hotspot-kpop-stage"
            onClick={() => setStage("kpop-live")}
            aria-label="K-POP 무대로 입장"
          />
          <div className="story-caption story-caption-bottom">
            <p className="story-caption-title">중앙 무대를 클릭하면 라이브 공연장으로 입장합니다.</p>
          </div>
        </ImageStage>
      ) : null}

      {stage === "kpop-live" ? (
        <ImageStage imageSrc="/kpop-live.png" imageAlt="K-POP 라이브 공연 화면">
          <button
            type="button"
            className="story-back-button"
            onClick={() => setStage("kpop")}
          >
            사랑방으로
          </button>
          <div className="story-caption story-caption-bottom">
            <p className="story-caption-title">K-POP 사랑방 라이브가 시작됐어요! 무대를 즐겨봐요!</p>
          </div>
        </ImageStage>
      ) : null}

      {stage === "monk" ? (
        <ImageStage imageSrc="/monk-room.png" imageAlt="동자승을 만나는 화면">
          <button
            type="button"
            className="story-back-button"
            onClick={handleOpenVillage}
          >
            탐험 사랑방으로
          </button>
          <button
            type="button"
            className="hotspot-button hotspot-temple-door"
            onClick={() => setStage("meditation")}
            aria-label="절 안으로 들어가기"
          />
          <div className="story-caption story-caption-bottom">
            <p className="story-caption-title">절 건물을 누르면 안으로 들어가 명상 화면으로 이어집니다.</p>
          </div>
        </ImageStage>
      ) : null}

      {stage === "kbeauty" ? (
        <div className="kgame-shell">
          <button
            type="button"
            className="story-back-button kgame-back-button"
            onClick={handleOpenVillage}
          >
            탐험 사랑방으로
          </button>
          <iframe
            className="kgame-frame"
            src="https://k-culture-hanbok.vercel.app/"
            title="K-BEAUTY 한복 체험"
          />
        </div>
      ) : null}

      {stage === "kgame" ? (
        <div className="kgame-shell">
          <button
            type="button"
            className="story-back-button kgame-back-button"
            onClick={handleOpenVillage}
          >
            탐험 사랑방으로
          </button>
          <iframe
            className="kgame-frame"
            src="/jeong-game.html"
            title="정답 없는 정 퀴즈"
            allow="clipboard-write"
          />
        </div>
      ) : null}

      {stage === "meditation" ? (
        <ImageStage imageSrc="/meditation-room.png" imageAlt="명상 화면">
          <button
            type="button"
            className="story-back-button"
            onClick={() => setStage("monk")}
          >
            동자승 화면으로
          </button>
          <button
            type="button"
            className="hotspot-button hotspot-meditation-girl"
            onClick={() => setStage("barabogi")}
            aria-label="소녀를 클릭해 다음 화면으로"
          />
          <div className="story-caption story-caption-bottom">
            <p className="story-caption-title">소녀를 클릭하면 다음 화면으로 이동합니다.</p>
          </div>
        </ImageStage>
      ) : null}

      {stage === "barabogi" ? (
        <ImageStage imageSrc="/barabogi.png" imageAlt="산을 바라보는 소녀">
          <button
            type="button"
            className="story-back-button"
            onClick={() => setStage("meditation")}
          >
            이전 화면으로
          </button>
          <button
            type="button"
            className="hotspot-button hotspot-barabogi-girl"
            onClick={() => setStage("kwave")}
            aria-label="소녀를 클릭해 풍류 체험으로"
          />
          <div className="story-caption story-caption-bottom">
            <p className="story-caption-title">소녀를 클릭하면 한류의 뿌리 '풍류'를 체험합니다.</p>
          </div>
        </ImageStage>
      ) : null}

      {stage === "kwave" ? (
        <div className="kgame-shell">
          <button
            type="button"
            className="story-back-button kgame-back-button"
            onClick={() => setStage("barabogi")}
          >
            이전 화면으로
          </button>
          <iframe
            className="kgame-frame"
            src="https://k-wave-kappa.vercel.app/"
            title="한류의 뿌리, 풍류"
          />
        </div>
      ) : null}

      {stage === "project" ? (
        <>
          <div className="project-entry-bar">
            <button
              type="button"
              className="story-back-button project-back-button"
              onClick={handleOpenVillage}
            >
              탐험 사랑방으로
            </button>
          </div>

          <ProjectHome
            activePage={activePage}
            checkedItems={checkedItems}
            savedCombos={savedCombos}
            savedIds={savedIds}
            selectedCombo={selectedCombo}
            setActivePage={setActivePage}
            setSelectedCombo={setSelectedCombo}
            handleToggleItem={handleToggleItem}
            handleToggleSave={handleToggleSave}
            handleCopyPhrase={handleCopyPhrase}
            handleSpeakPhrase={handleSpeakPhrase}
            speechAvailable={speechAvailable}
            similarCombos={similarCombos}
          />
        </>
      ) : null}
    </div>
  );
}
