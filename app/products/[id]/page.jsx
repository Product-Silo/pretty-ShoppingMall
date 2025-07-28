'use client';

import { supabase } from '../../../supabase/supabaseClient';
import styles from '../styles/ProductDetail.module.css';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import NavBar from '../../nav/NavBar';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) setProduct(data);
      setLoading(false);
    }
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 500);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>상품을 찾을 수 없습니다.</div>;

  const inquiryBtn = (
    <button
      className={isMobile ? styles.inquiryBtnFixed : styles.inquiryBtn}
      onClick={() => {
        window.open(
          `https://open.kakao.com/o/sfke2PCh?ref=${encodeURIComponent(
            product.name
          )}`,
          '_blank'
        );
      }}
    >
      카카오톡 문의하기
    </button>
  );

  return (
    <>
      <NavBar />
      <main style={{ paddingTop: 64, paddingBottom: isMobile ? 70 : 0 }}>
        {isMobile ? (
          <>
            <div className={styles.infoMobile}>
              <h1>{product.name}</h1>
              <p className={styles.price}>
                {product.price?.toLocaleString()}원
              </p>
              <p className={styles.desc}>{product.description}</p>
            </div>
            <div className={styles.images}>
              {product.images && product.images.length > 0 ? (
                product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={product.name}
                    className={styles.image}
                  />
                ))
              ) : (
                <img
                  src="/placeholder.png"
                  alt="no image"
                  className={styles.image}
                />
              )}
            </div>
            {inquiryBtn}
          </>
        ) : (
          <div className={styles.detail}>
            <div className={styles.images}>
              {product.images && product.images.length > 0 ? (
                product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={product.name}
                    className={styles.image}
                  />
                ))
              ) : (
                <img
                  src="/placeholder.png"
                  alt="no image"
                  className={styles.image}
                />
              )}
            </div>
            <div className={styles.info}>
              <h1>{product.name}</h1>
              <p className={styles.price}>
                {product.price?.toLocaleString()}원
              </p>
              <p className={styles.desc}>{product.description}</p>
              {inquiryBtn}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
