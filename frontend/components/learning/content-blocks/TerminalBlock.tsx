// frontend/components/learning/content-blocks/TerminalBlock.tsx
import { Terminal } from 'lucide-react';

interface Command {
  command: string;
  output: string;
}

interface TerminalBlockData {
  commands: Command[];
}

export function TerminalBlock({ data }: { data: TerminalBlockData }) {
  return (
    <div className="my-4 bg-black text-white font-mono text-sm rounded-lg overflow-hidden border border-gray-700">
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
        <Terminal size={16} />
        <span className="font-sans font-bold">Terminal</span>
      </div>
      <div className="p-4 overflow-x-auto">
        {data.commands.map((cmd, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">$</span>
              <span className="text-cyan-300">{cmd.command}</span>
            </div>
            {cmd.output && <pre className="text-gray-300 whitespace-pre-wrap">{cmd.output}</pre>}
          </div>
        ))}
      </div>
    </div>
  );
}
