// d:/Portofolio/Project/pelajarin.ai/frontend/components/dashboard/CourseCard.tsx
'use client';

import { Course } from '@/types/course';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClock, FiBook, FiPlay, FiCheckCircle } from 'react-icons/fi';

interface CourseCardProps {
  course: Course;
  view: 'grid' | 'list';
}

export default function CourseCard({ course, view }: CourseCardProps) {
  // Default progress calculation based on status
  const progress = course.status === 'completed' ? 100 : 
                   course.status === 'generating' ? 0 : 0;

  const statusInfo = {
    completed: { text: 'Selesai', color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
    generating: { text: 'Dalam Proses', color: 'bg-yellow-100 text-yellow-800', icon: FiClock },
    new: { text: 'Baru', color: 'bg-gray-100 text-gray-800', icon: FiPlay }
  };

  const status = statusInfo[course.status as keyof typeof statusInfo] || statusInfo.new;

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg p-4 shadow-sm hover:glow-shadow-teal transition-all duration-300"
      >
        <Link href={`/dashboard/course/${course.id}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{course.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FiClock size={14} />
                  <span>Est. 8 jam</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiBook size={14} />
                  <span>5 modul</span>
                </div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.text}
                </span>
              </div>
            </div>
            
            <div className="w-32 ml-4">
              <div className="text-sm font-medium text-gray-700 mb-1">{Math.round(progress)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-sky-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm hover:glow-shadow-teal transition-all duration-300 transform hover:-translate-y-1"
    >
      <Link href={`/dashboard/course/${course.id}`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
            <status.icon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FiClock size={16} />
                <span>Est. 8 jam</span>
              </div>
              <div className="flex items-center gap-2">
                <FiBook size={16} />
                <span>5 modul</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-teal-500 to-sky-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                {status.text}
              </span>
              <span className="text-xs text-gray-500">
                0/5 selesai
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
