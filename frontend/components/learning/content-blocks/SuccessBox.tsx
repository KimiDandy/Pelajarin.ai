// frontend/components/learning/content-blocks/SuccessBox.tsx
import { CheckCircle } from 'lucide-react';

interface SuccessBoxData {
  title: string;
  content: string;
}

export function SuccessBox({ data }: { data: SuccessBoxData }) {
  return (
    <div className="my-4 p-4 border-l-4 border-green-400 bg-green-900/20 rounded-r-lg">
      <h4 className="font-bold text-green-300 flex items-center gap-2">
        <CheckCircle size={20} />
        {data.title}
      </h4>
      <p className="mt-2 text-gray-300 whitespace-pre-wrap">{data.content}</p>
    </div>
  );
}
