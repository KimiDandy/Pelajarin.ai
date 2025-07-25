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
          <h2 className="text-4xl md:text-5xl font-bold text-[#F0F2F5] mb-4 text-glow">
            Hanya Butuh 3 Langkah Mudah
          </h2>
          <p className="text-lg text-[#A0AEC0]">Mulai perjalanan belajar Anda dalam hitungan menit.</p>
        </motion.div>
        
        <div className="relative">
          {/* Animated connecting line */}
          <motion.div 
            className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-[#4361EE] via-[#7209B7] to-[#4361EE]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            viewport={{ once: true }}
            style={{ transformOrigin: 'left' }}
          />
          
          <motion.div 
            className="relative grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {steps.map((step, index) => (
              <motion.div key={step.number} variants={itemVariants} className="relative">
                <motion.div 
                  className="text-center glass-card rounded-2xl p-8 group hover:border-[#4361EE]/50 transition-all duration-300"
                  whileHover={{ y: -10 }}
                >
                  <motion.div 
                    className="flex items-center justify-center mb-6"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div 
                      className="relative flex items-center justify-center h-24 w-24 rounded-full border-2 font-bold text-2xl text-glow"
                      style={{ 
                        borderColor: step.color,
                        color: step.color,
                        boxShadow: `0 0 30px ${step.color}40, inset 0 0 30px ${step.color}20`
                      }}
                    >
                      {step.number}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ 
                          background: `radial-gradient(circle, ${step.color}20 0%, transparent 70%)`,
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-[#F0F2F5] mb-3 group-hover:text-glow transition-all duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-[#A0AEC0] leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
