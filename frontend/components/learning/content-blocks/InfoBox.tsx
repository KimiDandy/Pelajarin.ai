// frontend/components/learning/content-blocks/InfoBox.tsx
import { Lightbulb } from 'lucide-react';

interface InfoBoxData {
  title: string;
  content: string;
}

export function InfoBox({ data }: { data: InfoBoxData }) {
  return (
    <div className="my-4 p-4 border-l-4 border-blue-400 bg-blue-900/20 rounded-r-lg">
      <h4 className="font-bold text-blue-300 flex items-center gap-2">
        <Lightbulb size={20} />
        {data.title}
      </h4>
      <p className="mt-2 text-gray-300 whitespace-pre-wrap">{data.content}</p>
    </div>
  );
}
