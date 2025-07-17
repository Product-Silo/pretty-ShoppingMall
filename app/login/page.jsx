'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import styles from './styles/LoginPage.module.css';

export default function KakaoLoginPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({ provider: 'kakao' });
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  return (
    <div className={styles.loginBox}>
      <h2 className={styles.title}>카카오 소셜 로그인</h2>
      {user ? (
        <div>
          <div className={styles.userInfo}>
            환영합니다!
            <br />
            {user.email || user.user_metadata?.name}
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            로그아웃
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} className={styles.kakaoBtn}>
          카카오로 로그인
        </button>
      )}
    </div>
  );
}
