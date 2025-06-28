import { ChecklistStatus } from "./checklist";

export const statusConfig: Record<ChecklistStatus, {
  label: string;
  color: string;
  dotColor: string;
  bgColor: string;
}> = {
  [ChecklistStatus.NotStarted]: {
    label: "Not Started",
    color: "text-gray-600",
    dotColor: "text-gray-500",
    bgColor: "bg-gray-100",
  },

  [ChecklistStatus.InProgress]: {
    label: "In Progress",
    color: "text-yellow-600",
    dotColor: "text-yellow-500",
    bgColor: "bg-yellow-100",
  },
  [ChecklistStatus.Blocked]: {
    label: "Blocked",
    color: "text-red-600",
    dotColor: "text-red-500",
    bgColor: "bg-red-100",
  },
  [ChecklistStatus.FinalCheckAwaiting]: {
    label: "Final Check Awaiting",
    color: "text-orange-500",
    dotColor: "text-orange-400",
    bgColor: "bg-orange-100",
  },
  [ChecklistStatus.Done]: {
    label: "Done",
    color: "text-green-600",
    dotColor: "text-green-500",
    bgColor: "bg-green-100",
  },
};