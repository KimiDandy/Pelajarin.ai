// d:/Portofolio/Project/pelajarin.ai/frontend/components/dashboard/CourseCard.tsx
'use client';

import { Course } from '@/types/course';
import Link from 'next/link';
import { FiLoader, FiArrowRight } from 'react-icons/fi';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  if (course.status === 'generating') {
    return (
      <div className="bg-gray-800/50 border border-dashed border-gray-600 rounded-lg p-4 animate-pulse">
        <div className="flex items-center space-x-3">
          <FiLoader className="animate-spin text-blue-400" size={20} />
          <div>
            <h3 className="font-bold text-white">Sedang dibuat...</h3>
            <p className="text-sm text-gray-400">AI sedang merancang kurikulum Anda.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link 
      href={`/dashboard/course/${course.id}`}
      className="block bg-gray-800/60 hover:bg-gray-800/90 border border-gray-700 rounded-lg p-5 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg text-white mb-2 truncate pr-4">{course.title}</h3>
      </div>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
      <div className="flex justify-between items-center text-blue-400 font-semibold text-sm group">
        <span>Lihat Kurikulum</span>
        <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
