function peppers(level) {
  if (level <= 0) return "なし";
  return "🌶".repeat(Math.min(level, 4));
}

export default function ComboCard({ combo, isSaved, onOpen, onToggleSave }) {
  return (
    <article className="combo-card" onClick={() => onOpen(combo)} role="button" tabIndex={0}>
      <button
        className={`save-button ${isSaved ? "saved" : ""}`}
        aria-label={isSaved ? "保存を解除" : "保存する"}
        onClick={(event) => {
          event.stopPropagation();
          onToggleSave(combo.id);
        }}
      >
        {isSaved ? "♥" : "♡"}
      </button>
      <div className="combo-image" aria-hidden="true">
        <span>{combo.imageLabel}</span>
      </div>
      <div className="combo-body">
        <h4>{combo.titleJa}</h4>
        <p className="combo-description">{combo.descriptionJa}</p>
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
