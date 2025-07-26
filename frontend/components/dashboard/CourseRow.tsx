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
      className="bg-white/70 backdrop-blur-md rounded-lg shadow-sm hover:shadow-lg hover:shadow-primary-teal/10 transition-all duration-300"
    >
      <Link href={`/dashboard/course/${course.id}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{course.title}</h3>
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
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                course.status === 'completed' ? 'bg-status-completed text-white' :
                course.status === 'generating' ? 'bg-status-inprogress text-white' :
                course.status === 'failed' ? 'bg-red-500 text-white' :
                'bg-gray-100 text-gray-800'
              }`}>
                {course.status === 'completed' ? 'Selesai' :
                 course.status === 'generating' ? 'Dalam Proses' :
                 course.status === 'failed' ? 'Gagal' :
                 'Draft'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <div className="w-32">
              <div className="text-sm font-medium text-gray-700 mb-1">{Math.round(progress)}%</div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-teal to-secondary-sky h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-xs text-gray-500">
                {Math.round(progress * 5 / 100)}/5 selesai
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
