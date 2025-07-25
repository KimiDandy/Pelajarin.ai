'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Mahasiswa Teknik",
    company: "Universitas Indonesia",
    content: "Pelajarin.ai mengubah cara saya belajar! Dari sekadar membaca textbook menjadi memiliki kurikulum lengkap dengan latihan yang dipersonalisasi.",
    rating: 5,
    avatar: "SC"
  },
  {
    id: 2,
    name: "Rizky Pratama",
    role: "Software Developer",
    company: "Startup Jakarta",
    content: "Sebagai developer yang ingin belajar AI/ML, Pelajarin.ai memberikan roadmap yang sangat jelas. Tidak perlu bingung lagi mulai dari mana.",
    rating: 5,
    avatar: "RP"
  },
  {
    id: 3,
    name: "Dewi Kartika",
    role: "Guru Matematika",
    company: "SMA Negeri 1",
    content: "Platform ini sangat membantu saya membuat materi yang lebih interaktif untuk siswa. Kontennya relevan dan mudah dipahami.",
    rating: 5,
    avatar: "DK"
  },
  {
    id: 4,
    name: "Andre Wijaya",
    role: "Product Manager",
    company: "Tech Company",
    content: "Akhirnya ada solusi yang benar-benar memahami kebutuhan belajar modern. Fleksibel, personal, dan sangat efisien!",
    rating: 5,
    avatar: "AW"
  }
];

const TestimonialsSection = () => {
  // Duplicate testimonials for infinite scroll
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimoni" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
            Apa Kata Mereka?
          </h2>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Pengalaman nyata dari mereka yang telah merasakan transformasi belajar dengan AI
          </p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex space-x-8 py-4"
          animate={{
            x: ['0%', '-33.33%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear',
            },
          }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {extendedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="glass-card rounded-xl p-6 glow-border-hover transition-all duration-300 hover:scale-105 flex-shrink-0 w-80 md:w-96"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center font-bold text-white mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-[hsl(var(--foreground))]">{testimonial.name}</h4>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{testimonial.role}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[hsl(var(--primary))] fill-current" />
                ))}
              </div>

              <Quote className="w-6 h-6 text-[hsl(var(--muted-foreground))] mb-3 opacity-50" />
              
              <p className="text-[hsl(var(--foreground))] leading-relaxed text-sm">
                {testimonial.content}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
