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
    <section className="relative min-h-screen flex items-center justify-center bg-transparent">
      <motion.div
        className="container mx-auto flex flex-col items-center justify-center text-center px-6 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--foreground))] via-[hsl(var(--primary))] to-[hsl(var(--secondary))] max-w-4xl leading-tight md:leading-snug text-glow"
          variants={itemVariants}
        >
          Ubah Topik Apapun Menjadi{' '}
          <span className="block md:inline">Kurikulum Lengkap</span>{' '}
          <span className="block md:inline">dalam Sekejap</span>
        </motion.h1>
        
        <motion.p 
          className="mt-6 text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl leading-relaxed"
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
              className="bg-[hsl(var(--primary))] text-white px-8 py-4 text-lg rounded-full sheen-animation pulsating-glow hover:bg-[hsl(var(--primary))/0.9] transition-all duration-300 transform hover:scale-105"
            >
              Mulai Perjalanan Belajar
            </Button>
          </Link>
        </motion.div>
        
        {/* AI Process Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="flex items-center space-x-6 text-sm">
            {/* Topic Input */}
            <motion.div
              className="flex flex-col items-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 360],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center text-white font-bold">
                T
              </div>
              <span className="mt-2 text-[hsl(var(--muted-foreground))]">Topik</span>
            </motion.div>

            {/* Arrow */}
            <motion.div
              className="w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]"
              animate={{ scaleX: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* AI Processing */}
            <motion.div
              className="flex flex-col items-center"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--primary))] flex items-center justify-center">
                <motion.div
                  className="w-6 h-6 border-2 border-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <span className="mt-2 text-[hsl(var(--muted-foreground))]">AI</span>
            </motion.div>

            {/* Arrow */}
            <motion.div
              className="w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--primary))]"
              animate={{ scaleX: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />

            {/* Curriculum Output */}
            <motion.div
              className="flex flex-col items-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--primary))] flex items-center justify-center text-white font-bold">
                K
              </div>
              <span className="mt-2 text-[hsl(var(--muted-foreground))]">Kurikulum</span>
            </motion.div>
          </div>
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
