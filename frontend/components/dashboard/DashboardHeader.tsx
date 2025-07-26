'use client';

import { FiPlus, FiSearch } from 'react-icons/fi';

interface DashboardHeaderProps {
  onCreateCourse: () => void;
}

export default function DashboardHeader({ onCreateCourse }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola dan pantau perjalanan belajar Anda</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari kursus..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={onCreateCourse}
          className="flex items-center gap-2 px-4 py-2 gradient-accent text-white rounded-lg hover:glow-shadow-teal-hover transition-all duration-300"
        >
          <FiPlus size={18} />
          Buat Kursus Baru
        </button>
      </div>
    </div>
  );
}
