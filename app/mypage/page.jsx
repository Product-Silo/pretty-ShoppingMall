'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase/supabaseClient';
import styles from './styles/Mypage.module.css';

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace('/login');
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (!user) return null;

  return (
    <div className={styles.mypageWrap}>
      <h2 className={styles.title}>마이페이지</h2>
      <div className={styles.infoBox}>
        <div>
          <b>이름/이메일:</b> {user.user_metadata?.name || user.email}
        </div>
        <div>
          <b>가입일:</b> {new Date(user.created_at).toLocaleDateString('ko-KR')}
        </div>
      </div>
      <div className={styles.btnGroup}>
        <a href="/" className={styles.actionBtn}>
          홈으로
        </a>
        <a href="/wishlist" className={styles.actionBtn}>
          찜 리스트
        </a>
      </div>
      <button
        className={styles.logoutBtn}
        onClick={() => supabase.auth.signOut()}
      >
        로그아웃
      </button>
    </div>
  );
}
