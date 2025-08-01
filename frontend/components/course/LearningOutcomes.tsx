'use client';

import { motion } from 'framer-motion';
import { FiAward, FiCheckCircle } from 'react-icons/fi';

interface LearningOutcomesProps {
  outcomes: string[];
}

export default function LearningOutcomes({ outcomes }: LearningOutcomesProps) {
  if (!outcomes || outcomes.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-5 flex items-center">
        <FiAward className="mr-3 text-teal-400" />
        Learning Outcomes
      </h2>
      <ul className="space-y-3">
        {outcomes.map((outcome: string, index: number) => (
          <motion.li 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start"
          >
            <FiCheckCircle className="w-5 h-5 text-teal-400 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-300">{outcome}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
