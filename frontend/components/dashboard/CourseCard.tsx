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

  const isOptimistic = course.id.startsWith('optimistic-');
  
  const statusInfo = {
    completed: { text: 'Selesai', color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
    generating: { text: isOptimistic ? 'Membuat...' : 'Dalam Proses', color: 'bg-yellow-100 text-yellow-800', icon: FiClock },
    new: { text: 'Baru', color: 'bg-gray-100 text-gray-800', icon: FiPlay }
  };

  const status = statusInfo[course.status as keyof typeof statusInfo] || statusInfo.new;

  if (view === 'list') {
    return (
      <motion.div
        layoutId={`course-card-${course.id}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-black/20 backdrop-blur-lg border border-teal-400/20 rounded-lg shadow-lg hover:border-teal-400/40 hover:shadow-teal-400/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer p-4"
      >
        <Link href={`/dashboard/course/${course.id}`}>
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white text-shadow-subtle truncate pr-4">{course.title}</h3>
                <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                  course.status === 'completed' ? 'bg-green-500/80 text-white' :
                  course.status === 'generating' ? (isOptimistic ? 'bg-blue-500/80 text-white animate-pulse' : 'bg-yellow-500/80 text-white') :
                  course.status === 'failed' ? 'bg-red-500/80 text-white' :
                  'bg-gray-500/80 text-white'
                } text-shadow-subtle`}>
                  {course.status === 'completed' ? 'Selesai' :
                   course.status === 'generating' ? (isOptimistic ? 'Membuat...' : 'Dalam Proses') :
                   course.status === 'failed' ? 'Gagal' :
                   'Draft'}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-3 text-shadow-subtle line-clamp-2">{course.description}</p>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <FiClock size={16} className="text-teal-400" />
                  <span className="text-shadow-subtle">Est. 8 jam</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FiBook size={16} className="text-purple-400" />
                  <span className="text-shadow-subtle">5 modul</span>
                </div>
              </div>
            </div>
            
            <div className="w-40 flex-shrink-0">
              <div className="text-sm font-medium text-gray-300 mb-2 text-shadow-subtle text-right">{Math.round(progress)}%</div>
              <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-teal-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
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
      layoutId={`course-card-${course.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-black/20 backdrop-blur-lg border border-teal-400/20 rounded-lg shadow-lg hover:border-teal-400/40 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      <Link href={`/dashboard/course/${course.id}`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-white line-clamp-2 text-shadow-subtle">{course.title}</h3>
            <status.icon className="w-5 h-5 text-gray-300 flex-shrink-0 ml-2" />
          </div>
          
          <p className="text-gray-300 text-sm mb-4 line-clamp-3 text-shadow-subtle">{course.description}</p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                <span>{isOptimistic ? 'Baru saja' : new Date(course.created_at).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiBook className="w-4 h-4" />
                <span>{isOptimistic ? 'Sedang dibuat' : '0 modul'}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-300 text-shadow-subtle">Progress</span>
                <span className="text-sm font-medium text-gray-300 text-shadow-subtle">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-teal-400 to-purple-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                course.status === 'completed' ? 'bg-green-500/80 text-white' :
                course.status === 'generating' ? 'bg-yellow-500/80 text-white' :
                course.status === 'failed' ? 'bg-red-500/80 text-white' :
                'bg-gray-500/80 text-white'
              }`}>
                {status.text}
              </span>
              <span className="text-xs text-gray-400">
                0/5 selesai
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
