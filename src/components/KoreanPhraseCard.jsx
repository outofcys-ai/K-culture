export default function KoreanPhraseCard({ phrase, onCopy }) {
  return (
    <div className="phrase-card">
      <p className="phrase-ja">{phrase.ja}</p>
      <p className="phrase-ko">{phrase.ko}</p>
      <button className="tiny-button" onClick={() => onCopy(phrase.ko)}>
        韓国語をコピー
      </button>
    </div>
  );
}
