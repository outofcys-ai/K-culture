import ComboCard from "./ComboCard";

export default function ComboGrid({ title, combos, savedIds, onOpen, onToggleSave }) {
  return (
    <section className="section">
      <div className="section-heading">
        <h3>{title}</h3>
        <p>{combos.length}件</p>
      </div>
      <div className="combo-grid">
        {combos.map((combo) => (
          <ComboCard
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
