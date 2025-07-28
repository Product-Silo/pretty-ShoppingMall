import styles from './styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.siteName}>PRETTY BEAUTY</div>
      <div className={styles.copy}>
        © 2025 PRETTY BEAUTY. All rights reserved.
      </div>
      <div className={styles.contact}>
        개발 문의: know.warehouse02@gmail.com
      </div>
      <div className={styles.contact}>
        택배비 별도, 15만원 이상 구매시 택배비 무료
      </div>
    </footer>
  );
}
