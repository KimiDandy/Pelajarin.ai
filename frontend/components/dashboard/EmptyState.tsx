// d:/Portofolio/Project/pelajarin.ai/frontend/components/dashboard/EmptyState.tsx
'use client';

import { FiPlusCircle } from 'react-icons/fi';

export default function EmptyState() {
  return (
    <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center mt-8">
      <FiPlusCircle className="mx-auto h-12 w-12 text-gray-500" />
      <h3 className="mt-4 text-lg font-medium text-white">Anda Belum Punya Kursus</h3>
      <p className="mt-1 text-sm text-gray-400">
        Buat kursus pertama Anda menggunakan formulir di atas.
      </p>
    </div>
  );
}
