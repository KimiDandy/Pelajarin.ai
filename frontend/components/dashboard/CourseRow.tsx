'use client';

import { Course } from '@/types/course';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClock, FiBook, FiPlay, FiCheckCircle } from 'react-icons/fi';

interface CourseRowProps {
  course: Course;
}

export default function CourseRow({ course }: CourseRowProps) {
  const progress = course.status === 'completed' ? 100 : 
                   course.status === 'generating' ? 0 : 
                   course.progress || 0;

  const statusInfo = {
    completed: { text: 'Selesai', color: 'bg-status-completed/10 text-status-completed', icon: FiCheckCircle },
    generating: { text: 'Dalam Proses', color: 'bg-status-inprogress/10 text-status-inprogress', icon: FiClock },
    new: { text: 'Baru', color: 'bg-status-new/10 text-status-new', icon: FiPlay }
  };

  const status = statusInfo[course.status as keyof typeof statusInfo] || statusInfo.new;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-black/20 backdrop-blur-lg border border-teal-400/20 rounded-lg shadow-lg hover:border-teal-400/40 hover:shadow-teal-400/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer p-4"
    >
      <Link href={`/dashboard/course/${course.id}`}>
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white text-shadow-subtle truncate pr-4">{course.title}</h3>
              <span className={`px-3 py-1.5 text-xs font-medium rounded-full text-shadow-subtle ${
                course.status === 'completed' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                course.status === 'generating' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                course.status === 'failed' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                'bg-gray-500/20 text-gray-300 border border-gray-500/30'
              }`}>
                {course.status === 'completed' ? 'Selesai' :
                 course.status === 'generating' ? 'Dalam Proses' :
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
          
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="w-40">
              <div className="text-sm font-medium text-gray-300 mb-2 text-shadow-subtle text-right">{Math.round(progress)}%</div>
              <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-teal-400 to-purple-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-xs text-gray-400 text-shadow-subtle">
                {Math.round(progress * 5 / 100)}/5 selesai
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
