// frontend/app/dashboard/course/[id]/learn/[subTopicId]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { courseService } from '@/services/courseService';
import { QueryStateHandler } from '@/components/shared/QueryStateHandler';
import { ContentRenderer } from '@/components/learning/ContentRenderer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, Check, ChevronsRight, Target } from 'lucide-react';

export default function SubTopicLearnPage() {
  const params = useParams();
  const subTopicId = params.subTopicId as string;

  const subTopicQuery = useQuery({
    queryKey: ['subTopic', subTopicId],
    queryFn: () => courseService.getSubTopicContent(subTopicId),
    enabled: !!subTopicId
  });

  // Handle success logging when data is available
  if (subTopicQuery.data) {
    console.log("DATA DITERIMA DARI API:", JSON.stringify(subTopicQuery.data, null, 2));
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <QueryStateHandler query={subTopicQuery}>
        {(data) => {
          const contentBlocks = data?.content_blocks;
          if (!contentBlocks) {
            return <div className="text-center py-8 text-gray-400">No content available</div>;
          }
          
          return (
            <article className="prose prose-invert max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-a:text-blue-400 prose-strong:text-gray-200 prose-blockquote:border-l-purple-400 prose-blockquote:text-gray-400">
              
              {contentBlocks.engage_hook && (
                <section className="mb-12 p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl shadow-lg">
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-3">
                    <Target size={36} />
                    {contentBlocks.engage_hook.title}
                  </h1>
                  <p className="text-xl italic text-gray-400 mt-2">{contentBlocks.engage_hook.content}</p>
                </section>
              )}

              {contentBlocks.main_learning_content_markdown && (
                <section className="mb-8">
                  <h2 className="text-3xl font-bold flex items-center gap-3"><BookOpen /> Penjelasan Utama</h2>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {contentBlocks.main_learning_content_markdown}
                  </ReactMarkdown>
                </section>
              )}

              {contentBlocks.explore_section?.blocks && (
                <section className="mb-8">
                  <h2 className="text-3xl font-bold flex items-center gap-3"><ChevronsRight /> Mari Jelajahi</h2>
                  <ContentRenderer blocks={contentBlocks.explore_section.blocks} />
                </section>
              )}

              {contentBlocks.elaborate_section?.blocks && (
                <section className="mb-8">
                  <h2 className="text-3xl font-bold flex items-center gap-3"><ChevronsRight /> Mari Dalami</h2>
                  <ContentRenderer blocks={contentBlocks.elaborate_section.blocks} />
                </section>
              )}

              {contentBlocks.evaluate_section && (
                <section className="mt-12 p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <h2 className="text-2xl font-bold flex items-center gap-3"><Check /> Poin Kunci & Langkah Selanjutnya</h2>
                  <ul className="mt-4 list-disc list-inside space-y-2">
                    {contentBlocks.evaluate_section.key_takeaways?.map((takeaway, i) => (
                      <li key={i}>{takeaway}</li>
                    ))}
                  </ul>
                  {contentBlocks.evaluate_section.bridge_to_next_topic && (
                    <div className="mt-6 p-4 bg-gray-900/70 rounded-lg">
                      <h4 className="font-bold text-lg">Jembatan ke Topik Berikutnya: {contentBlocks.evaluate_section.bridge_to_next_topic.title}</h4>
                      <p className="mt-1 text-gray-400">{contentBlocks.evaluate_section.bridge_to_next_topic.content}</p>
                    </div>
                  )}
                </section>
              )}
            </article>
          );
        }}
      </QueryStateHandler>
    </div>
  );
}
