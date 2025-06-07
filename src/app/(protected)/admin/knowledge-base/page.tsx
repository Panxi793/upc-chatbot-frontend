'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UploadModal from '@/components/UploadModal';
import { Document, documentApi } from '@/services/api';
import { uploadToS3 } from '@/services/aws';

export default function KnowledgeBasePage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      setError(null);
      const docs = await documentApi.listDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (file: File, description: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const uploadResult = await uploadToS3(file);
      
      if (!uploadResult.file_url) {
        throw new Error(uploadResult.error || 'Failed to upload file');
      }

      await documentApi.createDocument({
        file_url: uploadResult.file_url,
        description,
      });

      setIsUploadModalOpen(false);
      await fetchDocuments();

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload document');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      setError(null);
      await documentApi.deleteDocument(id);
      await fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  const handleDocumentClick = (docId: number) => {
    router.push(`/admin/documents?id=${docId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-up-maroon"></div>
                <p className="mt-2 text-up-maroon font-medium">Loading...</p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-up-maroon">Knowledge Base</h1>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-up-maroon text-white rounded-md hover:bg-up-maroon-dark transition-colors duration-200"
              disabled={isLoading}
            >
              Upload Document
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 border-b border-gray-200">
              {error}
            </div>
          )}

          <div className="p-6">
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No documents found. Try uploading a document.
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <button
                      onClick={() => handleDocumentClick(doc.id)}
                      className="flex-1 text-left"
                    >
                      <h3 className="font-medium text-gray-900">
                        {doc.description || 'Untitled Document'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Uploaded: {new Date(doc.created_at).toLocaleString()}
                      </p>
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                ))}
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