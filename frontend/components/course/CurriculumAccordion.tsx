// d:/Portofolio/Project/pelajarin.ai/frontend/components/course/CurriculumAccordion.tsx
'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { FiChevronDown, FiBookOpen, FiPlayCircle, FiArrowRight, FiLoader, FiCheckCircle, FiAward } from 'react-icons/fi';
import { Course } from '@/types/course';
import Link from 'next/link';
import { BookCheck, ShieldCheck } from 'lucide-react';

interface CurriculumAccordionProps {
  course: Course;
}

export default function CurriculumAccordion({ course }: CurriculumAccordionProps) {
  const { modules, id: courseId, status: courseStatus, assessments } = course;

  if (!modules || modules.length === 0) {
    return <p className="text-gray-400">Kurikulum untuk kursus ini belum tersedia.</p>;
  }

  return (
    <Accordion.Root
      type="single"
      defaultValue={`item-${modules[0]?.id}`}
      collapsible
      className="w-full space-y-3"
    >
      {modules.map((module) => (
        <Accordion.Item
          key={module.id}
          value={`item-${module.id}`}
          className="bg-black/20 backdrop-blur-lg border border-teal-400/20 rounded-lg overflow-hidden hover:border-teal-400/30 transition-all duration-300"
        >
          <Accordion.Header>
            <Accordion.Trigger className="flex justify-between items-center w-full p-4 text-left text-white font-semibold group hover:bg-white/5 transition-colors">
              <span className="text-shadow-subtle">Modul {module.module_order}: {module.title}</span>
              <FiChevronDown className="w-5 h-5 text-teal-400 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden text-sm data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
            <div className="p-4 pt-0">
              <ul className="space-y-2 pl-5 border-l-2 border-teal-400/30">
                {module.sub_topics.map((subTopic) => {
                  const isCompleted = subTopic.status === 'completed';
                  const isGenerating = courseStatus === 'generating_content' && !isCompleted;

                  const content = (
                    <div className="flex items-start">
                      <FiBookOpen className={`w-5 h-5 mr-4 mt-1 flex-shrink-0 ${isCompleted ? 'text-teal-400 group-hover:text-teal-300' : 'text-gray-600'} transition-colors`} />
                      <span className={`${isCompleted ? 'text-gray-300 group-hover:text-white' : 'text-gray-500'} transition-colors text-shadow-subtle`}>{subTopic.title}</span>
                      {isGenerating && <FiLoader className="w-4 h-4 text-blue-400 ml-2 mt-1 animate-spin" />}
                    </div>
                  );

                  return (
                    <li key={subTopic.id}>
                      {isCompleted ? (
                        <Link 
                          href={`/dashboard/course/${courseId}/learn/${subTopic.id}`}
                          className="flex items-center justify-between w-full text-left p-2 -ml-2 rounded-md hover:bg-white/5 transition-colors group cursor-pointer"
                        >
                          {content}
                          <FiArrowRight className="w-4 h-4 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ) : (
                        <div className="flex items-center justify-between w-full text-left p-2 -ml-2 rounded-md cursor-not-allowed">
                          {content}
                        </div>
                      )}
                    </li>
                  );
                })}

                {/* LOGIKA BARU: Render Kuis Modul */}
                {(() => {
                  const moduleQuiz = assessments.find(
                    (assessment) => assessment.module_id === module.id && assessment.type === 'quiz'
                  );
                  if (moduleQuiz) {
                    return (
                      <li className="mt-3 pt-3 border-t border-teal-900/50">
                        <Link 
                          href={`/dashboard/course/${courseId}/assessment/${moduleQuiz.id}`}
                          className="flex items-center justify-between w-full text-left p-2 -ml-2 rounded-md hover:bg-cyan-400/10 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center text-cyan-400">
                            <BookCheck size={16} className="mr-3 flex-shrink-0" />
                            <span className="font-semibold">{moduleQuiz.title}</span>
                          </div>
                          <FiArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    );
                  }
                  return null;
                })()}
              </ul>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}

      {/* LOGIKA BARU: Render Ujian Akhir */}
      {(() => {
        const finalExam = assessments.find(
          (assessment) => assessment.type === 'final_exam'
        );
        if (finalExam) {
          return (
            <div className="mt-6">
              <Link 
                href={`/dashboard/course/${courseId}/assessment/${finalExam.id}`}
                className="group relative flex items-center justify-between w-full text-left p-4 bg-gradient-to-r from-purple-600/20 to-teal-600/20 via-transparent border border-purple-400/30 rounded-lg hover:border-purple-400/60 transition-all duration-300"
              >
                <div className="flex items-center">
                  <ShieldCheck size={24} className="mr-4 text-purple-400" />
                  <div>
                    <h3 className="font-bold text-lg text-white text-shadow-subtle">{finalExam.title}</h3>
                    <p className="text-sm text-gray-400 text-shadow-subtle">Uji pemahaman Anda secara keseluruhan.</p>
                  </div>
                </div>
                <button className="font-semibold text-white bg-purple-600/50 hover:bg-purple-500/50 px-5 py-2 rounded-lg flex items-center transition-colors">
                  Mulai Ujian
                  <FiArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"/>
                </button>
              </Link>
            </div>
          );
        }
        return null;
      })()}
    </Accordion.Root>
  );
}
