'use client';

import styles from './styles/WishlistButton.module.css';

export default function WishlistButton({ id, isWished, onToggleWish }) {
  return (
    <button
      className={styles.wishBtn + (isWished ? ' ' + styles.active : '')}
      onClick={() => onToggleWish(id)}
      aria-label={isWished ? '위시리스트에서 제거' : '위시리스트에 추가'}
      type="button"
    >
      <span className={styles.heart}>{isWished ? '♥' : '♡'}</span>
    </button>
  );
}
