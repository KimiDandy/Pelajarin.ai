'use client';

import { BeakerIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline';
import FeatureCard from './FeatureCard';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <SparklesIcon className="h-8 w-8" />,
    title: 'Struktur Otomatis',
    description: 'Dapatkan peta jalan belajar yang logis dan terstruktur secara otomatis, dari dasar hingga mahir.',
    color: '#4361EE',
  },
  {
    icon: <BeakerIcon className="h-8 w-8" />,
    title: 'Personalisasi Mendalam',
    description: 'Kurikulum dibuat khusus untuk Anda, menyesuaikan dengan tingkat keahlian dan tujuan belajar Anda.',
    color: '#7209B7',
  },
  {
    icon: <BookOpenIcon className="h-8 w-8" />,
    title: 'Pembelajaran Interaktif',
    description: 'Materi yang kaya visual dan kuis interaktif untuk menjaga Anda tetap terlibat dan termotivasi.',
    color: '#F0F2F5',
  },
];

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="fitur" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#F0F2F5] mb-4 text-glow">
            Mengapa Memilih Pelajarin.ai?
          </h2>
          <p className="text-lg text-[#A0AEC0] max-w-2xl mx-auto">
            Platform kami dirancang untuk membuat belajar menjadi lebih efisien dan menyenangkan.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description}
                color={feature.color}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
