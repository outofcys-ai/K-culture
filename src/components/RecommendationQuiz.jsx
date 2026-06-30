const questions = [
  {
    key: "mood",
    label: "今の気分は？",
    options: [
      { label: "ごはん系", icon: "🍙" },
      { label: "甘いもの", icon: "🍮" },
      { label: "辛いもの", icon: "🌶" },
      { label: "軽く食べたい", icon: "🥪" },
      { label: "韓国っぽい体験", icon: "🇰🇷" },
    ],
  },
  {
    key: "spice",
    label: "辛いものは大丈夫？",
    options: [
      { label: "辛くないものがいい", icon: "🥛" },
      { label: "少しならOK", icon: "🙂" },
      { label: "辛いもの大好き", icon: "🔥" },
    ],
  },
  {
    key: "place",
    label: "どこで食べる？",
    options: [
      { label: "ホテル", icon: "🏨" },
      { label: "コンビニ店内", icon: "🏪" },
      { label: "外で食べる", icon: "🌿" },
      { label: "移動中", icon: "🚉" },
    ],
  },
];

export default function RecommendationQuiz({ answers, onAnswer, results, onOpen }) {
  return (
    <section className="section" id="quiz">
      <div className="section-heading">
        <h3>3つの質問でおすすめを探す</h3>
      </div>
      <div className="quiz-card">
        {questions.map((question) => (
          <div key={question.key} className="quiz-block">
            <p>{question.label}</p>
            <div className="option-row">
              {question.options.map((option) => {
                const active = answers[question.key] === option.label;
                return (
                  <button
                    key={option.label}
                    className={`option-chip ${active ? "active" : ""}`}
                    onClick={() => onAnswer(question.key, option.label)}
                  >
                    <span className="chip-icon" aria-hidden="true">
                      {option.icon}
                    </span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {results.length > 0 && (
        <div className="quiz-results">
          {results.map((combo) => (
            <button key={combo.id} className="result-card" onClick={() => onOpen(combo)}>
              <strong>{combo.titleJa}</strong>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
