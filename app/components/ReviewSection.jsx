import styles from './styles/ReviewSection.module.css';

const reviews = [
  {
    id: 1,
    image: '/product1.jpg',
    name: '[Best🔥] 1+1+1 스카치 라인 와이드 팬츠',
    rating: 4.8,
    reviewCount: 214,
    text: '제가 평소 34인치이상 입는데 그 이상 덩어리분들도 편하게 입을 사이즈입니다!',
    user: '네이버 페이 구매자',
    option: '버건디/L',
    date: '02.27',
  },
  {
    id: 2,
    image: '/product2.jpg',
    name: '체드 빈티지 브러쉬 워싱 와이드 데님 팬츠',
    rating: 5.0,
    reviewCount: 27,
    text: '저번에 바지 구매했는데 너무 좋아서 이번에는 와이드 팬츠 구매해봤는데 너무 좋아요!! 마음에 듭니다.',
    user: '****',
    option: '연청/L',
    date: '01.23',
  },
  {
    id: 3,
    image: '/product3.jpg',
    name: '[BEST⚡] 1+1+1 우지 스웻 사이드 배색 팬츠',
    rating: 4.8,
    reviewCount: 750,
    text: '처음 시켜보는데 믿고 시켜도 될 거 같아요 😊',
    user: '버건디 L',
    option: '',
    date: '09.08',
  },
  {
    id: 4,
    image: '/product4.jpg',
    name: '[1+1+1할인] 스타일몽 나일론 고프 윈드브레이커',
    rating: 4.6,
    reviewCount: 17,
    text: '마감처리가 아쉽고 사이즈가 더 컸으면 좋았을거 같지만 옷 자체는 이뻐요',
    user: '****',
    option: '단일상품-블랙/FREE',
    date: '07.17',
  },
];

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span>
      {'★'.repeat(full)}
      {half ? '☆' : ''}
      {'☆'.repeat(empty)}
    </span>
  );
}

export default function ReviewSection() {
  return (
    <section className={styles.reviewSection}>
      <h2 className={styles.title}>상품 사용후기</h2>
      <div className={styles.subtitle}>소중한 구매후기 입니다</div>
      <div className={styles.reviewGrid}>
        {reviews.map((r) => (
          <div key={r.id} className={styles.reviewCard}>
            <img src={r.image} alt={r.name} className={styles.productImg} />
            <div className={styles.productName}>{r.name}</div>
            <div className={styles.ratingRow}>
              <span className={styles.ratingNum}>평점 {r.rating}</span>
              <span className={styles.stars}>{renderStars(r.rating)}</span>
              <span className={styles.reviewCount}>리뷰 {r.reviewCount}개</span>
            </div>
            <div className={styles.text}>{r.text}</div>
            <div className={styles.meta}>
              <span>{r.user}</span>
              {r.option && <span className={styles.option}> | {r.option}</span>}
              <span className={styles.date}>{r.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
