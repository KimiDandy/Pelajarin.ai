'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
  return (
    <motion.div
      className="glass-card rounded-2xl p-8 transition-all duration-300 glow-border glow-border-hover group cursor-pointer"
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <div 
          className="flex items-center justify-center h-16 w-16 rounded-full mb-6 transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {icon}
        </div>
        
        <h3 className="text-2xl font-bold text-[#F0F2F5] mb-3 group-hover:text-glow transition-all duration-300">
          {title}
        </h3>
        
        <p className="text-[#A0AEC0] leading-relaxed">
          {description}
        </p>
        
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ 
            background: `radial-gradient(circle at center, ${color}10 0%, transparent 70%)`,
          }}
        />
      </div>
    </motion.div>
  );
};

export default FeatureCard;
