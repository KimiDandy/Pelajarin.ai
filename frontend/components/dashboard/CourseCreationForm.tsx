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
  onClose: () => void;
}

export default function CourseCreationForm({ onCourseCreated, onClose }: CourseCreationFormProps) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('pemula');
  const [goal, setGoal] = useState('');
  const queryClient = useQueryClient();

  const createCourseMutation = useMutation({
    mutationFn: (data: CourseCreatePayload) => courseService.createCourse(data),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['courses'] });
      const previousCourses = queryClient.getQueryData(['courses']);
      queryClient.setQueryData(['courses'], (old: Course[] = []) => {
        const newCourse: Course = {
          id: `optimistic-${Date.now()}`,
          title: `Kursus tentang ${payload.topic}`,
          description: 'Kurikulum sedang dibuat oleh AI...',
          status: 'generating',
          created_at: new Date().toISOString(),
          progress: 0,
        };
        return [newCourse, ...old];
      });
      return { previousCourses };
    },
    onSuccess: () => {
      toast.success('Permintaan kursus berhasil dikirim! AI sedang bekerja...');
      onCourseCreated();
      onClose();
    },
    onError: (err: any, variables, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(['courses'], context.previousCourses);
      }
      let errorMessage = 'Gagal membuat kursus. Silakan coba lagi.';
      if (err?.response?.status === 400) {
        errorMessage = err.response.data?.detail || 'Input tidak valid.';
      }
      toast.error(errorMessage);
    },
    onSettled: () => {
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
