'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

interface DocumentChunk {
  id: number;
  title: string;
  content: string;
  isExpanded: boolean;
}

export default function DocumentListPage() {
  const [chunks, setChunks] = useState<DocumentChunk[]>([
    {
      id: 1,
      title: 'UPC Student Handbook.pdf',
      content: 'Sample chunk text content...',
      isExpanded: false,
    },
  ]);

  const toggleChunk = (id: number) => {
    setChunks(
      chunks.map((chunk) =>
        chunk.id === id ? { ...chunk, isExpanded: !chunk.isExpanded } : chunk
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">DOCUMENT CHUNK LIST (PAGINATED)</h1>

        <div className="space-y-4">
          {chunks.map((chunk) => (
            <div key={chunk.id} className="bg-gray-100 rounded-lg">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleChunk(chunk.id)}
              >
                <h2 className="text-lg font-semibold">Chunk Title</h2>
                <span className="text-2xl">
                  {chunk.isExpanded ? '-' : '+'}
                </span>
              </div>
              {chunk.isExpanded && (
                <div className="p-4 border-t border-gray-200">
                  <p className="whitespace-pre-wrap">{chunk.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 