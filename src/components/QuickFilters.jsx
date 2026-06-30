const filterIcons = {
  "辛くない": "🥛",
  "夜食": "🌙",
  "甘いもの": "🍰",
  "韓国っぽい": "🇰🇷",
  "5,000ウォン以下": "₩",
  "調理なし": "✨",
};

export default function QuickFilters({ options, activeFilter, onSelect }) {
  return (
    <section className="section">
      <div className="section-heading">
        <h3>かんたんフィルター</h3>
      </div>
      <div className="filter-row" role="tablist" aria-label="quick filters">
        {options.map((option) => {
          const isActive = activeFilter === option;
          return (
            <button
              key={option}
              className={`filter-chip ${isActive ? "active" : ""}`}
              onClick={() => onSelect(isActive ? null : option)}
            >
              <span className="chip-icon" aria-hidden="true">
                {filterIcons[option] || "•"}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
