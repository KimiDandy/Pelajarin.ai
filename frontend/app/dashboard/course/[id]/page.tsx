// d:/Portofolio/Project/pelajarin.ai/frontend/app/dashboard/course/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCourseDetail } from '@/hooks/useCourseQuery';
import CurriculumAccordion from '@/components/course/CurriculumAccordion';
import { FiLoader, FiAlertTriangle, FiCheckCircle, FiAward, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const [courseId, setCourseId] = useState<string>('');

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setCourseId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  const { data: course, isLoading, error } = useCourseDetail(courseId);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-black/20 backdrop-blur-lg border border-teal-400/20 rounded-lg shadow-lg p-8">
          {/* Title skeleton */}
          <div className="h-10 bg-gradient-to-r from-teal-400/10 to-purple-400/10 rounded-lg animate-pulse mb-4 w-3/4"></div>
          <div className="h-6 bg-gradient-to-r from-teal-400/5 to-purple-400/5 rounded-lg animate-pulse mb-8 w-full"></div>
          
          {/* Description skeleton */}
          <div className="space-y-3 mb-8">
            <div className="h-4 bg-gradient-to-r from-teal-400/5 to-purple-400/5 rounded-lg animate-pulse w-full"></div>
            <div className="h-4 bg-gradient-to-r from-teal-400/5 to-purple-400/5 rounded-lg animate-pulse w-5/6"></div>
            <div className="h-4 bg-gradient-to-r from-teal-400/5 to-purple-400/5 rounded-lg animate-pulse w-4/6"></div>
          </div>

          {/* Learning outcomes skeleton */}
          <div className="mb-10">
            <div className="h-8 bg-gradient-to-r from-teal-400/10 to-purple-400/10 rounded-lg animate-pulse mb-5 w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start">
                  <div className="w-5 h-5 bg-teal-400/20 rounded-full animate-pulse mr-3 mt-0.5 flex-shrink-0"></div>
                  <div className="h-4 bg-gradient-to-r from-teal-400/5 to-purple-400/5 rounded-lg animate-pulse w-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum skeleton */}
          <div>
            <div className="h-8 bg-gradient-to-r from-teal-400/10 to-purple-400/10 rounded-lg animate-pulse mb-5 w-1/4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-black/10 border border-teal-400/10 rounded-lg p-4">
                  <div className="h-6 bg-gradient-to-r from-teal-400/10 to-purple-400/10 rounded-lg animate-pulse mb-3 w-1/2"></div>
                  <div className="h-4 bg-gradient-to-r from-teal-400/5 to-purple-400/5 rounded-lg animate-pulse w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-400">
        <FiAlertTriangle className="mx-auto h-12 w-12" />
        <p className="mt-4 text-shadow-subtle">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        <Link href="/dashboard" className="mt-4 px-4 py-2 bg-gradient-to-r from-teal-400 to-purple-400 text-white rounded-md hover:shadow-lg hover:shadow-teal-400/25 transition-all duration-300">
          Kembali ke Dasbor
        </Link>
      </div>
    );
  }

  if (!course) {
    return null; // Should be covered by error state, but as a fallback
  }

  return (
    <motion.div
      layoutId={`course-card-${course.id}`}
      className="max-w-5xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-black/20 backdrop-blur-lg border border-teal-400/20 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 text-shadow-strong">{course.title}</h1>
        <div className="prose prose-invert max-w-none text-gray-300 mb-8">
          <ReactMarkdown>{course.description}</ReactMarkdown>
        </div>

        {course.learning_outcomes && course.learning_outcomes.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-5 text-shadow-subtle">Tujuan Pembelajaran</h2>
            <ul className="space-y-3">
              {course.learning_outcomes.map((outcome: string, index: number) => (
                <li key={index} className="flex items-start">
                  <FiCheckCircle className="w-5 h-5 text-teal-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-300 text-shadow-subtle">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-white mb-5 text-shadow-subtle">Kurikulum</h2>
        <CurriculumAccordion modules={course.modules} courseId={course.id} />

        {course.final_assessment && (
          <div className="mt-10 pt-8 border-t border-teal-400/20">
            <h2 className="text-2xl font-bold text-white mb-5 text-shadow-subtle">Ujian Akhir</h2>
            <div className="bg-black/30 backdrop-blur-sm border border-teal-400/20 rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center">
                <FiAward className="w-8 h-8 text-purple-400 mr-4" />
                <div>
                  <h3 className="font-bold text-lg text-white text-shadow-subtle">{course.final_assessment.title}</h3>
                  <p className="text-sm text-gray-400 text-shadow-subtle">Uji pemahaman Anda secara keseluruhan.</p>
                </div>
              </div>
              <button 
                className="group relative inline-flex items-center justify-center px-6 py-2.5 text-base font-semibold text-white bg-gradient-to-r from-teal-400 to-purple-400 rounded-lg hover:shadow-lg hover:shadow-teal-400/25 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
                disabled
              >
                <span className="text-shadow-subtle">Mulai Ujian</span>
                <FiArrowRight className="w-5 h-5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"/>
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
