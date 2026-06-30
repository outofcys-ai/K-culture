// 조합 카드 목록과 개수를 보여주는 공통 그리드 섹션
import ComboCardNew from "./ComboCardNew";

export default function ComboGridNew({ title, combos, savedIds, onOpen, onToggleSave }) {
  return (
    <section className="section">
      <div className="section-heading">
        <h3>{title}</h3>
        <p>{combos.length}件</p>
      </div>
      <div className="combo-grid">
        {combos.map((combo) => (
          <ComboCardNew
            key={combo.id}
            combo={combo}
            isSaved={savedIds.includes(combo.id)}
            onOpen={onOpen}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>
    </section>
  );
}
