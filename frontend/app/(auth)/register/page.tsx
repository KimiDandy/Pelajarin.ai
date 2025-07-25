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
    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl backdrop-blur-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Buat Akun Baru</h1>
        <p className="text-neutral-300 mt-2">Mulai perjalanan belajar Anda bersama kami.</p>
      </div>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-neutral-300 mb-2">Nama Lengkap (Opsional)</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            disabled={isLoading}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-foreground placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-foreground placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-foreground placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 disabled:opacity-50"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full text-lg py-3 mt-4 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary))]">
          {isLoading ? 'Memproses...' : 'Buat Akun'}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-neutral-400">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
