// 저장한 조합 목록을 보여주는 섹션
export default function SavedCombosNew({ combos, onOpen }) {
  return (
    <section className="section" id="saved">
      <div className="section-heading">
        <h3>保存した組み合わせ</h3>
      </div>
      {combos.length === 0 ? (
        <div className="empty-card">
          <p>まだ保存した組み合わせはありません。</p>
          <span>気になる組み合わせを保存すると、あとでまとめて見返せます。</span>
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
