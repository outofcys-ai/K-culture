// 조합에 필요한 구매 품목을 체크리스트로 보여주는 섹션
export default function ShoppingListNew({ combo, checkedItems, onToggle }) {
  return (
    <div className="detail-block">
      <h4>買うもの</h4>
      <div className="shopping-list">
        {combo.products.map((product) => {
          const checked = checkedItems.includes(product.nameKo);
          return (
            <label key={product.nameKo} className="shopping-item">
              <input type="checkbox" checked={checked} onChange={() => onToggle(product.nameKo)} />
              {product.imageUrl ? (
                <img className="shopping-thumb" src={product.imageUrl} alt={product.nameJa} loading="lazy" />
              ) : null}
              <span>
                <strong>{product.nameJa}</strong>
                <small>韓国語: {product.nameKo}</small>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
