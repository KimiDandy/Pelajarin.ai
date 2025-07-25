'use client';

import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Container, Engine } from 'tsparticles-engine';

export default function InteractiveBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log('Particles container loaded', container);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[#02040A]" />
      
      {/* Aurora gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-[#4361EE]/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-radial from-[#7209B7]/5 via-transparent to-transparent animate-pulse" />
      
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: 'transparent',
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: 'grab',
              },
              onClick: {
                enable: true,
                mode: 'push',
              },
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: 0.5,
                },
              },
              push: {
                quantity: 4,
              },
            },
          },
          particles: {
            color: {
              value: ['#4361EE', '#7209B7', '#F0F2F5'],
            },
            links: {
              color: '#4361EE',
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: {
                default: 'bounce',
              },
              random: false,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.3,
              animation: {
                enable: true,
                speed: 0.5,
                minimumValue: 0.1,
              },
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 1, max: 3 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.5,
              },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}
