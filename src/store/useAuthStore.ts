import { create } from 'zustand';
import type { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  login: async (email: string) => {
    set({ isLoading: true });
    
    // Simulate network delay for real-time connection feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      set({ user, isLoading: false });
      return true;
    }
    
    set({ isLoading: false });
    return false;
  },
  logout: () => set({ user: null }),
}));
