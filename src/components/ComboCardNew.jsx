// 편의점 조합 요약 카드를 일본어 라벨로 렌더링하는 컴포넌트
function peppers(level) {
  if (level <= 0) return "なし";
  return "🌶".repeat(Math.min(level, 4));
}

export default function ComboCardNew({ combo, isSaved, onOpen, onToggleSave }) {
  const imageItems = combo.products.filter((product) => product.imageUrl).slice(0, 4);

  return (
    <article className="combo-card" onClick={() => onOpen(combo)} role="button" tabIndex={0}>
      <button
        className={`save-button ${isSaved ? "saved" : ""}`}
        aria-label={isSaved ? "保存を外す" : "保存する"}
        onClick={(event) => {
          event.stopPropagation();
          onToggleSave(combo.id);
        }}
      >
        {isSaved ? "★" : "☆"}
      </button>
      <div className="combo-image">
        {imageItems.length > 0 ? (
          <div className={`combo-image-grid combo-image-grid-${Math.min(imageItems.length, 4)}`}>
            {imageItems.map((product) => (
              <img key={product.nameKo} src={product.imageUrl} alt={product.nameJa} loading="lazy" />
            ))}
          </div>
        ) : null}
      </div>
      <div className="combo-body">
        <h4>{combo.titleJa}</h4>
        <div className="price-line">{combo.priceRange}</div>
        <div className="meta-grid">
          <span>辛さ {peppers(combo.spicyLevel)}</span>
          <span>{combo.spicyLabelJa}</span>
          <span>{combo.time}</span>
          <span>{combo.difficultyJa}</span>
        </div>
        <div className="tag-row">
          {combo.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
