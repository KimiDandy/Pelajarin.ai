'use client';

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');
  
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans ${
        isDashboard 
          ? 'bg-[#F8F9FC] text-gray-900'
          : 'bg-background text-foreground bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsla(242,70%,50%,0.3),transparent)]'
      }`}>
        <QueryClientProvider client={queryClient}>
          {!isDashboard && <div className="scroll-glow" />}
          <Toaster position="top-center" reverseOrder={false} />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
