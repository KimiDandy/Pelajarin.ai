'use client';

import { motion } from 'framer-motion';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Masukkan Ide Anda',
      description: 'Cukup ketik topik yang ingin Anda pelajari, pilih tingkat kesulitan, dan tentukan tujuan Anda.',
      color: '#4361EE',
    },
    {
      number: '02',
      title: 'AI Merancang Semuanya',
      description: 'Sistem cerdas kami akan menganalisis input Anda dan secara instan menghasilkan kurikulum yang lengkap dan terstruktur.',
      color: '#7209B7',
    },
    {
      number: '03',
      title: 'Mulai Belajar',
      description: 'Nikmati materi pembelajaran yang kaya, kerjakan kuis interaktif, dan lacak kemajuan Anda di dasbor pribadi.',
      color: '#4361EE',
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <section id="cara-kerja" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mb-4 text-glow">
            Hanya Butuh 3 Langkah Mudah
          </h2>
          <p className="text-lg text-[hsl(var(--muted-foreground))]">Mulai perjalanan belajar Anda dalam hitungan menit.</p>
        </motion.div>
        
        <motion.div 
          className="relative flex flex-col md:flex-row items-start justify-center space-y-12 md:space-y-0 md:space-x-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={step.number} 
              variants={itemVariants} 
              className="flex-1 flex flex-col items-center text-center relative"
            >
              <div className="relative mb-6">
                <motion.div 
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-[hsl(var(--glow-primary)/0.3)] glow-border"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {step.number}
                </motion.div>
                
                {/* SVG Connector */}
                {index < steps.length - 1 && (
                  <motion.svg
                    className="hidden md:block absolute top-1/2 -right-4 w-16 h-2 transform -translate-y-1/2"
                    viewBox="0 0 64 8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.3 }}
                    viewport={{ once: true }}
                  >
                    <motion.path
                      d="M 0 4 L 64 4"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: index * 0.3 }}
                      viewport={{ once: true }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                )}
              </div>
              
              <motion.h3 
                className="text-xl font-bold text-[hsl(var(--foreground))] mb-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {step.title}
              </motion.h3>
              
              <motion.p 
                className="text-[hsl(var(--muted-foreground))] leading-relaxed max-w-xs"
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {step.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
