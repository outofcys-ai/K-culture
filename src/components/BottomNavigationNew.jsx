// 본편 화면 하단 탭 이동을 담당하는 네비게이션
const items = [
  { id: "home", label: "ホーム", icon: "🏠" },
  { id: "find", label: "探す", icon: "📍" },
  { id: "saved", label: "保存", icon: "♥" },
  { id: "guide", label: "使い方", icon: "💡" },
];

export default function BottomNavigationNew({ activePage, onChangePage }) {
  const handleMove = (id) => {
    onChangePage(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="bottom-nav" aria-label="bottom navigation">
      {items.map((item) => (
        <button
          key={item.id}
          className={activePage === item.id ? "active" : ""}
          onClick={() => handleMove(item.id)}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
