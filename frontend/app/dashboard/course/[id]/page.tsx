// d:/Portofolio/Project/pelajarin.ai/frontend/app/dashboard/course/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { courseService } from '@/services/courseService';
import CurriculumAccordion from '@/components/course/CurriculumAccordion';
import { FiCheckCircle, FiAward, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { QueryStateHandler } from '@/components/shared/QueryStateHandler';

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

  const courseQuery = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseService.getCourseById(courseId),
    enabled: !!courseId, // Only fetch when courseId is available
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  return (
    <QueryStateHandler query={courseQuery}>
      {(course) => (
        <motion.div
          layoutId={`course-card-${course.id}`}
          className="max-w-5xl mx-auto"
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
                <h2 className="text-2xl font-bold text-white mb-5 flex items-center">
                  <FiAward className="mr-3 text-teal-400" />
                  Learning Outcomes
                </h2>
                <ul className="space-y-3">
                  {course.learning_outcomes.map((outcome: string, index: number) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <FiCheckCircle className="w-5 h-5 text-teal-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{outcome}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {course.modules && course.modules.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-5 flex items-center">
                  <FiArrowRight className="mr-3 text-teal-400" />
                  Curriculum
                </h2>
                <CurriculumAccordion modules={course.modules} courseId={course.id} />
              </div>
            )}

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
      )}
    </QueryStateHandler>
  );
}
