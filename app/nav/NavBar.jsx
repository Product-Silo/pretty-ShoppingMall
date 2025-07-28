'use client';

import styles from './styles/NavBar.module.css';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import Link from 'next/link';

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => listener?.subscription.unsubscribe();
  }, []);

  // 모바일 여부 감지
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 500);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 메뉴 오픈 시 body 스크롤 방지
  useEffect(() => {
    if (menuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, isMobile]);

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({ provider: 'kakao' });
  };

  const handleLogout = () => {
    supabase.auth.signOut();
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <a href="/">PRETTY BEAUTY</a>
        </div>
        <div className={styles.rightMenu}>
          {/* PC/태블릿: 오른쪽 메뉴 */}
          {!isMobile && (
            <div className={styles.desktopMenu}>
              {user ? (
                <>
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
          )}
        </div>
        {/* 모바일: 햄버거 버튼은 항상 nav의 맨 마지막에 위치 */}
        {isMobile && (
          <button
            className={styles.hamburger}
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen((v) => !v)}
            style={{ zIndex: 202 }}
          >
            <span />
            <span />
            <span />
          </button>
        )}
      </nav>
      {/* 모바일: 메뉴/오버레이는 nav 바깥에 렌더링 */}
      {isMobile && menuOpen && (
        <>
          <div
            className={styles.mobileMenuOverlay}
            onClick={() => setMenuOpen(false)}
            style={{ zIndex: 200 }}
          />
          <div
            className={styles.mobileMenu + ' ' + styles.open}
            style={{ zIndex: 201 }}
          >
            {user ? (
              <div className={styles.navbar_mo_contian}>
                <button className={styles.linkBtn} onClick={handleLogout}>
                  로그아웃
                </button>
                <Link
                  href="/mypage"
                  className={styles.linkBtn}
                  onClick={() => setMenuOpen(false)}
                >
                  마이페이지
                </Link>
                <Link
                  href="/wishlist"
                  className={styles.linkBtn}
                  onClick={() => setMenuOpen(false)}
                >
                  찜 리스트
                </Link>
              </div>
            ) : (
              <button className={styles.linkBtn} onClick={handleLogin}>
                로그인
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
