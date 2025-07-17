import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from './config/ReactQueryProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: '예뻐지자',
  description: '쇼핑몰 웹사이트',
};

// recoilprovider 감싸기는 body 기준입니다.

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
