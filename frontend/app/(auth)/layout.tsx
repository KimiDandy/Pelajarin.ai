import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-abstract opacity-50" />
      <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-xl border border-border/50">
        {children}
      </div>
    </div>
  );
}
