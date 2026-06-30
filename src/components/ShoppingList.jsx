export default function ShoppingList({ combo, checkedItems, onToggle }) {
  return (
    <div className="detail-block">
      <h4>買い物リスト</h4>
      <div className="shopping-list">
        {combo.products.map((product) => {
          const checked = checkedItems.includes(product.nameKo);
          return (
            <label key={product.nameKo} className="shopping-item">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(product.nameKo)}
              />
              <span>
                <strong>{product.nameJa}</strong>
                <small>韓国語: {product.nameKo}</small>
                <em>{product.noteJa}</em>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
