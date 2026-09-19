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
  accessToken: string | null;        // NEW
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserInfo | null) => void;
  setAccessToken: (token: string | null) => void;   // NEW
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  signOut: () => set({ user: null, accessToken: null, error: null }),
}));