'use client';

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans ${
        isDashboard 
          ? 'bg-[#F8F9FC] text-gray-900'
          : 'bg-background text-foreground bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsla(242,70%,50%,0.3),transparent)]'
      }`}>
        {!isDashboard && <div className="scroll-glow" />}
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
