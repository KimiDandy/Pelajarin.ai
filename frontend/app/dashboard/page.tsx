// d:/Portofolio/Project/pelajarin.ai/frontend/app/dashboard/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/course';
import CourseCreationForm from '@/components/dashboard/CourseCreationForm';
import CourseCard from '@/components/dashboard/CourseCard';
import EmptyState from '@/components/dashboard/EmptyState';
import { FiLoader, FiLogOut } from 'react-icons/fi';
import { authUtils } from '@/lib/auth';

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
    } catch (err: any) {
      setError('Sesi Anda mungkin telah berakhir. Silakan logout dan login kembali.');
      console.error(err);
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

  const renderContent = () => {
    if (isLoading && courses.length === 0) {
      return (
        <div className="text-center py-10">
          <FiLoader className="mx-auto h-12 w-12 text-gray-500 animate-spin" />
          <p className="mt-4 text-white">Memuat kursus Anda...</p>
        </div>
      );
    }

    if (error) {
      return <div className="text-center py-10 text-red-400">Error: {error}</div>;
    }

    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Kursus Anda</h2>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    );
  };

  const handleLogout = () => {
    authUtils.logout();
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
      <CourseCreationForm onCourseCreated={handleCourseCreated} />
      {renderContent()}
    </main>
  );
}

