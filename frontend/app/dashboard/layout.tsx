'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CourseCreationForm from '@/components/dashboard/CourseCreationForm';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 bg-[#F8F9FC] dot-grid-background">
        <DashboardHeader onCreateCourse={() => setShowCreateModal(true)} />
        {children}
        
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Buat Kursus Baru</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <CourseCreationForm onCourseCreated={() => setShowCreateModal(false)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
