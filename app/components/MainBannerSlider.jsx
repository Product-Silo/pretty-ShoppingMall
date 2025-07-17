'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './styles/MainBannerSlider.module.css';

export default function MainBannerSlider({ slides }) {
  return (
    <Swiper
      className={styles.bannerSwiper}
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      loop
      pagination={{ clickable: true }}
    >
      {slides.map((slide, idx) => (
        <SwiperSlide key={idx}>
          <div className={styles.bannerItem}>
            <img src={slide.image} alt={slide.alt} />
            <div className={styles.bannerText}>{slide.text}</div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
