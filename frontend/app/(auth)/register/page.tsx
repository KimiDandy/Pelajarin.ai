'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { AuthInput } from '@/components/auth/AuthInput';
import { validateEmail, validatePassword, validateName } from '@/lib/authValidation';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-10 shadow-2xl shadow-primary/10"
    >
      {/* Glowing accent border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-50 blur-xl -z-10" />
      
      <div className="text-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
        >
          Buat Akun Baru
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-neutral-300 mt-3 text-lg"
        >
          Mulai petualangan belajar yang bercahaya bersama kami!
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <AuthInput
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Nama lengkap Anda"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
            autoComplete="name"
            icon={<User className="w-5 h-5" />}
            validate={validateName}
            validationMessage="Nama hanya boleh berisi huruf dan spasi"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <AuthInput
            id="email"
            name="email"
            type="email"
            placeholder="email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
            icon={<Mail className="w-5 h-5" />}
            validate={validateEmail}
            validationMessage="Masukkan email yang valid"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <AuthInput
            id="password"
            name="password"
            type="password"
            placeholder="Minimal 8 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="new-password"
            icon={<Lock className="w-5 h-5" />}
            validate={validatePassword}
            validationMessage="Password minimal 8 karakter dengan huruf dan angka"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full text-lg py-4 mt-2 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary))] hover:shadow-primary/30"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" size={20} />
                Memproses...
              </span>
            ) : (
              'Mulai Petualangan'
            )}
          </Button>
        </motion.div>
      </form>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8 text-center text-sm text-neutral-400"
      >
        Sudah punya akun?{' '}
        <Link 
          href="/login" 
          className="font-medium text-primary hover:text-primary/80 transition-colors hover:underline"
        >
          Masuk dan lanjutkan perjalananmu
        </Link>
      </motion.p>
    </motion.div>
  );
}
