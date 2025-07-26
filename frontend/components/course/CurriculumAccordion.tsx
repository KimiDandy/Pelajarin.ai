// d:/Portofolio/Project/pelajarin.ai/frontend/components/course/CurriculumAccordion.tsx
'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { FiChevronDown, FiBookOpen, FiPlayCircle, FiArrowRight } from 'react-icons/fi';
import { Module } from '@/types/course';
import Link from 'next/link';

interface CurriculumAccordionProps {
  modules: Module[];
  courseId: string;
}

export default function CurriculumAccordion({ modules, courseId }: CurriculumAccordionProps) {
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
                {module.sub_topics.map((subTopic) => (
                  <li key={subTopic.id}>
                    <Link 
                      href={`/dashboard/course/${courseId}/subtopic/${subTopic.id}`}
                      className="flex items-center justify-between w-full text-left p-2 -ml-2 rounded-md hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-start">
                        <FiBookOpen className="w-5 h-5 text-teal-400 mr-4 mt-1 flex-shrink-0 group-hover:text-teal-300 transition-colors" />
                        <span className="text-gray-300 group-hover:text-white transition-colors text-shadow-subtle">{subTopic.title}</span>
                      </div>
                      <FiArrowRight className="w-4 h-4 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>

              {module.assessment && (
                <div className="mt-6 pt-4 border-t border-teal-400/20">
                  <div className="bg-black/20 backdrop-blur-sm border border-teal-400/20 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <FiPlayCircle className="w-6 h-6 text-teal-400 mr-4" />
                      <div>
                        <h4 className="font-semibold text-white text-shadow-subtle">{module.assessment.title}</h4>
                        <p className="text-sm text-gray-300 text-shadow-subtle">Uji pemahaman Anda untuk modul ini.</p>
                      </div>
                    </div>
                    <button 
                      className="group relative inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-400 to-purple-400 rounded-lg hover:shadow-lg hover:shadow-teal-400/25 transition-all duration-300 disabled:bg-none disabled:bg-gray-600/50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                      disabled
                    >
                      <span className="text-shadow-subtle">Mulai Kuis</span>
                      <FiArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"/>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
