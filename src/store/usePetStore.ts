import { create } from 'zustand';
import api from '../services/api';

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  imageUrl?: string;
  status: 'available' | 'adopted' | 'pending';
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
}

interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  loading: boolean;
  error: string | null;
  fetchPets: (filters?: any) => Promise<void>;
  fetchPetById: (id: string) => Promise<void>;
}

export const usePetStore = create<PetState>((set) => ({
  pets: [],
  selectedPet: null,
  loading: false,
  error: null,

  fetchPets: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });

      const response = await api.get(`/pets?${params.toString()}`);
      set({ pets: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch pets', loading: false });
    }
  },

  fetchPetById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/pets/${id}`);
      set({ selectedPet: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch pet details', loading: false });
    }
  }
}));
