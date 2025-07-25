'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color = 'primary', delay = 0 }) => {
  return (
    <Tilt
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      perspective={1000}
      scale={1.05}
      transitionSpeed={400}
      className="tilt-card"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
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
            style={{ 
              backgroundColor: `hsl(var(--${color}))`, 
              color: `hsl(var(--${color}))` 
            }}
          >
            {icon}
          </div>
          
          <h3 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-3 group-hover:text-glow transition-all duration-300">
            {title}
          </h3>
          
          <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
            {description}
          </p>
        </div>
        
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ 
            background: `radial-gradient(circle at center, hsl(var(--${color})/0.1) 0%, transparent 70%)`,
          }}
        />
      </motion.div>
    </Tilt>
  );
};

export default FeatureCard;
