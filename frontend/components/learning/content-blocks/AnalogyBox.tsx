// frontend/components/learning/content-blocks/AnalogyBox.tsx
import { BrainCircuit } from 'lucide-react';

interface AnalogyBoxData {
  title: string;
  analogy: string;
}

export function AnalogyBox({ data }: { data: AnalogyBoxData }) {
  return (
    <div className="my-4 p-4 border-l-4 border-cyan-400 bg-cyan-900/20 rounded-r-lg">
      <h4 className="font-bold text-cyan-300 flex items-center gap-2">
        <BrainCircuit size={20} />
        {data.title}
      </h4>
      <p className="mt-2 text-gray-300 italic">{data.analogy}</p>
    </div>
  );
}
