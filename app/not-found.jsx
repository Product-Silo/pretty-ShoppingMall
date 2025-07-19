import Link from 'next/link';
import style from './404.module.css';

export default function NotFound() {
  return (
    <main className={style.not__main}>
      <h1 className={style.not__h1}>404 - Page Not Found</h1>
      <p className={style.not__text}>
        죄송합니다, 찾고 계신 페이지가 존재하지 않습니다.
      </p>
      <p className={style.not__text}>
        버튼을 누르면 홈화면으로 돌아갑니다.
        <br />
        <button className={style.not__button}>
          <Link href="/">홈화면으로 돌아가기</Link>
        </button>
      </p>
    </main>
  );
}
