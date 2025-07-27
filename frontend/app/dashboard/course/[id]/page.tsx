// d:/Portofolio/Project/pelajarin.ai/frontend/app/dashboard/course/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/services/courseService';
import CurriculumAccordion from '@/components/course/CurriculumAccordion';
import { FiCheckCircle, FiAward, FiArrowRight, FiLoader, FiPlayCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/progress';
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

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!courseId || courseQuery.data?.status !== 'generating_content') {
      return;
    }

    const eventSource = new EventSource(`/api/v1/courses/${courseId}/progress-stream`);
    
    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);

      queryClient.setQueryData(['course', courseId], (oldData: any) => {
        if (!oldData) return oldData;

        let newData = { ...oldData };

        switch (eventData.event) {
          case 'sub_topic_completed':
            const updatedSubTopic = JSON.parse(eventData.data);
            newData.modules = newData.modules.map((module: any) => ({
              ...module,
              sub_topics: module.sub_topics.map((st: any) => 
                st.id === updatedSubTopic.id ? { ...st, ...updatedSubTopic } : st
              ),
            }));
            break;

          case 'generation_cancelled':
          case 'generation_finished':
            // Invalidate the query to refetch the final state from the main endpoint
            queryClient.invalidateQueries({ queryKey: ['course', courseId] });
            eventSource.close(); // Close the connection as the process is finished
            break;
        }
        return newData;
      });
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    // Cleanup on component unmount
    return () => {
      eventSource.close();
    };

  }, [courseId, courseQuery.data?.status, queryClient]);

  const triggerGenerationMutation = useMutation({
    mutationFn: courseService.triggerContentGeneration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.info("Proses pembuatan konten telah dimulai.");
    },
    onError: (error) => {
        toast.error(`Gagal memulai proses: ${error.message}`);
    }
  });

  const cancelGenerationMutation = useMutation({
    mutationFn: courseService.cancelContentGeneration,
    onSuccess: (data) => {
        toast.success(data.message || "Permintaan pembatalan berhasil dikirim.");
        queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },
    onError: (error) => {
        toast.error(`Gagal membatalkan: ${error.message}`);
    }
  });

  const handleTriggerGeneration = () => {
    if (courseId) {
      triggerGenerationMutation.mutate(courseId);
    }
  };

  const handleCancelGeneration = () => {
    if (courseId) {
      cancelGenerationMutation.mutate(courseId);
    }
  };

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
            
            {course.status === 'blueprint_completed' && (
              <div className="my-8 flex justify-center">
                <Button 
                  onClick={handleTriggerGeneration} 
                  disabled={triggerGenerationMutation.isPending}
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
                >
                  {triggerGenerationMutation.isPending ? (
                    <><FiLoader className="animate-spin h-5 w-5" /> Memulai Proses...</>
                  ) : (
                    <><FiPlayCircle className="h-5 w-5" /> Mulai Buat Isi Pembelajaran</>
                  )}
                </Button>
              </div>
            )}
            {course.status === 'generating_content' && !cancelGenerationMutation.isSuccess && (() => {
              const completedCount = course.modules.flatMap(m => m.sub_topics).filter(st => st.status === 'completed').length;
              const totalCount = course.modules.flatMap(m => m.sub_topics).length;
              const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

              return (
                <div className="my-6 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-blue-300 font-semibold">
                      {cancelGenerationMutation.isSuccess 
                        ? 'Proses sedang dihentikan, mohon tunggu...'
                        : 'Konten untuk kursus ini sedang dibuat oleh AI...'
                      }
                    </p>
                    <p className="text-blue-300 font-bold">{completedCount}/{totalCount}</p>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <div className="mt-4 flex justify-center">
                      <Button 
                        onClick={handleCancelGeneration}
                        disabled={cancelGenerationMutation.isPending || cancelGenerationMutation.isSuccess}
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {cancelGenerationMutation.isPending ? (
                            <><FiLoader className="animate-spin h-4 w-4" /> Membatalkan...</>
                        ) : (
                            <><FiXCircle className="h-4 w-4" /> Batalkan Proses</>
                        )}
                      </Button>
                  </div>
                </div>
              );
            })()}


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
                <CurriculumAccordion modules={course.modules} courseId={course.id} courseStatus={course.status} />
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
