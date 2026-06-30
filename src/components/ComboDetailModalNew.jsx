// 선택한 조합의 상세 정보와 구매 목록을 보여주는 모달
import KoreanPhraseCardNew from "./KoreanPhraseCardNew";
import ShoppingListNew from "./ShoppingListNew";

export default function ComboDetailModalNew({
  combo,
  isSaved,
  checkedItems,
  onClose,
  onToggleSave,
  onToggleItem,
  onCopyPhrase,
  onSpeakPhrase,
  speechAvailable,
  similarCombos,
  onOpenSimilar,
}) {
  if (!combo) return null;

  const imageItems = combo.products.filter((product) => product.imageUrl).slice(0, 6);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="閉じる">
          ×
        </button>
        <div className="modal-image">
          <div className={`combo-image-grid combo-image-grid-${Math.min(imageItems.length, 4)} modal-image-grid`}>
            {imageItems.map((product) => (
              <img key={product.nameKo} src={product.imageUrl} alt={product.nameJa} loading="lazy" />
            ))}
          </div>
        </div>
        <div className="modal-header">
          <div>
            <p className="eyebrow">韓国語: {combo.titleKo}</p>
            <h3>{combo.titleJa}</h3>
          </div>
          <button className={`save-button large ${isSaved ? "saved" : ""}`} onClick={() => onToggleSave(combo.id)}>
            {isSaved ? "保存済み" : "保存"}
          </button>
        </div>

        <div className="detail-facts">
          <span>{combo.priceRange}</span>
          <span>{combo.spicyLabelJa}</span>
          <span>{combo.time}</span>
          <span>{combo.difficultyJa}</span>
        </div>

        <ShoppingListNew combo={combo} checkedItems={checkedItems} onToggle={onToggleItem} />

        <div className="detail-block">
          <h4>食べ方</h4>
          <ol className="detail-list">
            {combo.stepsJa.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="detail-block">
          <h4>韓国語フレーズ</h4>
          <div className="phrase-grid">
            {combo.koreanPhrases.map((phrase) => (
              <KoreanPhraseCardNew
                key={phrase.ja}
                phrase={phrase}
                onCopy={onCopyPhrase}
                onSpeak={onSpeakPhrase}
                speechAvailable={speechAvailable}
              />
            ))}
          </div>
        </div>

        <div className="detail-block">
          <h4>似ている組み合わせ</h4>
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
