// frontend/components/learning/content-blocks/CodeBlock.tsx
'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Clipboard, Check } from 'lucide-react';

interface CodeBlockData {
  language: string;
  code: string;
}

export function CodeBlock({ data }: { data: CodeBlockData }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 bg-[#1e1e1e] rounded-lg overflow-hidden relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 bg-gray-700 rounded-md text-gray-300 hover:bg-gray-600 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check size={16} className="text-green-400" /> : <Clipboard size={16} />}
      </button>
      <SyntaxHighlighter language={data.language} style={vscDarkPlus} customStyle={{ margin: 0 }}>
        {data.code}
      </SyntaxHighlighter>
    </div>
  );
}
