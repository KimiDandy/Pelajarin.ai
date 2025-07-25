import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Kolom Kiri: Visual Branding */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-primary/30 via-background to-background border-r border-white/10">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-300">
            Pelajarin.ai
          </h1>
          <p className="mt-4 text-lg text-neutral-300 max-w-sm">
            Satu langkah lagi untuk membuka potensi belajar tak terbatas dengan kekuatan AI.
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Form Container */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-background/80 backdrop-blur-sm">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
