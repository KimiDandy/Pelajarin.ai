// d:/Portofolio/Project/pelajarin.ai/frontend/app/dashboard/course/[id]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { courseService } from '@/services/courseService';
import { CourseDetail } from '@/types/course';
import CurriculumAccordion from '@/components/course/CurriculumAccordion';
import { FiLoader, FiAlertTriangle, FiCheckCircle, FiAward, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string>('');

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setCourseId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  const fetchCourseDetails = useCallback(async () => {
    if (!courseId) return;
    try {
      const data = await courseService.getCourseById(courseId);
      console.log('--- DEBUG: Data Received from API ---', data);
      setCourse(data);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat detail kursus. Mungkin tidak ditemukan atau Anda tidak memiliki izin.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId, fetchCourseDetails]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FiLoader className="mx-auto h-12 w-12 text-gray-500 animate-spin" />
        <p className="mt-4 text-white">Memuat detail kurikulum...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-400">
        <FiAlertTriangle className="mx-auto h-12 w-12" />
        <p className="mt-4">Error: {error}</p>
        <Link href="/dashboard" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Kembali ke Dasbor
        </Link>
      </div>
    );
  }

  if (!course) {
    return null; // Should be covered by error state, but as a fallback
  }

  return (
    <div className="max-w-5xl">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{course.title}</h1>
        <div className="prose prose-invert max-w-none text-gray-300 mb-8">
          <ReactMarkdown>{course.description}</ReactMarkdown>
        </div>

        {course.learning_outcomes && course.learning_outcomes.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-5">Tujuan Pembelajaran</h2>
            <ul className="space-y-3">
              {course.learning_outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-white mb-5">Kurikulum</h2>
        <CurriculumAccordion modules={course.modules} courseId={course.id} />

        {course.final_assessment && (
          <div className="mt-10 pt-8 border-t border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-5">Ujian Akhir</h2>
            <div className="bg-gray-900/70 rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center">
                <FiAward className="w-8 h-8 text-yellow-400 mr-4" />
                <div>
                  <h3 className="font-bold text-lg text-white">{course.final_assessment.title}</h3>
                  <p className="text-sm text-gray-400">Uji pemahaman Anda secara keseluruhan.</p>
                </div>
              </div>
              <button 
                className="group relative inline-flex items-center justify-center px-6 py-2.5 text-base font-semibold text-white bg-gradient-primary rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:bg-none disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
                disabled
              >
                <span>Mulai Ujian</span>
                <FiArrowRight className="w-5 h-5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
