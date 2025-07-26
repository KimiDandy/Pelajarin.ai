// frontend/components/dashboard/SentientNebulaBackground.tsx
'use client';
import { motion } from 'framer-motion';

export default function SentientNebulaBackground() {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(45deg, #02040A 0%, #0A0A1A 50%, #02040A 100%)',
        }}
        animate={{
          background: [
            'linear-gradient(45deg, #02040A 0%, #0A0A1A 50%, #02040A 100%)',
            'linear-gradient(45deg, #02040A 0%, #1A0A2A 50%, #02040A 100%)',
            'linear-gradient(45deg, #02040A 0%, #0A1A2A 50%, #02040A 100%)',
            'linear-gradient(45deg, #02040A 0%, #0A0A1A 50%, #02040A 100%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating particles */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: i % 2 === 0 ? '#00F5D4' : '#9D4EDD',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [0.5, 1.5, 0.5],
            x: [0, (Math.random() - 0.5) * 100, 0],
            y: [0, (Math.random() - 0.5) * 100, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      {/* Glowing orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-32 h-32 rounded-full blur-3xl"
          style={{
            background: i === 0 ? 'radial-gradient(circle, #00F5D4 0%, transparent 70%)' :
                     i === 1 ? 'radial-gradient(circle, #9D4EDD 0%, transparent 70%)' :
                               'radial-gradient(circle, #7209B7 0%, transparent 70%)',
            left: `${20 + i * 30}%`,
            top: `${20 + i * 20}%`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50],
            y: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}