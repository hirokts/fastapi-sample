"use client";

import '@/app/ui/global.css';
import { ProviderAuth0 } from '@/app/providers/provider-auth0';
import { ReactQueryProvider } from '@/app/providers/provider-react-query'

import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} antialiased`}>
        <ProviderAuth0>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </ProviderAuth0>
      </body>
    </html>
  );
}
