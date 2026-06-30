const items = [
  { id: "top", label: "ホーム" },
  { id: "combos", label: "探す" },
  { id: "saved", label: "保存" },
  { id: "guide", label: "使い方" },
];

export default function BottomNavigation() {
  const handleMove = (id) => {
    const target = id === "top" ? window.document.body : document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="bottom-nav" aria-label="bottom navigation">
      {items.map((item) => (
        <button key={item.id} onClick={() => handleMove(item.id)}>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
