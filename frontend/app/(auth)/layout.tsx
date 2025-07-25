import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-background min-h-screen flex items-center justify-center p-4 md:p-6">
      {children}
    </div>
  );
}
