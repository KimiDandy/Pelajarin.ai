// d:/Portofolio/Project/pelajarin.ai/frontend/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/course';
import CourseCard from '@/components/dashboard/CourseCard';
import CourseRow from '@/components/dashboard/CourseRow';
import EmptyState from '@/components/dashboard/EmptyState';
import StatsWidgetPanel from '@/components/dashboard/StatsWidgetPanel';
import { QueryStateHandler } from '@/components/shared/QueryStateHandler';

export default function DashboardPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const coursesQuery = useQuery<Course[], Error>({
    queryKey: ['courses'],
    queryFn: courseService.getCourses,
    refetchInterval: (query) => {
      const data = query.state.data as Course[] | undefined;
      const isGenerating = data?.some(course =>
        ['generating', 'blueprint_completed', 'generating_content'].includes(course.status)
      );
      return isGenerating ? 5000 : false;
    },
  });

  const renderContent = (view: 'grid' | 'list', courses: Course[]) => {
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
          {courses.map((course) => (
            <CourseRow key={course.id} course={course} />
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div>
      <StatsWidgetPanel courses={coursesQuery.data || []} />
      
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
        <QueryStateHandler query={coursesQuery}>
          {(courses) => {
            const sorted = [...courses].sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            return renderContent(view, sorted);
          }}
        </QueryStateHandler>
      </motion.div>
    </div>
  );
}

