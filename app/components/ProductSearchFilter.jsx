'use client';

import styles from './styles/ProductSearchFilter.module.css';

export default function ProductSearchFilter({
  search,
  category,
  categories,
  priceRange,
  onSearchChange,
  onCategoryChange,
  onPriceChange,
}) {
  return (
    <div className={styles.filterWrap}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="상품명 또는 키워드 검색"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className={styles.categorySelect}
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">전체 카테고리</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div className={styles.priceRange}>
        <input
          type="number"
          className={styles.priceInput}
          placeholder="최소가격"
          value={priceRange[0]}
          min={0}
          onChange={(e) =>
            onPriceChange([Number(e.target.value), priceRange[1]])
          }
        />
        <span className={styles.tilde}>~</span>
        <input
          type="number"
          className={styles.priceInput}
          placeholder="최대가격"
          value={priceRange[1]}
          min={0}
          onChange={(e) =>
            onPriceChange([priceRange[0], Number(e.target.value)])
          }
        />
      </div>
    </div>
  );
}
