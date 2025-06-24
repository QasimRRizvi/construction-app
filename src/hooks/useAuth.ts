import { create } from 'zustand';

type User = {
  id: string;
  name: string;
}

type AuthUser = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const userAuth = create<AuthUser>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null })
}))