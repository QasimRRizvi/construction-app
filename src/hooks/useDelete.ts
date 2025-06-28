import { create } from "zustand";

interface DeleteState {
  open: boolean;
  toggleOpen: () => void;
}

export const useDelete = create<DeleteState>((set) => ({
  open: false,
  toggleOpen: () => set((state) => ({ open: !state.open }))
}));
