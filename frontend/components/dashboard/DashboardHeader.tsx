'use client';

import { FiPlus, FiSearch } from 'react-icons/fi';

interface DashboardHeaderProps {
  onCreateCourse: () => void;
}

export default function DashboardHeader({ onCreateCourse }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8 bg-transparent">
      <div>
        <h1 className="text-2xl font-bold text-white">Kokpit Pengetahuan</h1>
        <p className="text-gray-300">Kelola dan pantau semua kursus Anda</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari kursus..."
            className="pl-10 pr-4 py-2 bg-black/20 backdrop-blur-lg border border-teal-400/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={onCreateCourse}
          className="bg-gradient-to-r from-teal-400 to-purple-400 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-teal-400/25 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <FiPlus size={20} />
          Buat Kursus Baru
        </button>
      </div>
    </div>
  );
}
