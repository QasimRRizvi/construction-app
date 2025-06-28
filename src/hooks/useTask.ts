import { create } from "zustand";
import type { Task } from "../db/schemas/task.schema";

interface TaskState {
  activeTask: Task | null;
  tasks: Task[];
  isEditingTaskName: boolean;

  setActiveTask: (task: Task | null) => void;
  setTasks: (tasks: Task[]) => void;
  toggleIsEditingTaskName: () => void;
}

export const useTask = create<TaskState>((set) => ({
  activeTask: null,
  tasks: [],
  isEditingTaskName: false,

  setActiveTask: (task) => set({ activeTask: task }),
  setTasks: (tasks) => set({ tasks }),
  toggleIsEditingTaskName: () => set((state) => ({ isEditingTaskName: !state.isEditingTaskName }))
}));
