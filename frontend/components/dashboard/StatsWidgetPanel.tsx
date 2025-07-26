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
          className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl hover:shadow-primary-teal/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}{stat.suffix}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
