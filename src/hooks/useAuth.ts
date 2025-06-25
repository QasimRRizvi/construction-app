import { create } from 'zustand';
import type { User } from '../db/schemas/user.schema';

type AuthUser = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthUser>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null })
}))