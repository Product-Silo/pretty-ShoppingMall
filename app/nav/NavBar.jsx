'use client';

import styles from './styles/NavBar.module.css';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import Link from 'next/link';

export default function NavBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({ provider: 'kakao' });
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <a href="/">PRETTY BEAUTY</a>
      </div>
      <div className={styles.rightMenu}>
        {user ? (
          <>
            <span className={styles.userInfo}>
              반가워요 {user.user_metadata?.name || user.email}님!
            </span>
            <button className={styles.linkBtn} onClick={handleLogout}>
              로그아웃
            </button>
            <Link href="/mypage" className={styles.linkBtn}>
              마이페이지
            </Link>
            <Link href="/wishlist" className={styles.linkBtn}>
              찜 리스트
            </Link>
          </>
        ) : (
          <button className={styles.linkBtn} onClick={handleLogin}>
            로그인
          </button>
        )}
      </div>
    </nav>
  );
}
