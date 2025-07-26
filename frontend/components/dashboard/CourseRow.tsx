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
      className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg hover:shadow-primary-teal/10 transition-all duration-300"
    >
      <Link href={`/dashboard/course/${course.id}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{course.title}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-1">{course.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FiClock size={14} />
                <span>Est. 8 jam</span>
              </div>
              <div className="flex items-center gap-1">
                <FiBook size={14} />
                <span>5 modul</span>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                <status.icon size={12} />
                {status.text}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <div className="w-32">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-primary-teal">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-primary-teal to-secondary-sky h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
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
