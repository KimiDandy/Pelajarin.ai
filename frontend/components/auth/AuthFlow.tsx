'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import AuthInfographic from './AuthInfographic';
import RegisterForm from '@/components/auth/RegisterForm';
import LoginForm from '@/components/auth/LoginForm';

interface AuthFlowProps {
  initialView?: 'register' | 'login';
}

export default function AuthFlow({ initialView }: AuthFlowProps) {
  const [view, setView] = useState<'login' | 'register'>(initialView || 'login');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null);
  const router = useRouter();

  const handleRegisterSuccess = () => {
    setIsTransitioning(true);
    setNotification({
      type: 'success',
      title: 'Registrasi Berhasil!',
      message: 'Mengalihkan ke halaman login...'
    });
    setTimeout(() => {
      setView('login');
      setNotification(null);
      setIsTransitioning(false);
    }, 2000);
  };

  const handleRegisterError = (error: string) => {
    setNotification({
      type: 'error',
      title: 'Registrasi Gagal',
      message: error
    });
  };

  const handleLoginSuccess = () => {
    setNotification({
      type: 'success',
      title: 'Login Berhasil!',
      message: 'Mengarahkan ke dashboard...'
    });
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const handleLoginError = (error: string) => {
    setNotification({
      type: 'error',
      title: 'Login Gagal',
      message: error
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className={`flex flex-col lg:flex-row gap-8 items-center justify-center ${
        view === 'register' ? 'lg:flex-row' : 'lg:flex-row-reverse'
      }`}>
        {/* Form Panel */}
        <motion.div 
          layout
          className="w-full lg:w-1/2 max-w-md"
        >
          <AnimatePresence mode="wait">
            {view === 'register' ? (
              <RegisterForm 
                key="register"
                onSuccess={handleRegisterSuccess}
                onSwitchToLogin={() => setView('login')}
                onError={handleRegisterError}
              />
            ) : (
              <LoginForm 
                key="login"
                onSuccess={handleLoginSuccess}
                onSwitchToRegister={() => setView('register')}
                onError={handleLoginError}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Infographic Panel */}
        <motion.div 
          layout
          className="w-full lg:w-1/2 max-w-md"
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

      {/* Transition overlay */}
      <AnimatePresence>
        {/* Notification Modal */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setNotification(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    notification.type === 'success' 
                      ? 'bg-gradient-to-br from-green-400 to-blue-500' 
                      : notification.type === 'error'
                      ? 'bg-gradient-to-br from-red-400 to-pink-500'
                      : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                  }`}>
                    {notification.type === 'success' && <CheckCircle className="w-8 h-8 text-white" />}
                    {notification.type === 'error' && <XCircle className="w-8 h-8 text-white" />}
                    {notification.type === 'info' && <AlertCircle className="w-8 h-8 text-white" />}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{notification.title}</h3>
                  <p className="text-gray-600 text-sm">{notification.message}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transition Overlay */}
        <AnimatePresence>
          {isTransitioning && !notification && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/20 backdrop-blur-sm z-40 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl p-8 shadow-2xl"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Memproses...</h3>
                  <p className="text-gray-600">Mohon tunggu sebentar</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}
