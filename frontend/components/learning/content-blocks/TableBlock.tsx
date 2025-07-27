// frontend/components/learning/content-blocks/TableBlock.tsx

interface TableBlockData {
  headers: string[];
  rows: string[][];
}

export function TableBlock({ data }: { data: TableBlockData }) {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700 bg-gray-900/50">
        <thead className="bg-gray-800/60">
          <tr>
            {data.headers.map((header, index) => (
              <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
