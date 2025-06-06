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

  // Fetch document chunks
  const fetchChunks = async (page: number) => {
    try {
      const response: PaginatedResponse<DocumentChunk> = await documentApi.listDocumentChunks(page);
      setChunks(response.results.map(chunk => ({ ...chunk, isExpanded: false })));
      setTotalPages(Math.ceil(response.count / 10)); // Assuming 10 items per page
    } catch (err) {
      setError('Failed to fetch document chunks');
      console.error('Error fetching chunks:', err);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const docs = await documentApi.listDocuments();
      setDocuments(docs);
    } catch (err) {
      setError('Failed to fetch documents');
      console.error('Error fetching documents:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchDocuments(),
          fetchChunks(currentPage)
        ]);
      } catch (err) {
        console.error('Error loading data:', err);
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
      await documentApi.deleteDocument(id);
      await fetchDocuments(); // Refresh the documents list
      await fetchChunks(currentPage); // Refresh the chunks list
    } catch (err) {
      setError('Failed to delete document');
      console.error('Error deleting document:', err);
    }
  };

  const handleUpload = async (file: File, description: string) => {
    try {
      // First, upload the file to S3 (you'll need to implement this)
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

      // Then create the document using the returned S3 URL
      await documentApi.createDocument({
        file_url,
        description,
      });

      // Refresh the documents and chunks
      await Promise.all([
        fetchDocuments(),
        fetchChunks(currentPage)
      ]);

    } catch (err) {
      console.error('Upload error:', err);
      throw err; // Re-throw to be handled by the modal
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
      <div className="container mx-auto px-2 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-up-maroon">Document Chunks</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 bg-up-maroon text-white rounded-md hover:bg-up-maroon-dark transition-colors duration-200"
              >
                Add New Document
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

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
                    <div>
                      <h2 className="text-lg font-semibold text-up-gray-800">
                        Document Chunk {chunk.id}
                      </h2>
                      <p className="text-sm text-up-gray-600">
                        From Document {chunk.document}
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl text-up-gray-500 transform transition-transform duration-200">
                    {chunk.isExpanded ? '−' : '+'}
                  </span>
                </div>
                {chunk.isExpanded && (
                  <div className="p-4 bg-up-gray-50 border-t border-up-gray-200">
                    <p className="text-up-gray-700 whitespace-pre-wrap">{chunk.content}</p>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button 
                        onClick={() => handleDelete(chunk.document)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                      >
                        Delete Document
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? 'bg-up-gray-200 text-up-gray-500 cursor-not-allowed'
                    : 'bg-up-maroon text-white hover:bg-up-maroon-dark'
                }`}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-up-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-up-gray-200 text-up-gray-500 cursor-not-allowed'
                    : 'bg-up-maroon text-white hover:bg-up-maroon-dark'
                }`}
              >
                Next
              </button>
            </div>
          )}
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