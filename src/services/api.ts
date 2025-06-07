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

// New interfaces for conversations and messages
export interface Message {
  id: number;
  role: string;
  content: string;
  context: DocumentChunk[];
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: number;
  user: number;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface SimpleConversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface AIResponse {
  answer: string;
  reason: string;
  context: Array<{
    id: number;
    text: string;
    source: string;
  }>;
}

interface RegisterRequest {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }
    const data = await response.json();
    // Store the access token
    localStorage.setItem('token', data.access);
    return data;
  },

  register: async (username: string, email: string, password1: string, password2: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password1, password2 }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/user/`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error('Failed to get user info');
    }
    return response.json();
  },

  logout: () => {
    // Clear any stored tokens or user data
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

export const conversationApi = {
  // List all conversations (simple format)
  listConversations: async (): Promise<SimpleConversation[]> => {
    const response = await fetch(`${API_BASE_URL}/ai/simple-conversation/`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch conversations');
    }
    const data = await response.json();
    // Handle the backend's generic API response format
    return data.objects || data.results || (Array.isArray(data) ? data : []);
  },

  // Get a single conversation with all messages
  getConversation: async (id: number): Promise<Conversation> => {
    const response = await fetch(`${API_BASE_URL}/ai/conversation/${id}/`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch conversation');
    }
    return response.json();
  },

  // Create a new conversation
  createConversation: async (title: string): Promise<Conversation> => {
    // First get the current user ID
    const userResponse = await fetch(`${API_BASE_URL}/auth/user/`, {
      headers: getHeaders(),
    });
    if (!userResponse.ok) {
      if (userResponse.status === 401) {
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error('Failed to get user info');
    }
    const user = await userResponse.json();

    const response = await fetch(`${API_BASE_URL}/ai/conversation/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        title,
        user: user.id || user.pk // Send the user ID
      }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      const errorData = await response.json().catch(() => ({}));
      console.error('Conversation creation error:', errorData);
      throw new Error(errorData.detail || errorData.error || 'Failed to create conversation');
    }
    return response.json();
  },

  // Get AI response for a message in a conversation
  getAIResponse: async (conversationId: number, query: string): Promise<AIResponse> => {
    const response = await fetch(`${API_BASE_URL}/ai/retrieve/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        conversation_id: conversationId,
        query: query,
      }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error('Failed to get AI response');
    }
    return response.json();
  },
}; 