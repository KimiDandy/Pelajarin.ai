'use client';

import Link from 'next/link';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

const FinalCTASection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Pulsating glow background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#4361EE] opacity-20 blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#7209B7] opacity-20 blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto text-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F0F2F5] mb-6 text-glow">
            Siap Merevolusi Cara Anda Belajar?
          </h2>
          
          <motion.p 
            className="text-xl text-[#A0AEC0] mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Bergabung dengan ribuan pelajar yang telah mengubah cara mereka belajar dengan AI yang dipersonalisasi.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/register">
              <Button className="mt-8 px-12 py-6 text-xl font-semibold sheen-animation bg-[#4361EE] hover:bg-[#4361EE]/90 text-white rounded-full shadow-[0_0_30px_rgba(67,97,238,0.5)] hover:shadow-[0_0_50px_rgba(67,97,238,0.7)] transform hover:scale-105 transition-all duration-300">
                Daftar Gratis Sekarang
              </Button>
            </Link>
          </motion.div>
          
          <motion.p 
            className="text-sm text-[#A0AEC0] mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            Tidak perlu kartu kredit • Gratis selamanya untuk fitur dasar
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
