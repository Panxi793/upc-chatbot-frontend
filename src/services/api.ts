const API_BASE_URL = 'http://localhost:8000/api';

export interface Document {
  id: number;
  file_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: number;
  document: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const documentApi = {
  // List all documents
  listDocuments: async (): Promise<Document[]> => {
    const response = await fetch(`${API_BASE_URL}/ai/document/`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    return response.json();
  },

  // Get a single document
  getDocument: async (id: number): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/ai/document/${id}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch document');
    }
    return response.json();
  },

  // Create a new document
  createDocument: async (data: { file_url: string; description: string }): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/ai/document/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create document');
    }
    return response.json();
  },

  // Delete a document
  deleteDocument: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/ai/document/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete document');
    }
  },

  // List document chunks with pagination
  listDocumentChunks: async (page: number = 1): Promise<PaginatedResponse<DocumentChunk>> => {
    const response = await fetch(`${API_BASE_URL}/ai/simple-document-chunk/?page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to fetch document chunks');
    }
    return response.json();
  },

  // Get a single document chunk
  getDocumentChunk: async (id: number): Promise<DocumentChunk> => {
    const response = await fetch(`${API_BASE_URL}/ai/document-chunk/${id}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch document chunk');
    }
    return response.json();
  },
}; 