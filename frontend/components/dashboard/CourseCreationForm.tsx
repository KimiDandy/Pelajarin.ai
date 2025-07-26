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
            disabled={isLoading}
            className="w-full gradient-accent text-white font-medium py-3 px-4 rounded-lg shadow-lg glow-shadow-teal hover:glow-shadow-teal-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sedang Memproses...' : 'Buat Kursus dengan AI'}
          </button>
        </div>
      </form>
    </div>
  );
}
