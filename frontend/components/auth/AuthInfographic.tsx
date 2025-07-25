'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  Target, 
  Zap,
  BookOpen,
  Users,
  Award,
  TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Personalisasi',
    description: 'Kurikulum yang disesuaikan dengan gaya belajar Anda'
  },
  {
    icon: Target,
    title: 'Asesmen Cerdas',
    description: 'Evaluasi adaptif untuk hasil belajar optimal'
  },
  {
    icon: Zap,
    title: 'Konten Instan',
    description: 'Akses materi premium dalam hitungan detik'
  },
  {
    icon: Users,
    title: 'Komunitas Aktif',
    description: 'Bergabung dengan 50.000+ pelajar Indonesia'
  },
  {
    icon: Award,
    title: 'Sertifikasi',
    description: 'Dapatkan sertifikat resmi untuk portofolio'
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Pantau perkembangan belajar secara real-time'
  }
];

export default function AuthInfographic() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/5 backdrop-blur-sm border border-indigo-200/20 rounded-2xl shadow-xl p-8 h-full"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-4"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Kenapa Memilih Pelajarin.ai?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-gray-600 text-lg"
        >
          Platform belajar AI yang dirancang untuk masa depan
        </motion.p>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center">
              <feature.icon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <BookOpen className="w-4 h-4" />
          <span>Lebih dari 1 juta pelajaran telah diselesaikan</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
