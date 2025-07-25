'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    question: "Apa itu Pelajarin.ai?",
    answer: "Pelajarin.ai adalah platform pembelajaran berbasis AI yang secara otomatis merancang kurikulum lengkap berdasarkan topik yang Anda inginkan. Kami menggunakan teknologi AI canggih untuk menciptakan silabus, materi, dan latihan yang dipersonalisasi sesuai kebutuhan Anda."
  },
  {
    id: 2,
    question: "Bagaimana cara kerja Pelajarin.ai?",
    answer: "Cukup masukkan topik yang ingin Anda pelajari, dan AI kami akan menganalisis kebutuhan Anda, membuat roadmap belajar, serta menyediakan materi yang relevan. Anda bisa belajar dengan kecepatan sendiri dan mendapatkan rekomendasi yang terus diperbarui."
  },
  {
    id: 3,
    question: "Apakah Pelajarin.ai gratis?",
    answer: "Kami menawarkan versi gratis dengan fitur dasar untuk memulai. Untuk akses ke fitur premium seperti kurikulum yang lebih mendalam, analitik belajar, dan dukungan prioritas, kami memiliki paket berlangganan yang terjangkau."
  },
  {
    id: 4,
    question: "Apakah saya bisa belajar topik teknis seperti pemrograman?",
    answer: "Tentu! Pelajarin.ai mendukung berbagai topik dari yang umum hingga yang sangat teknis. Baik Anda ingin belajar pemrograman, data science, desain grafis, atau bahkan keterampilan non-teknis seperti manajemen waktu."
  },
  {
    id: 5,
    question: "Bagaimana jika saya ingin mengubah fokus belajar?",
    answer: "Platform kami sangat fleksibel. Anda bisa menyesuaikan fokus belajar kapan saja. AI akan menyesuaikan kurikulum Anda secara otomatis berdasarkan perubahan minat atau tujuan baru Anda."
  },
  {
    id: 6,
    question: "Apakah materi diperbarui secara berkala?",
    answer: "Ya, konten kami terus diperbarui dengan informasi terkini. AI kami memantau perkembangan terbaru di setiap bidang untuk memastikan Anda mendapatkan pengetahuan yang relevan dan up-to-date."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mb-6">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Temukan jawaban atas pertanyaan umum tentang Pelajarin.ai
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[hsl(var(--background)/0.5)] transition-colors duration-300 relative"
              >
                <div className="flex items-center space-x-4">
                  {/* Glowing vertical line */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--secondary))]"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: openIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                    {item.question}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="relative"
                >
                  <ChevronDown className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: openIndex === index ? 1.5 : 0, opacity: openIndex === index ? 0 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden relative"
                  >
                    <div className="px-6 pb-4 pl-10">
                      <motion.p
                        className="text-[hsl(var(--muted-foreground))] leading-relaxed"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {item.answer}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
