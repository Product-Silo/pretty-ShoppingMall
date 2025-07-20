import Link from 'next/link';
import styles from '../styles/Sidebar.module.css';

const menu = [
  { name: '대시보드', href: '/admin' },
  { name: '상품관리', href: '/admin/products' },
  { name: '홈화면으로 이동', href: '/' },
  { name: '설정', href: '/admin/settings' },
];

export default function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>관리자 전용 페이지</div>
      <ul className={styles.menuList}>
        {menu.map((item) => (
          <li key={item.href} className={styles.menuItem}>
            <Link href={item.href} className={styles.menuLink}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
