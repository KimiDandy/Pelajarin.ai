// frontend/components/learning/content-blocks/ChallengeBox.tsx
import { Flag } from 'lucide-react';

interface ChallengeBoxData {
  title: string;
  description: string;
  steps: string[];
}

export function ChallengeBox({ data }: { data: ChallengeBoxData }) {
  // Ensure steps is an array before trying to map
  const steps = Array.isArray(data?.steps) ? data.steps : [];
  
  if (!data || (!data.title && !data.description && steps.length === 0)) {
    return null; // Don't render anything if no valid data
  }
  
  return (
    <div className="my-4 p-4 border-l-4 border-purple-400 bg-purple-900/20 rounded-r-lg">
      <h4 className="font-bold text-purple-300 flex items-center gap-2">
        <Flag size={20} />
        {data.title || 'Challenge'}
      </h4>
      {data.description && (
        <p className="mt-2 text-gray-400 italic">{data.description}</p>
      )}
      {steps.length > 0 && (
        <ol className="mt-3 list-decimal list-inside space-y-1">
          {steps.map((step, index) => (
            <li key={index} className="text-gray-300">{step}</li>
          ))}
        </ol>
      )}
    </div>
  );
}
