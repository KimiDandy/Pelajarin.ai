'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

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
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-card glow-border' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#4361EE]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <motion.div 
          className="text-2xl font-bold text-foreground"
          whileHover={{ scale: 1.05 }}
        >
          <Link href="/" className="text-glow">
            Pelajarin<span className="text-[#4361EE]">.ai</span>
          </Link>
        </motion.div>
        
        <div className="hidden md:flex items-center space-x-8">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link href="#fitur" className="text-foreground hover:text-[#4361EE] transition-colors duration-300">
              Fitur
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link href="#cara-kerja" className="text-foreground hover:text-[#4361EE] transition-colors duration-300">
              Cara Kerja
            </Link>
          </motion.div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            asChild 
            variant="outline"
            className="border-[#4361EE]/30 text-[#F0F2F5] hover:bg-[#4361EE]/20 hover:border-[#4361EE]/50 transition-all duration-300"
          >
            <Link href="/login">Masuk</Link>
          </Button>
          <Button 
            asChild
            className="bg-[#4361EE] text-white hover:bg-[#4361EE]/90 sheen-animation pulsating-glow transition-all duration-300"
          >
            <Link href="/register">Daftar Gratis</Link>
          </Button>
        </div>
      </nav>
    </motion.header>
  );
};

export default LandingNavbar;
