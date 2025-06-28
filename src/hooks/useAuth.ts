import { create } from 'zustand';
import type { User } from '../db/schemas/user.schema';
import { persist, type PersistOptions } from 'zustand/middleware';

type AuthState = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

type AuthPersist = PersistOptions<AuthState>

const authStore: (set: (partial: Partial<AuthState>) => void) => AuthState = (set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null })
})

const persistConfig: AuthPersist = {
  name: 'construction-user',
}

export const useAuth = create<AuthState>()(
  persist(authStore, persistConfig)
)