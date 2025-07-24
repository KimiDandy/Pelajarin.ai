'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (!storedToken) {
      router.push('/login');
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-lg text-foreground">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">Selamat Datang di Dasbor!</h1>
        <p className="mt-4 text-lg text-foreground/80">Anda telah berhasil masuk.</p>
      </div>
      <div className="mt-8 p-4 bg-card border border-border rounded-md w-full max-w-2xl overflow-auto">
        <p className="font-mono text-sm break-all">
          <strong>Access Token:</strong> {token}
        </p>
      </div>
      <button 
        onClick={handleLogout}
        className="mt-8 px-6 py-3 rounded-md text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors"
      >
        Keluar
      </button>
    </div>
  );
}
