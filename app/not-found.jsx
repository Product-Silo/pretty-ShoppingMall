import Link from 'next/link';
import style from './404.module.css';

export default function NotFound() {
  return (
    <main className={style.not__main}>
      <h1 className={style.not__h1}>404 - Page Not Found</h1>
      <p className={style.not__text}>
        Sorry, the page you are looking for does not exist.
      </p>
      <p className={style.not__text}>
        You can go back to the
        <br />
        <button className={style.not__button}>
          <Link href="/">home page</Link>
        </button>
      </p>
    </main>
  );
}
