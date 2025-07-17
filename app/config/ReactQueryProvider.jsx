'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * React Query Provider
 * - 앱 전체에서 React Query를 사용할 수 있도록 QueryClientProvider로 감쌉니다.
 * - Next.js app/layout.jsx에서 서버 컴포넌트 제한을 우회하기 위해 별도 분리.
 */
export default function ReactQueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
