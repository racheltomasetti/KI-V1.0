import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_BASE_URL = 'http://localhost:8000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  message: string;
  agent_type?: string;
}

export interface ChatResponse {
  message: string;
  agent?: string;
  user_id?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add JWT token to all requests
api.interceptors.request.use(
  async (config) => {
    // Get current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();

    // Attach access token to Authorization header
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - try to refresh
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError || !session) {
        // Refresh failed - user needs to log in again
        await supabase.auth.signOut();
        window.location.href = '/';
        return Promise.reject(error);
      }

      // Retry the original request with new token
      const originalRequest = error.config;
      originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

export const chatService = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    // user_id no longer needed - extracted from JWT on backend
    const response = await api.post<ChatResponse>('/chat', {
      message,
    });
    return response.data;
  },

  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await api.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  },

  getCurrentUser: async () => {
    const response = await api.get('/me');
    return response.data;
  }
};