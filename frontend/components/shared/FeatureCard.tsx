import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-white/20 hover:shadow-primary/10">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-6 shadow-inner shadow-primary/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-neutral-300">{description}</p>
    </div>
  );
};

export default FeatureCard;
