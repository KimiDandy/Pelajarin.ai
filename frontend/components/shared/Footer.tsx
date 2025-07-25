'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-[#02040A] border-t border-[#4361EE]/20 relative overflow-hidden">
      {/* Glowing horizon line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4361EE]/50 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#7209B7]/30 to-transparent animate-pulse" />
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-[#F0F2F5] mb-2 text-glow">Pelajarin.ai</h3>
              <p className="text-sm text-[#A0AEC0]">Tutor Pribadi Cerdas Anda</p>
              <p className="text-xs text-[#A0AEC0]/70 mt-4 max-w-xs">
                Platform AI yang mempersonalisasi pembelajaran untuk setiap individu dengan kurikulum yang dirancang khusus.
              </p>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h4 
              className="font-semibold text-[#F0F2F5] mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Navigasi
            </motion.h4>
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link href="#fitur" className="block text-[#A0AEC0] hover:text-[#4361EE] transition-colors duration-300">Fitur</Link>
              <Link href="#cara-kerja" className="block text-[#A0AEC0] hover:text-[#4361EE] transition-colors duration-300">Cara Kerja</Link>
              <Link href="#" className="block text-[#A0AEC0] hover:text-[#4361EE] transition-colors duration-300">Harga</Link>
              <Link href="#" className="block text-[#A0AEC0] hover:text-[#4361EE] transition-colors duration-300">Tentang</Link>
            </motion.div>
          </div>

          {/* Support */}
          <div>
            <motion.h4 
              className="font-semibold text-[#F0F2F5] mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Dukungan
            </motion.h4>
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link href="/login" className="block text-[#A0AEC0] hover:text-[#4361EE] transition-colors duration-300">Masuk</Link>
              <Link href="/register" className="block text-[#A0AEC0] hover:text-[#4361EE] transition-colors duration-300">Daftar</Link>
              <Link href="#" className="block text-[#A0AEC0] hover:text-[#4361EE] transition-colors duration-300">Bantuan</Link>
              <Link href="#" className="block text-[#A0AEC0] hover:text-[#4361EE] transition-colors duration-300">Kontak</Link>
            </motion.div>
          </div>

          {/* Legal */}
          <div>
            <motion.h4 
              className="font-semibold text-[#F0F2F5] mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Legal
            </motion.h4>
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="#" className="block text-[#A0AEC0] hover:text-[#4361EE] transition-colors duration-300">Privasi</Link>
              <Link href="#" className="block text-[#A0AEC0] hover:text-[#4361EE] transition-colors duration-300">Ketentuan</Link>
              <Link href="#" className="block text-[#A0AEC0] hover:text-[#4361EE] transition-colors duration-300">Cookie</Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom copyright */}
        <motion.div 
          className="mt-12 pt-8 border-t border-[#4361EE]/20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-[#A0AEC0]/70">
            &copy; {new Date().getFullYear()} Pelajarin.ai. Semua Hak Cipta Dilindungi.
          </p>
          <p className="text-xs text-[#A0AEC0]/50 mt-2">
            Dibuat dengan ❤️ untuk revolusi pembelajaran
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
