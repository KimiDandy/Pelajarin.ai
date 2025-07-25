import React from 'react';
import InteractiveBackground from '@/components/shared/InteractiveBackground';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Interactive Background with particle system */}
      <InteractiveBackground />
      
      {/* Main content container - single column centered */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
