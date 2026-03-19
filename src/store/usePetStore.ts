import { create } from 'zustand';
import api from '../services/api';

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  image_url?: string;
  status: 'available' | 'adopted' | 'pending';
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  is_favorited?: boolean;
}

interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  loading: boolean;
  error: string | null;
  fetchPets: (filters?: Record<string, unknown>) => Promise<void>;
  fetchPetById: (id: string) => Promise<void>;
  toggleFavorite: (petId: string) => Promise<void>;
}

export const usePetStore = create<PetState>((set, _get) => ({
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pets';
      set({ error: errorMessage, loading: false });
    }
  },

  fetchPetById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/pets/${id}`);
      set({ selectedPet: response.data, loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pet details';
      set({ error: errorMessage, loading: false });
    }
  },

  toggleFavorite: async (petId: string) => {
    try {
      const response = await api.post(`/pets/${petId}/favorite`);
      const isFavorited = response.data; // true (favorited) or false (unfavorited)
      
      // Update local state
      set((state) => ({
        pets: state.pets.map((p) => 
          String(p.id) === String(petId) ? { ...p, is_favorited: isFavorited } : p
        ),
        selectedPet: state.selectedPet && String(state.selectedPet.id) === String(petId)
          ? { ...state.selectedPet, is_favorited: isFavorited } 
          : state.selectedPet
      }));
    } catch (error: unknown) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  }
}));
