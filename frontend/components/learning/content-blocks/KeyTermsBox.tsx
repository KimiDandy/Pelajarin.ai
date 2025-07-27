// frontend/components/learning/content-blocks/KeyTermsBox.tsx
import { BookKey } from 'lucide-react';

interface KeyTerm {
  term: string;
  definition: string;
}

interface KeyTermsBoxData {
  terms: KeyTerm[];
}

export function KeyTermsBox({ data }: { data: KeyTermsBoxData }) {
  // Ensure terms is an array before trying to map
  const terms = Array.isArray(data?.terms) ? data.terms : [];
  
  if (terms.length === 0) {
    return null; // Don't render anything if no terms
  }
  
  return (
    <div className="my-4 p-4 border border-gray-700 rounded-lg bg-gray-800/30">
      <h4 className="font-bold text-gray-200 flex items-center gap-2">
        <BookKey size={20} />
        Istilah Kunci
      </h4>
      <dl className="mt-3 space-y-2">
        {terms.map((item, index) => (
          <div key={index}>
            <dt className="font-semibold text-gray-100">{item.term}</dt>
            <dd className="text-gray-400 pl-4">{item.definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
