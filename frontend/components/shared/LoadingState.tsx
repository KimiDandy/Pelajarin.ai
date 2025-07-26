// /components/shared/LoadingState.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ 
  message = "Memuat data...", 
  fullScreen = false 
}: LoadingStateProps) {
  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center"
    : "py-10";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <motion.div
          className="inline-block"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full" />
        </motion.div>
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}
