import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-border/50 transition-transform transform hover:scale-105 hover:shadow-xl">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-foreground/80">{description}</p>
    </div>
  );
};

export default FeatureCard;
