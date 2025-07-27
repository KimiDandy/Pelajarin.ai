// frontend/components/learning/content-blocks/WarningBox.tsx
import { AlertTriangle } from 'lucide-react';

interface WarningBoxData {
  title: string;
  content: string;
}

export function WarningBox({ data }: { data: WarningBoxData }) {
  return (
    <div className="my-4 p-4 border-l-4 border-yellow-400 bg-yellow-900/20 rounded-r-lg">
      <h4 className="font-bold text-yellow-300 flex items-center gap-2">
        <AlertTriangle size={20} />
        {data.title}
      </h4>
      <p className="mt-2 text-gray-300 whitespace-pre-wrap">{data.content}</p>
    </div>
  );
}
