import styles from './styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.siteName}>PRETTY BEAUTY</div>
      <div className={styles.copy}>
        © 2024 PRETTY BEAUTY. All rights reserved.
      </div>
      <div className={styles.contact}>문의: prettybeauty@example.com</div>
    </footer>
  );
}
