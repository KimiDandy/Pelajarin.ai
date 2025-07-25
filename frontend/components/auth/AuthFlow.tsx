'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AuthInfographic from './AuthInfographic';
import RegisterForm from '@/components/auth/RegisterForm';
import LoginForm from '@/components/auth/LoginForm';

interface AuthFlowProps {
  initialView?: 'register' | 'login';
}

export default function AuthFlow({ initialView = 'register' }: AuthFlowProps) {
  const [view, setView] = useState<'register' | 'login'>(initialView);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleRegisterSuccess = () => {
    setIsTransitioning(true);
    toast.success('Registrasi berhasil! Silakan login dengan akun Anda.');
    
    // Add a small delay for the toast to be visible
    setTimeout(() => {
      setView('login');
      setIsTransitioning(false);
    }, 1500);
  };

  const handleLoginSuccess = () => {
    toast.success('Login berhasil! Mengarahkan ke dashboard...');
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
        {/* Form Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: view === 'register' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: view === 'register' ? 50 : -50 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeInOut",
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-md">
              {view === 'register' ? (
                <RegisterForm onSuccess={handleRegisterSuccess} />
              ) : (
                <LoginForm onSuccess={handleLoginSuccess} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Info Panel - Always visible on desktop, hidden on mobile */}
        <div className="hidden lg:flex items-center justify-center">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: view === 'register' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeInOut",
              delay: 0.1
            }}
            className="w-full"
          >
            <AuthInfographic />
          </motion.div>
        </div>

        {/* Mobile Info Panel - Only shown when view is register */}
        {view === 'register' && (
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <AuthInfographic />
            </motion.div>
          </div>
        )}
      </div>

      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/20 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Registrasi Berhasil!</h3>
                <p className="text-gray-600">Mengalihkan ke halaman login...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
