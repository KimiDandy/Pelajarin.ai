'use client';

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 shadow-md backdrop-blur-lg' : 'bg-transparent'}`}>
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="text-2xl font-bold text-foreground">
          <Link href="/">Pelajarin.ai</Link>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#fitur" className="text-foreground hover:text-primary transition-colors">Fitur</Link>
          <Link href="#cara-kerja" className="text-foreground hover:text-primary transition-colors">Cara Kerja</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Daftar Gratis</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default LandingNavbar;
