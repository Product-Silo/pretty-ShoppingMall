'use client';

import { useState, useEffect } from 'react';
import NavBar from './nav/NavBar';
import MainBannerSlider from './components/MainBannerSlider';
import ProductSearchFilter from './components/ProductSearchFilter';
import WishlistButton from './components/WishlistButton';
import styles from './page.module.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase/supabaseClient';
import Link from 'next/link';
import ReviewSection from './components/ReviewSection';
import Footer from './components/Footer';

const bannerSlides = [
  {
    image: '/banner1.jpg',
    alt: '뷰티 화보',
    text: (
      <>
        <h2>
          여성스러운 무드의
          <br />
          여름 뷰티 신상
        </h2>
        <p>20~40대 여성을 위한 트렌디 뷰티</p>
      </>
    ),
  },
  {
    image: '/banner2.jpg',
    alt: '이벤트',
    text: (
      <>
        <h3>
          6월 한정
          <br />
          뷰티 페스티벌
        </h3>
        <button className={styles.bannerBtn}>이벤트 보기</button>
      </>
    ),
  },
  {
    image: '/banner3.jpg',
    alt: '베스트셀러',
    text: (
      <>
        <h3>베스트셀러</h3>
        <button className={styles.bannerBtn}>더보기</button>
      </>
    ),
  },
];

const categories = ['팔찌', '목걸이', '신상품', '베스트'];

export default function Home() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [wishlist, setWishlist] = useState([]);

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name?.includes(search) || p.tag?.includes(search);
    const matchCategory = !category || p.category === category;
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchSearch && matchCategory && matchPrice;
  });

  const handleToggleWish = (id) => {
    setWishlist((wish) =>
      wish.includes(id) ? wish.filter((w) => w !== id) : [...wish, id]
    );
  };

  return (
    <>
      <NavBar />
      <main className={styles.main} style={{ paddingTop: 64 }}>
        <section className={styles.categorySection}>
          <ProductSearchFilter
            search={search}
            category={category}
            categories={categories}
            priceRange={priceRange}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onPriceChange={setPriceRange}
          />
        </section>
        <section className={styles.bannerSection}>
          <MainBannerSlider slides={bannerSlides} />
        </section>

        <section className={styles.productSection}>
          <h2 className={styles.sectionTitle}>추천 상품</h2>
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>에러가 발생했습니다: {error.message}</div>
          ) : (
            <div className={styles.productGrid}>
              {filteredProducts.map((p) => (
                <Link
                  href={`/products/${p.id}`}
                  key={p.id}
                  className={styles.productCard}
                >
                  <img
                    src={p.images?.[0] || '/placeholder.png'}
                    alt={p.name}
                    className={styles.productImg}
                  />
                  <div className={styles.productInfo}>
                    <span className={styles.productTag}>{p.tag}</span>
                    <h3>{p.name}</h3>
                    <p className={styles.productPrice}>
                      {p.price?.toLocaleString()}원
                    </p>
                    <WishlistButton
                      id={p.id}
                      isWished={wishlist.includes(p.id)}
                      onToggleWish={handleToggleWish}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <ReviewSection />
      <Footer />
    </>
  );
}
