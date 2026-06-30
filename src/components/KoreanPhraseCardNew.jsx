// 일본어 문장과 대응하는 한국어 표현을 보여주는 카드
export default function KoreanPhraseCardNew({ phrase, onCopy, onSpeak, speechAvailable }) {
  return (
    <div className="phrase-card">
      <p className="phrase-ja">{phrase.ja}</p>
      <p className="phrase-ko">{phrase.ko}</p>
      <div className="phrase-actions">
        <button className="tiny-button" onClick={() => onCopy(phrase.ko)}>
          コピー
        </button>
        <button className="tiny-button" onClick={() => onSpeak(phrase.ko)} disabled={!speechAvailable}>
          聞く
        </button>
      </div>
    </div>
  );
}
