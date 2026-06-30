export default function HeroSection({ onPrimary, onSecondary }) {
  return (
    <section className="hero-section">
      <p className="hero-kicker">韓国旅行中でもすぐ選べる</p>
      <h2>韓国コンビニで何を買う？</h2>
      <p className="hero-copy">
        迷ったら、気分に合わせておすすめコンボを選ぼう。
      </p>
      <div className="hero-actions">
        <button className="primary-button" onClick={onPrimary}>
          おすすめを見る
        </button>
        <button className="secondary-button" onClick={onSecondary}>
          辛くないものを見る
        </button>
      </div>
    </section>
  );
}
