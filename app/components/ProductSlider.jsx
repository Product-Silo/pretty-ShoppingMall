'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './styles/ProductSlider.module.css';

export default function ProductSlider({ products }) {
  return (
    <Swiper
      className={styles.productSwiper}
      modules={[Navigation]}
      navigation
      spaceBetween={24}
      slidesPerView={3}
      breakpoints={{
        0: { slidesPerView: 1 },
        600: { slidesPerView: 2 },
        900: { slidesPerView: 3 },
      }}
    >
      {products.map((p) => (
        <SwiperSlide key={p.id}>
          <div className={styles.productCard}>
            <img src={p.image} alt={p.name} className={styles.productImg} />
            <div className={styles.productInfo}>
              <span className={styles.productTag}>{p.tag}</span>
              <h3>{p.name}</h3>
              <p className={styles.productPrice}>
                {p.price.toLocaleString()}원
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
