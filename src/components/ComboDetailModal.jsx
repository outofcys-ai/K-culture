import KoreanPhraseCard from "./KoreanPhraseCard";
import ShoppingList from "./ShoppingList";

export default function ComboDetailModal({
  combo,
  isSaved,
  checkedItems,
  onClose,
  onToggleSave,
  onToggleItem,
  onCopyPhrase,
  similarCombos,
  onOpenSimilar,
}) {
  if (!combo) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="閉じる">
          ×
        </button>
        <div className="modal-image">{combo.imageLabel}</div>
        <div className="modal-header">
          <div>
            <p className="eyebrow">韓国語: {combo.titleKo}</p>
            <h3>{combo.titleJa}</h3>
            <p>{combo.descriptionJa}</p>
          </div>
          <button className={`save-button large ${isSaved ? "saved" : ""}`} onClick={() => onToggleSave(combo.id)}>
            {isSaved ? "♥ 保存中" : "♡ 保存"}
          </button>
        </div>

        <div className="detail-facts">
          <span>{combo.priceRange}</span>
          <span>{combo.spicyLabelJa}</span>
          <span>{combo.time}</span>
          <span>{combo.difficultyJa}</span>
        </div>

        <ShoppingList combo={combo} checkedItems={checkedItems} onToggle={onToggleItem} />

        <div className="detail-block">
          <h4>食べ方</h4>
          <ol className="detail-list">
            {combo.stepsJa.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="detail-block">
          <h4>旅行中のメモ</h4>
          <p>{combo.noteJa}</p>
        </div>

        <div className="detail-block">
          <h4>スタッフに見せるフレーズ</h4>
          <div className="phrase-grid">
            {combo.koreanPhrases.map((phrase) => (
              <KoreanPhraseCard key={phrase.ja} phrase={phrase} onCopy={onCopyPhrase} />
            ))}
          </div>
        </div>

        <div className="detail-block">
          <h4>似ているコンボ</h4>
          <div className="saved-list">
            {similarCombos.map((item) => (
              <button key={item.id} className="saved-item" onClick={() => onOpenSimilar(item)}>
                <strong>{item.titleJa}</strong>
                <span>{item.priceRange}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
