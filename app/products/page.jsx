'use client';

import { supabase } from '../../supabase/supabaseClient';
import styles from './styles/ProductList.module.css';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import NavBar from '../nav/NavBar';

export default function ProductListPage() {
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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>에러가 발생했습니다: {error.message}</div>;

  return (
    <>
      <NavBar />
      <main style={{ paddingTop: 64 }}>
        <div className={styles.grid}>
          {products.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className={styles.card}
            >
              <img
                src={product.images?.[0] || '/placeholder.png'}
                alt={product.name}
                className={styles.image}
              />
              <h2>{product.name}</h2>
              <p>{product.price?.toLocaleString()}원</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
