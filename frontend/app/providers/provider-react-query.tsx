"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  // クライアントコンポーネントでのみQueryClientを作成
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60000, // デフォルトの鮮度時間を1分に設定
      }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}