export default function ConvenienceGuide({ guides }) {
  return (
    <section className="section" id="guide">
      <div className="section-heading">
        <h3>韓国コンビニの使い方</h3>
      </div>
      <div className="guide-grid">
        {guides.map((guide) => (
          <article key={guide.id} className="guide-card">
            <h4>{guide.title}</h4>
            <ol>
              {guide.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p>{guide.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
