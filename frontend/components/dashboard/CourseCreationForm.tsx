// d:/Portofolio/Project/pelajarin.ai/frontend/components/dashboard/CourseCreationForm.tsx
'use client';

import { useState } from 'react';
import { courseService } from '@/services/courseService';
import { CourseCreatePayload } from '@/types/course';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

interface CourseCreationFormProps {
  onCourseCreated: () => void;
}

export default function CourseCreationForm({ onCourseCreated }: CourseCreationFormProps) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('pemula');
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error('Topik pembelajaran tidak boleh kosong.');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Membuat permintaan kursus...');

    const payload: CourseCreatePayload = { topic, difficulty, goal };

    try {
      await courseService.createCourse(payload);
      toast.success('Permintaan berhasil! Kursus Anda sedang dibuat oleh AI.', { id: loadingToast });
      // Reset form
      setTopic('');
      setDifficulty('pemula');
      setGoal('');
      // Notify parent component to refetch courses
      onCourseCreated();
    } catch (error: Error | unknown) {
      console.error('Error creating course:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal membuat kursus. Silakan coba lagi.';
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Belajar Sesuai Keinginanmu</h2>
      <p className="text-gray-400 mb-6">Ketik saja apa yang ingin kamu pelajari. Biarkan AI kami yang merancang kurikulum terbaik untukmu.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-1">Topik Pembelajaran</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contoh: 'Dasar-dasar Javascript untuk Web'"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">Tingkat Kesulitan</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pemula">Pemula</option>
              <option value="menengah">Menengah</option>
              <option value="mahir">Mahir</option>
            </select>
          </div>
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-300 mb-1">Tujuan Spesifik (Opsional)</label>
            <input
              type="text"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Contoh: 'Bisa membuat API sendiri'"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Sedang Memproses...' : 'Buat Kursus dengan AI'}
          </Button>
        </div>
      </form>
    </div>
  );
}
