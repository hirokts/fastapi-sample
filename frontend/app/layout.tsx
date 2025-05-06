"use client";

import '@/app/ui/global.css';
import { ReactQueryProvider } from '@/app/providers/provider-react-query'
import { SupabaseAuthProvider } from '@/app/providers/provider-supabase-auth';

import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} antialiased`}>
        <SupabaseAuthProvider>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
