'use client';

import { useState } from 'react';
import { supabase } from '../../../supabase/supabaseClient';
import styles from '../styles/AdminLogin.module.css';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/admin');
    }
  }

  return (
    <div className={styles.loginWrap}>
      <h2>관리자 로그인</h2>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <input
          className={styles.loginInput}
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={styles.loginInput}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} className={styles.loginBtn}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
        {error && <div className={styles.login_error}>{error}</div>}
        {error && (
          <div className={styles.login_error}>
            에러가 났습니다. <br />
            이메일 혹은 비밀번호를 제대로 입력해주세요
          </div>
        )}
      </form>
    </div>
  );
}
