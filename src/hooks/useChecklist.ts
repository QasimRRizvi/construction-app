import { create } from "zustand";
import { ChecklistStatus } from "../constants";
import { v4 as uuidv4 } from "uuid";
import type { Checklist } from "../db/schemas/checklist.schema";

type ChecklistItem = Checklist & { isUpdated: boolean };

interface ChecklistState {
  open: boolean;
  items: ChecklistItem[];
  deletedItemIds: string[];
  editingItemId: string | null;
  activeDropdown: string | null;
  checklistsByTask: Record<string, Checklist[]>;

  toggleOpen: () => void;
  setItems: (items: ChecklistItem[]) => void;
  setDeletedItemId: (id: string) => void;
  addItem: (taskId: string) => ChecklistItem;
  updateItemStatus: (id: string, status: ChecklistStatus) => void;
  setEditingItemId: (id: string | null) => void;
  updateItemLabel: (id: string, label: string) => void;
  deleteItem: (id: string) => void;
  getStatuses: () => ChecklistStatus[];
  getUpdatedItems: () => ChecklistItem[];
  setActiveDropdown: (id: string | null) => void;
  setChecklistForTask: (taskId: string, items: Checklist[]) => void;
  getStatusesByTask: (taskId: string) => ChecklistStatus[];
}

export const useChecklist = create<ChecklistState>((set, get) => ({
  open: true,
  items: [],
  deletedItemIds: [],
  editingItemId: null,
  activeDropdown: null,
  checklistsByTask: {},

  toggleOpen: () => set((state) => ({ open: !state.open })),
  setItems: (items) => set({ items }),
  setDeletedItemId: (id) => set((state) => ({ deletedItemIds: [...state.deletedItemIds, id] })),
  setEditingItemId: (id) => set({ editingItemId: id }),
  addItem: (taskId) => {
    const newItem: ChecklistItem = {
      id: uuidv4(),
      taskId,
      label: "New Task",
      status: ChecklistStatus.NotStarted,
      isUpdated: true,
    };
    set((state) => ({
      items: [...state.items, newItem],
      editingItemId: newItem.id // Automatically enter edit mode for the new item
    }));
    return newItem;
  },

  updateItemStatus: (id, status) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, status, isUpdated: true } : item
      ),
    }));
  },

  updateItemLabel: (id, label) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, label, isUpdated: true } : item
      ),
      editingItemId: null, // change edit state to view state
    }));
  },

  deleteItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      deletedItemIds: [...state.deletedItemIds, id],
    }));
  },

  getStatuses: () => get().items.map((item) => item.status),
  getUpdatedItems: () => get().items.filter(item => item.isUpdated),
  setActiveDropdown: (id) => set({ activeDropdown: id }),
  setChecklistForTask: (taskId, items) =>
    set((state) => ({
      checklistsByTask: { ...state.checklistsByTask, [taskId]: items }
    })),

  getStatusesByTask: (taskId) =>
    get().checklistsByTask[taskId]?.map((item) => item.status) || [],
}));
