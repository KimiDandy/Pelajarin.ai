// /components/shared/ErrorState.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
  title?: string;
  message?: string;
}

export function ErrorState({ 
  error, 
  onRetry, 
  title = "Terjadi Kesalahan",
  message = "Maaf, terjadi kesalahan saat memuat data."
}: ErrorStateProps) {
  return (
    <div className="text-center py-10 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        
        {error.message && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md mb-4">
            {error.message}
          </p>
        )}
        
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
