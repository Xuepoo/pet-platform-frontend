import api from './api';
import type { User } from '../store/useAuthStore';

export interface UserUpdate {
  email?: string;
  is_active?: boolean;
  is_superuser?: boolean;
  full_name?: string;
  password?: string;
  age?: number;
  gender?: string;
  avatar?: string;
  bio?: string;
}

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users/');
  return response.data;
};

export const deleteUser = async (userId: string | number): Promise<void> => {
  await api.delete(`/users/${userId}`);
};

export const updateUser = async (userId: string | number, data: UserUpdate): Promise<User> => {
  const response = await api.put(`/users/${userId}`, data);
  return response.data;
};
