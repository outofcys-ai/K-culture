// 한국 편의점 이용 팁을 일본어로 보여주는 가이드 섹션
export default function ConvenienceGuideNew({ guides }) {
  return (
    <section className="section" id="guide">
      <div className="section-heading">
        <h3>韓国コンビニ利用ガイド</h3>
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
