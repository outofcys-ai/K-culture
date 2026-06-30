export default function SavedCombos({ combos, onOpen }) {
  return (
    <section className="section" id="saved">
      <div className="section-heading">
        <h3>保存したコンボ</h3>
      </div>
      {combos.length === 0 ? (
        <div className="empty-card">
          <p>まだ保存したコンボはありません。</p>
          <span>気になるコンボを保存して、旅行中にすぐ見られるようにしましょう。</span>
        </div>
      ) : (
        <div className="saved-list">
          {combos.map((combo) => (
            <button key={combo.id} className="saved-item" onClick={() => onOpen(combo)}>
              <strong>{combo.titleJa}</strong>
              <span>{combo.priceRange}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
