import { create } from 'zustand';
import api from '../services/api';

export interface Report {
  id: string;
  report_type: 'lost' | 'found';
  pet_name: string;
  description: string;
  location: string;
  contact_info: string;
  image_url?: string;
  status: 'open' | 'resolved';
  created_at: string;
  user_id: string;
}

interface ReportState {
  reports: Report[];
  myReports: Report[];
  loading: boolean;
  error: string | null;
  createReport: (reportData: Omit<Report, 'id' | 'status' | 'created_at' | 'user_id'>) => Promise<void>;
  fetchReports: (filters?: Record<string, unknown>) => Promise<void>;
  fetchMyReports: () => Promise<void>;
  resolveReport: (reportId: string) => Promise<void>;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  myReports: [],
  loading: false,
  error: null,

  createReport: async (reportData) => {
    set({ loading: true, error: null });
    try {
      await api.post('/reports/', reportData);
      set({ loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create report';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  fetchReports: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value));
      });
      const response = await api.get(`/reports/?${params.toString()}`);
      set({ reports: response.data, loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reports';
      set({ error: errorMessage, loading: false });
    }
  },

  fetchMyReports: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/reports/me');
      set({ myReports: response.data, loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch my reports';
      set({ error: errorMessage, loading: false });
    }
  },

  resolveReport: async (reportId) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/reports/${reportId}/resolve`);
      set((state) => ({
        reports: state.reports.map((r) =>
          r.id === reportId ? { ...r, status: 'resolved' } : r
        ),
        myReports: state.myReports.map((r) =>
            r.id === reportId ? { ...r, status: 'resolved' } : r
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resolve report';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));
