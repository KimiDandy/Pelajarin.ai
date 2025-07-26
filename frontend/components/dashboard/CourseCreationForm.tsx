// d:/Portofolio/Project/pelajarin.ai/frontend/components/dashboard/CourseCreationForm.tsx
'use client';

import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { courseService } from '@/services/courseService';
import { CourseCreatePayload, Course } from '@/types/course';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

interface CourseCreationFormProps {
  onCourseCreated: () => void;
}

export default function CourseCreationForm({ onCourseCreated }: CourseCreationFormProps) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('pemula');
  const [goal, setGoal] = useState('');
  const queryClient = useQueryClient();

  const createCourseMutation = useMutation({
    mutationFn: (payload: CourseCreatePayload) => courseService.createCourse(payload),
    onMutate: async (payload) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['courses'] });

      // Snapshot the previous value
      const previousCourses = queryClient.getQueryData(['courses']);

      // Create optimistic course
      const optimisticCourse: Course = {
        id: `optimistic-${Date.now()}`,
        title: payload.topic,
        description: `Kursus tentang ${payload.topic} sedang dibuat oleh AI...`,
        status: 'generating',
        created_at: new Date().toISOString(),
        progress: 0,
      };

      // Optimistically update the cache
      queryClient.setQueryData(['courses'], (old: Course[] = []) => [optimisticCourse, ...old]);

      // Return context for rollback
      return { previousCourses };
    },
    onError: (error: any, variables: any, context: any) => {
      // Rollback optimistic update on error
      queryClient.setQueryData(['courses'], context.previousCourses);
      
      // Provide specific error messages based on error type
      let errorMessage = 'Gagal membuat kursus. Silakan coba lagi.';
      
      if (error?.response?.status === 400) {
        const errorDetail = error.response.data?.detail;
        if (errorDetail?.includes('prompt injection') || errorDetail?.includes('tidak valid')) {
          errorMessage = `Topik yang Anda masukkan mengandung kata yang tidak diizinkan. Harap gunakan topik yang lebih spesifik.`;
        } else if (errorDetail?.includes('terlalu umum') || errorDetail?.includes('too general')) {
          errorMessage = `Topik terlalu umum. Coba gunakan topik yang lebih spesifik seperti "${topic} untuk pemula" atau "${topic} dasar".`;
        } else {
          errorMessage = errorDetail || 'Topik tidak valid. Harap periksa input Anda.';
        }
      } else if (error?.response?.status === 500) {
        errorMessage = 'Terjadi kesalahan server. Silakan coba beberapa saat lagi.';
      } else {
        errorMessage = error instanceof Error ? error.message : 'Gagal membuat kursus. Silakan coba lagi.';
      }
      
      toast.error(errorMessage, {
        duration: 5000,
        style: {
          maxWidth: '400px',
        },
      });
    },
    onSuccess: () => {
      toast.success('Permintaan berhasil! Kursus Anda sedang dibuat oleh AI.');
      // Reset form
      setTopic('');
      setDifficulty('pemula');
      setGoal('');
      // Notify parent (though QueryClient handles the refetch)
      onCourseCreated();
    },
    onSettled: () => {
      // Always refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error('Topik pembelajaran tidak boleh kosong.');
      return;
    }

    const payload: CourseCreatePayload = { topic, difficulty, goal };
    createCourseMutation.mutate(payload);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Belajar Sesuai Keinginanmu</h2>
      <p className="text-gray-600 mb-6">Ketik saja apa yang ingin kamu pelajari. Biarkan AI kami yang merancang kurikulum terbaik untukmu.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">Topik Pembelajaran</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary-teal/50 focus:border-primary-teal transition-colors"
            placeholder="Contoh: 'Dasar-dasar Javascript untuk Web'"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">Tingkat Kesulitan</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary-teal/50 focus:border-primary-teal transition-colors"
            >
              <option value="pemula">Pemula</option>
              <option value="menengah">Menengah</option>
              <option value="mahir">Mahir</option>
            </select>
          </div>
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">Tujuan Spesifik (Opsional)</label>
            <input
              type="text"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary-teal/50 focus:border-primary-teal transition-colors"
              placeholder="Contoh: 'Bisa membuat API sendiri'"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={createCourseMutation.isPending || !topic.trim()}
            className="w-full bg-gradient-to-r from-primary-teal to-primary-purple text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-primary-teal/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createCourseMutation.isPending ? 'Membuat Kursus...' : 'Buat Kursus Sekarang'}
          </button>
        </div>
      </form>
    </div>
  );
}
