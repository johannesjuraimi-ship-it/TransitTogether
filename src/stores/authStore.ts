// src/stores/authStore.ts
import { create } from 'zustand';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

interface AuthState {
  user: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  signOut: () => set({ user: null, error: null }),
}));