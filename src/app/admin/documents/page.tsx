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
      content: 'Chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text chunk text',
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-up-maroon">Document Chunk List</h1>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-up-maroon text-white rounded-md hover:bg-up-maroon-dark transition-colors duration-200">
                Add New Document
              </button>
              <button className="px-4 py-2 border border-up-maroon text-up-maroon rounded-md hover:bg-up-maroon hover:text-white transition-colors duration-200">
                Upload Document
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {chunks.map((chunk) => (
              <div 
                key={chunk.id} 
                className="border border-up-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer bg-white hover:bg-up-gray-50"
                  onClick={() => toggleChunk(chunk.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-up-maroon">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-up-gray-800">{chunk.title}</h2>
                  </div>
                  <span className="text-2xl text-up-gray-500 transform transition-transform duration-200">
                    {chunk.isExpanded ? '−' : '+'}
                  </span>
                </div>
                {chunk.isExpanded && (
                  <div className="p-4 bg-up-gray-50 border-t border-up-gray-200">
                    <p className="text-up-gray-700 whitespace-pre-wrap">{chunk.content}</p>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button className="px-3 py-1 text-sm text-up-maroon hover:text-up-maroon-dark">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700">
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 