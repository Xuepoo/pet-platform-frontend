import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const formData = new FormData();
          formData.append('username', email);
          formData.append('password', password);
          
          const response = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          
          const { access_token } = response.data;
          
          // Set token in header for subsequent requests
          api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

          // Get user details
          const userResponse = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${access_token}` }
          });
          
          set({ user: userResponse.data, token: access_token, isAuthenticated: true });
        } catch (error) {
           throw error;
        }
      },

      register: async (name, email, password) => {
        try {
          await api.post('/auth/register', {
            email,
            password,
            full_name: name,
          });
          
          // Auto login after registration
          await useAuthStore.getState().login(email, password);
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        delete api.defaults.headers.common['Authorization'];
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
