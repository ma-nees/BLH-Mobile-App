import { create } from 'zustand';

interface AuthState {
  user: any | null;
  setUser: (user: any | null) => void;
  isDummy: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isDummy: process.env.EXPO_PUBLIC_USE_DUMMY_DATA === 'true',
}));
