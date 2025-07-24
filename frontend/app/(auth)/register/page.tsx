'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.register({ email, password, full_name: fullName || undefined });
      toast.success('Registrasi berhasil! Silakan masuk.');
      router.push('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold text-foreground mb-2">Buat Akun Baru</h1>
      <p className="text-foreground/70 mb-6">Mulai perjalanan belajar Anda bersama kami.</p>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-foreground/80 mb-1">Nama Lengkap (Opsional)</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            disabled={isLoading}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:ring-primary focus:border-primary disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:ring-primary focus:border-primary disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:ring-primary focus:border-primary disabled:opacity-50"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full mt-4">
          {isLoading ? 'Memproses...' : 'Buat Akun'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-foreground/70">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
