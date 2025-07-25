'use client';

import { motion } from 'framer-motion';

const AIProcessAnimation = () => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
      <div className="flex items-center space-x-6 text-sm">
        {/* Topic Input */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center text-white font-bold"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 360],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            T
          </motion.div>
          <span className="mt-2 text-[hsl(var(--muted-foreground))]">Topik</span>
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* AI Processing */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--primary))] flex items-center justify-center"
            animate={{ 
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 0 0 hsl(var(--primary)/0.7)",
                "0 0 0 10px hsl(var(--primary)/0)",
                "0 0 0 0 hsl(var(--primary)/0.7)"
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              className="w-6 h-6 border-2 border-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          <span className="mt-2 text-[hsl(var(--muted-foreground))]">AI</span>
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--primary))]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />

        {/* Curriculum Output */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--primary))] flex items-center justify-center text-white font-bold"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            K
          </motion.div>
          <span className="mt-2 text-[hsl(var(--muted-foreground))]">Kurikulum</span>
        </motion.div>
      </div>
    </div>
  );
};

export default AIProcessAnimation;
