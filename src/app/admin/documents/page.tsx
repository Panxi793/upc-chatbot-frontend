'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Document, DocumentChunk, documentApi } from '@/services/api';

interface ChunkWithExpanded extends DocumentChunk {
  isExpanded: boolean;
}

export default function DocumentChunksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get('id');

  const [document, setDocument] = useState<Document | null>(null);
  const [chunks, setChunks] = useState<ChunkWithExpanded[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch document chunks for specific document
  const fetchChunks = async (page: number) => {
    if (!documentId) return;
    
    try {
      setError(null);
      const response = await documentApi.listDocumentChunks(page, parseInt(documentId));
      
      if (response && response.objects) {
        const mappedChunks = response.objects.map(chunk => ({
          ...chunk,
          isExpanded: false
        }));
        setChunks(mappedChunks);
        setTotalPages(response.num_pages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch document chunks');
    }
  };

  // Fetch document details
  const fetchDocument = async () => {
    if (!documentId) return;

    try {
      setError(null);
      const doc = await documentApi.getDocument(parseInt(documentId));
      setDocument(doc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch document');
    }
  };

  useEffect(() => {
    if (!documentId) {
      router.push('/admin/knowledge-base');
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchDocument(),
          fetchChunks(currentPage)
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [documentId, currentPage]);

  const toggleChunk = (id: number) => {
    setChunks(chunks.map(chunk =>
      chunk.id === id ? { ...chunk, isExpanded: !chunk.isExpanded } : chunk
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-up-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-up-maroon">
              {document?.description || 'Document Chunks'}
            </h1>
            <button
              onClick={() => router.push('/admin/knowledge-base')}
              className="px-4 py-2 text-up-maroon hover:text-up-maroon-dark flex items-center gap-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <span>←</span>
              <span>Back to Knowledge Base</span>
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 border-b border-gray-200">
              {error}
            </div>
          )}

          <div className="p-6">
            {document && (
              <div className="mb-6 bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {document.description || 'Untitled Document'}
                </h2>
                <p className="text-sm text-gray-600">
                  Uploaded: {new Date(document.created_at).toLocaleString()}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {chunks.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No chunks found for this document.
                </div>
              ) : (
                chunks.map((chunk, index) => {
                  const chunkNumber = (currentPage - 1) * 10 + index + 1;
                  
                  return (
                    <div 
                      key={chunk.id} 
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleChunk(chunk.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 focus:outline-none"
                      >
                        <div className="flex text-black text-lg items-center space-x-3">
                          <span className={`transform transition-transform duration-200 text-black ${chunk.isExpanded ? 'rotate-90' : ''}`}>
                            ▶
                          </span>
                          <span className="font-medium">Chunk {chunkNumber}</span>
                        </div>
                      </button>
                      
                      {chunk.isExpanded && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">Page {chunkNumber}</span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap font-mono text-sm">
                            {chunk.text}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-up-maroon text-white hover:bg-up-maroon-dark'
                  }`}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-up-maroon text-white hover:bg-up-maroon-dark'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 