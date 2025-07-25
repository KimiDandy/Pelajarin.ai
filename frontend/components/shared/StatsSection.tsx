'use client';

import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Users, BookOpen, Award, Zap } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const AnimatedNumber = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start((i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.1 }
      }));
    }
  }, [controls, inView]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      custom={0}
    >
      {value.toLocaleString()}
    </motion.span>
  );
};

const CountingNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

import { useState } from 'react';

const stats: StatItem[] = [
  {
    icon: <Users className="w-8 h-8" />,
    value: 15000,
    suffix: '+',
    label: 'Pelajar Aktif',
    color: 'primary',
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    value: 5000,
    suffix: '+',
    label: 'Topik Dipelajari',
    color: 'secondary',
  },
  {
    icon: <Award className="w-8 h-8" />,
    value: 98,
    suffix: '%',
    label: 'Tingkat Kepuasan',
    color: 'accent',
  },
  {
    icon: <Zap className="w-8 h-8" />,
    value: 24,
    suffix: '/7',
    label: 'Dukungan AI',
    color: 'primary',
  },
];

const StatsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="statistik" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
            Bukti Nyata
          </h2>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Hasil nyata dari ribuan pelajar yang telah mengalami transformasi belajar
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-6 text-center glow-border hover:glow-border-hover transition-all duration-300"
            >
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--{stat.color}))] to-[hsl(var(--{stat.color})/0.7)] flex items-center justify-center mx-auto mb-4 text-white"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {stat.icon}
              </motion.div>
              
              <motion.div
                className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <CountingNumber value={stat.value} suffix={stat.suffix} />
              </motion.div>
              
              <p className="text-[hsl(var(--muted-foreground))]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
