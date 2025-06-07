const API_BASE_URL = 'https://upchat.maxellmilay.com/api';

// Helper function to get auth headers
const getHeaders = () => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export interface Document {
  id: number;
  file_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentResponse {
  objects: Document[];
  total_count: number;
  num_pages: number;
  current_page: number;
}

export interface DocumentChunk {
  id: number;
  text: string;
  created_at: string;
  updated_at: string;
}

export interface ChunkResponse {
  objects: DocumentChunk[];
  total_count: number;
  num_pages: number;
  current_page: number;
}

export interface PaginatedResponse<T> {
  count: number;
  results: T[];
}

export interface LoginResponse {
  access: string;  // JWT access token
  refresh: string; // JWT refresh token
}

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    const data = await response.json();
    // Store the access token
    localStorage.setItem('token', data.access);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

export const documentApi = {
  // List all documents
  listDocuments: async (): Promise<Document[]> => {
    const response = await fetch(`${API_BASE_URL}/ai/document/`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, redirect to login
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch documents');
    }
    const data: DocumentResponse = await response.json();
    return data.objects; // Return just the documents array
  },

  // Get a single document
  getDocument: async (id: number): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/ai/document/${id}/`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch document');
    }
    return response.json();
  },

  // Create a new document
  createDocument: async (data: { file_url: string; description: string }): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/ai/document/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error('Failed to create document');
    }
    return response.json();
  },

  // Delete a document
  deleteDocument: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/ai/document/${id}/`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error('Failed to delete document');
    }
  },

  // List document chunks with pagination
  listDocumentChunks: async (page: number = 1, documentId?: number): Promise<ChunkResponse> => {
    const url = new URL(`${API_BASE_URL}/ai/simple-document-chunk/`);
    url.searchParams.append('page', page.toString());
    if (documentId) {
      url.searchParams.append('document_id', documentId.toString());
    }

    const response = await fetch(url.toString(), {
      headers: getHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch document chunks');
    }
    return response.json();
  },

  // Get a single document chunk
  getDocumentChunk: async (id: number): Promise<DocumentChunk> => {
    const response = await fetch(`${API_BASE_URL}/ai/document-chunk/${id}/`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch document chunk');
    }
    return response.json();
  },
}; 