'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CourseCreationForm from '@/components/dashboard/CourseCreationForm';
import SentientNebulaBackground from '@/components/dashboard/SentientNebulaBackground';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="flex h-screen bg-[#02040A]">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <SentientNebulaBackground />
        <main className="flex-1 overflow-y-auto z-10">
          <div className="p-8">
            <DashboardHeader onCreateCourse={() => setShowCreateModal(true)} />
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
            {showCreateModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                >
                  <CourseCreationForm onCourseCreated={() => setShowCreateModal(false)} />
                </motion.div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
