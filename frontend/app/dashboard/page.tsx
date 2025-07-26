// d:/Portofolio/Project/pelajarin.ai/frontend/app/dashboard/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/course';
import CourseCard from '@/components/dashboard/CourseCard';
import CourseRow from '@/components/dashboard/CourseRow';
import EmptyState from '@/components/dashboard/EmptyState';
import StatsWidgetPanel from '@/components/dashboard/StatsWidgetPanel';
import { FiLoader } from 'react-icons/fi';

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      const data = await courseService.getCourses();
      // Sort courses by creation date, newest first
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setCourses(data);
    } catch (error: Error | unknown) {
      console.error('Error fetching courses:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal memuat kursus.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Polling mechanism to update status of 'generating' courses
  useEffect(() => {
    const hasGeneratingCourses = courses.some(c => c.status === 'generating');

    if (!hasGeneratingCourses) {
      return; // No need to poll if nothing is generating
    }

    const interval = setInterval(() => {
      console.log('Polling for course status updates...');
      fetchCourses();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [courses, fetchCourses]);

  const handleCourseCreated = () => {
    // No need to set loading, just refetch
    fetchCourses();
  };

  const renderContent = (view: 'grid' | 'list') => {
    if (isLoading && courses.length === 0) {
      return (
        <div className="text-center py-10">
          <FiLoader className="mx-auto h-12 w-12 text-gray-500 animate-spin" />
          <p className="mt-4 text-gray-600">Memuat kursus Anda...</p>
        </div>
      );
    }

    if (error) {
      return <div className="text-center py-10 text-red-600">Error: {error}</div>;
    }

    if (courses.length === 0) {
      return <EmptyState />;
    }

    if (view === 'grid') {
      return (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatePresence>
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <CourseCard course={course} view="grid" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatePresence>
          {courses.map((course, index) => (
            <CourseRow key={course.id} course={course} />
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };



  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div>
      <StatsWidgetPanel courses={courses} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-xl font-bold text-gray-900">Kursus Anda</h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded transition-colors ${view === 'grid' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded transition-colors ${view === 'list' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            List
          </button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {renderContent(view)}
      </motion.div>
    </div>
  );
}

