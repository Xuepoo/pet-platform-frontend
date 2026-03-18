import { create } from 'zustand';
import api from '../services/api';

export interface Application {
  id: string;
  pet_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  created_at: string;
  updated_at?: string;
}

interface ApplicationState {
  applications: Application[];
  loading: boolean;
  error: string | null;
  submitApplication: (petId: string, message: string) => Promise<void>;
  fetchMyApplications: () => Promise<void>;
  fetchPetApplications: (petId: string) => Promise<void>;
  updateApplicationStatus: (appId: string, status: string) => Promise<void>;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: [],
  loading: false,
  error: null,

  submitApplication: async (petId, message) => {
    set({ loading: true, error: null });
    try {
      await api.post('/applications/', { pet_id: petId, message });
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to submit application', loading: false });
      throw error;
    }
  },

  fetchMyApplications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/applications/me');
      set({ applications: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch applications', loading: false });
    }
  },

  fetchPetApplications: async (petId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/applications/pet/${petId}`);
      set({ applications: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch applications', loading: false });
    }
  },

  updateApplicationStatus: async (appId, status) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/applications/${appId}/status`, { status });
      // Update local state
      set((state) => ({
        applications: state.applications.map((app) =>
          app.id === appId ? { ...app, status: status as any } : app
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update application status', loading: false });
      throw error;
    }
  },
}));
