'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

interface Document {
  id: number;
  name: string;
}

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, name: 'UPC Student Handbook.pdf' },
    { id: 2, name: 'OUR Registration Guide.pdf' },
    { id: 3, name: 'Masteral Guide.docx' },
  ]);

  const handleUpload = () => {
    // TODO: Implement file upload logic
  };

  const handleDelete = (id: number) => {
    // TODO: Implement delete logic
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">KNOWLEDGE BASE</h1>
          <button
            onClick={handleUpload}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            UPLOAD
          </button>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">DOCUMENT LIST (PAGINATED)</h2>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex justify-between items-center bg-white p-4 rounded-lg"
              >
                <span>{doc.name}</span>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="bg-gray-600 text-white px-4 py-1 rounded hover:bg-gray-700"
                >
                  DELETE
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 