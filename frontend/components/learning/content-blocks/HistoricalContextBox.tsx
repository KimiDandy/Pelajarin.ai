// frontend/components/learning/content-blocks/HistoricalContextBox.tsx
import { ScrollText } from 'lucide-react';

interface HistoricalContextData {
  title: string;
  context: string;
}

export function HistoricalContextBox({ data }: { data: HistoricalContextData }) {
  return (
    <div className="my-4 p-4 border-l-4 border-orange-400 bg-orange-900/20 rounded-r-lg">
      <h4 className="font-bold text-orange-300 flex items-center gap-2">
        <ScrollText size={20} />
        {data.title}
      </h4>
      <p className="mt-2 text-gray-300">{data.context}</p>
    </div>
  );
}
