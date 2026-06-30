// 일본어 안내 페이지 상단 제목과 언어 배지를 보여주는 헤더
export default function HeaderNew() {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">日本語ガイド</p>
        <h1>コンビニ韓国めし</h1>
      </div>
      <span className="lang-chip">日本語</span>
    </header>
  );
}
