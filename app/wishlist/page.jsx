'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import styles from './styles/Wishlist.module.css';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', wishlist);
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, [wishlist]);

  if (loading) return <div className={styles.loading}>로딩 중...</div>;

  return (
    <div className={styles.wishlistWrap}>
      <div className={styles.btnGroup}>
        <a href="/" className={styles.actionBtn}>
          홈으로
        </a>
        <a href="/mypage" className={styles.actionBtn}>
          마이페이지
        </a>
      </div>
      <h2 className={styles.title}>찜 리스트</h2>
      {products.length === 0 ? (
        <div className={styles.empty}>찜한 상품이 없습니다.</div>
      ) : (
        <div className={styles.grid}>
          {products.map((p) => (
            <div key={p.id} className={styles.card}>
              <img
                src={p.images?.[0] || '/placeholder.png'}
                alt={p.name}
                className={styles.image}
              />
              <div className={styles.info}>
                <h3>{p.name}</h3>
                <p className={styles.price}>{p.price?.toLocaleString()}원</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
