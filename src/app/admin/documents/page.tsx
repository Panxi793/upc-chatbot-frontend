'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import UploadModal from '@/components/UploadModal';
import { Document, DocumentChunk, PaginatedResponse, documentApi } from '@/services/api';

interface ChunkWithExpanded extends DocumentChunk {
  isExpanded: boolean;
}

export default function DocumentListPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chunks, setChunks] = useState<ChunkWithExpanded[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Fetch document chunks
  const fetchChunks = async (page: number) => {
    try {
      setError(null);
      const response = await documentApi.listDocumentChunks(page);
      
      if (response && response.objects) {
        const mappedChunks = response.objects.map(chunk => ({
          ...chunk,
          isExpanded: false
        }));
        setChunks(mappedChunks);
        setTotalPages(response.num_pages);
      }
    } catch (err) {
      console.error('Error fetching chunks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch document chunks');
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      setError(null);
      const docs = await documentApi.listDocuments();
      setDocuments(docs);
      if (docs.length > 0 && !selectedDocument) {
        setSelectedDocument(docs[0]);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchDocuments(),
          fetchChunks(currentPage)
        ]);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentPage]);

  const toggleChunk = (id: number) => {
    setChunks(chunks.map(chunk =>
      chunk.id === id ? { ...chunk, isExpanded: !chunk.isExpanded } : chunk
    ));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      setError(null);
      await documentApi.deleteDocument(id);
      if (selectedDocument?.id === id) {
        setSelectedDocument(null);
      }
      await Promise.all([
        fetchDocuments(),
        fetchChunks(currentPage)
      ]);
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  const handleUpload = async (file: File, description: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const { file_url } = await response.json();

      const newDoc = await documentApi.createDocument({
        file_url,
        description,
      });

      setIsUploadModalOpen(false);
      await Promise.all([
        fetchDocuments(),
        fetchChunks(currentPage)
      ]);
      setSelectedDocument(newDoc);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload document');
      throw err;
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-2xl font-bold text-up-maroon">Document Chunks</h1>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-up-maroon text-white rounded-md hover:bg-up-maroon-dark transition-colors duration-200"
            >
              Add New Document
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 border-b border-gray-200">
              {error}
            </div>
          )}

          <div className="p-6">
            {selectedDocument && (
              <div className="mb-6 bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {selectedDocument.description || 'UPC Student Handbook.pdf'}
                </h2>
                <p className="text-sm text-gray-600">
                  Uploaded: {new Date(selectedDocument.created_at).toLocaleString()}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {chunks.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No document chunks found. Try uploading a document.
                </div>
              ) : (
                chunks.map((chunk, index) => {
                  // Calculate the chunk number based on current page
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

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
} 