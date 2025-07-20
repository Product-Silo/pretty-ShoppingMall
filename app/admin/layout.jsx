import Sidebar from './nav/Sidebar';
import styles from './styles/AdminLayout.module.css';

export default function AdminLayout({ children }) {
  return (
    <div className={styles.layoutWrap}>
      <Sidebar />
      <main className={styles.contentWrap}>{children}</main>
    </div>
  );
}
