'use client';

import { motion } from 'framer-motion';
import { FiBook, FiClock, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

interface StatsWidgetPanelProps {
  courses: any[];
}

export default function StatsWidgetPanel({ courses }: StatsWidgetPanelProps) {
  const activeCourses = courses.filter(course => course.status === 'completed' || course.status === 'generating').length;
  const totalLearningHours = courses.reduce((total, course) => {
    return total + (course.estimated_hours || 0);
  }, 0);
  const masteredTopics = courses.reduce((total, course) => {
    return total + (course.completed_modules || 0);
  }, 0);

  const stats = [
    {
      title: 'Kursus Aktif',
      value: activeCourses,
      icon: FiBook,
      color: 'from-teal-500 to-sky-500',
    },
    {
      title: 'Total Jam Belajar',
      value: totalLearningHours,
      icon: FiClock,
      color: 'from-blue-500 to-indigo-500',
      suffix: ' jam',
    },
    {
      title: 'Topik Dikuasai',
      value: masteredTopics,
      icon: FiCheckCircle,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Progress Terakhir',
      value: '75%',
      icon: FiTrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-black/20 backdrop-blur-lg border border-teal-400/20 rounded-lg shadow-lg hover:border-teal-400/40 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center p-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
              index % 2 === 0 ? 'bg-teal-400/80' : 'bg-purple-400/80'
            }`}>
              <stat.icon size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-300 mb-1 text-shadow-subtle">{stat.title}</p>
              <p className="text-2xl font-bold text-white text-shadow-subtle">
                {stat.value}{stat.suffix}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
