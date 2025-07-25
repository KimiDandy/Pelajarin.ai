'use client';

import Link from 'next/link';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

const FinalCTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Pulsating glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] opacity-10" />
      <div className="absolute inset-0 pulsating-glow" />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mb-6">
            Siap Memulai Perjalanan Belajar Anda?
          </h2>
          <p className="text-xl text-[hsl(var(--muted-foreground))] mb-8 max-w-2xl mx-auto">
            Bergabung dengan ribuan pelajar yang telah merancang kurikulum impian mereka dengan bantuan AI kami.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/register">
              <Button className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-[hsl(var(--glow-primary)/0.3)] hover:shadow-[hsl(var(--glow-primary)/0.5)] transition-all duration-300 sheen-animation">
                Mulai Sekarang - Gratis
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
