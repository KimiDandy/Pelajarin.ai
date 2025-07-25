import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Pelajarin.ai - Tutor Pribadi Cerdas Anda',
  description: 'Ubah topik apapun menjadi kurikulum lengkap dengan AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-background text-foreground bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsla(242,70%,50%,0.3),transparent)]`}>
        <div className="scroll-glow" />
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
