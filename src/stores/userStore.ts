// src/stores/userStore.ts
import { create } from 'zustand';
import { Commute, getCommute, saveCommute } from '../services/commute';
import { getUserProfile, updateDisplayName, UserProfile } from '../services/user';

interface UserState {
  profile: UserProfile | null;
  commute: Commute | null;
  isLoading: boolean;
  error: string | null;

  fetchProfile: (userId: string) => Promise<void>;
  updateProfileName: (userId: string, newName: string) => Promise<void>;

  fetchCommute: (userId: string) => Promise<void>;
  saveCommute: (userId: string, commute: Commute) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  commute: null,
  isLoading: false,
  error: null,

  fetchProfile: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await getUserProfile(userId);
      set({ profile, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  updateProfileName: async (userId, newName) => {
    set({ isLoading: true });
    try {
      await updateDisplayName(userId, newName);
      set((state) => ({
        profile: state.profile ? { ...state.profile, displayName: newName } : null,
        isLoading: false,
      }));
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  fetchCommute: async (userId) => {
    set({ isLoading: true });
    try {
      const commute = await getCommute(userId);
      set({ commute, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  saveCommute: async (userId, commute) => {
    set({ isLoading: true });
    try {
      await saveCommute(userId, commute);
      set({ commute, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },
}));