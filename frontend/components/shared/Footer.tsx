'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative bg-[hsl(var(--background))] border-t border-[hsl(var(--border))] py-16 overflow-hidden">
      {/* Glowing horizon line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--glow-primary))] to-transparent opacity-50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--glow-secondary))] to-transparent opacity-30 animate-pulse" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
              Pelajarin.ai
            </h3>
            <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed">
              Platform pembelajaran berbasis AI yang merancang kurikulum otomatis. 
              Belajar apa pun dengan cara yang dipersonalisasi untuk Anda.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-[hsl(var(--foreground))] mb-4">Fitur</h4>
            <ul className="space-y-3 text-sm text-[hsl(var(--muted-foreground))]">
              <li>
                <Link href="#features" className="hover:text-[hsl(var(--primary))] transition-colors duration-300">
                  Kurikulum AI
                </Link>
              </li>
              <li>
                <Link href="#cara-kerja" className="hover:text-[hsl(var(--primary))] transition-colors duration-300">
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="hover:text-[hsl(var(--primary))] transition-colors duration-300">
                  Testimoni
                </Link>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-[hsl(var(--foreground))] mb-4">Dukungan</h4>
            <ul className="space-y-3 text-sm text-[hsl(var(--muted-foreground))]">
              <li>
                <Link href="#faq" className="hover:text-[hsl(var(--primary))] transition-colors duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-[hsl(var(--primary))] transition-colors duration-300">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="#help" className="hover:text-[hsl(var(--primary))] transition-colors duration-300">
                  Bantuan
                </Link>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-[hsl(var(--foreground))] mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-[hsl(var(--muted-foreground))]">
              <li>
                <Link href="#privacy" className="hover:text-[hsl(var(--primary))] transition-colors duration-300">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="#terms" className="hover:text-[hsl(var(--primary))] transition-colors duration-300">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center pt-8 border-t border-[hsl(var(--border))]"
        >
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
            &copy; {new Date().getFullYear()} Pelajarin.ai. Hak cipta dilindungi.
          </p>
          <p className="text-sm bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
            Built by Kimi Dandy Yudanarko & Lina Liliana
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
