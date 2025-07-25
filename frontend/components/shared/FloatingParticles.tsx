'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

const FloatingParticles = () => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [isVisible, setIsVisible] = useState(false);

  const smoothCursorX = useSpring(cursorX, { stiffness: 300, damping: 30 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          x: smoothCursorX,
          y: smoothCursorY,
          left: -15,
          top: -15,
          width: 30,
          height: 30,
          background: 'radial-gradient(circle, hsl(var(--primary)/0.8), transparent)',
          boxShadow: '0 0 20px hsl(var(--primary)/0.6), 0 0 40px hsl(var(--primary)/0.3)',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: isVisible ? [0.7, 1, 0.7] : 0,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            x: smoothCursorX,
            y: smoothCursorY,
            left: -8,
            top: -8,
            width: 16,
            height: 16,
            background: `radial-gradient(circle, hsl(var(--secondary)/0.6), transparent)`,
            boxShadow: `0 0 10px hsl(var(--secondary)/0.4)`,
          }}
          animate={{
            scale: [0.5, 1, 0.5],
            opacity: [0, 0.8, 0],
            x: [0, (Math.random() - 0.5) * 100, 0],
            y: [0, (Math.random() - 0.5) * 100, 0],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;