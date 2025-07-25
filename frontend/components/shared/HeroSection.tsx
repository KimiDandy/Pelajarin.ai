'use client';

import Link from 'next/link';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center aurora-bg">
      <motion.div
        className="container mx-auto flex flex-col items-center justify-center text-center px-6 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F0F2F5] via-[#4361EE] to-[#7209B7] max-w-4xl leading-tight md:leading-snug text-glow"
          variants={itemVariants}
        >
          Ubah Topik Apapun Menjadi{' '}
          <span className="block md:inline">Kurikulum Lengkap</span>{' '}
          <span className="block md:inline">dalam Sekejap</span>
        </motion.h1>
        
        <motion.p 
          className="mt-6 text-lg md:text-xl text-[#A0AEC0] max-w-2xl leading-relaxed"
          variants={itemVariants}
        >
          Platform pembelajaran berbasis AI yang secara otomatis merancang silabus, materi, dan kuis yang dipersonalisasi khusus untuk Anda.
        </motion.p>
        
        <motion.div
          variants={itemVariants}
          className="mt-10"
        >
          <Link href="/register">
            <Button 
              size="lg"
              className="bg-[#4361EE] text-white px-8 py-4 text-lg rounded-full sheen-animation pulsating-glow hover:bg-[#4361EE]/90 transition-all duration-300 transform hover:scale-105"
            >
              Mulai Perjalanan Belajar
            </Button>
          </Link>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="mt-8 flex items-center space-x-4 text-sm text-[#A0AEC0]"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#4361EE] rounded-full animate-pulse" />
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#7209B7] rounded-full animate-pulse" />
            <span>Personalized</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#F0F2F5] rounded-full animate-pulse" />
            <span>Instant</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
