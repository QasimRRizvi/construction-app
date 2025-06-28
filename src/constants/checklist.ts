export enum ChecklistStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Blocked = 'Blocked',
  FinalCheckAwaiting = 'Final Check Awaiting',
  Done = 'Done',
}

export const DEFAULT_CHECKLIST = [
  { label: 'Site Survey', status: ChecklistStatus.NotStarted },
  { label: 'Materials Delivered', status: ChecklistStatus.NotStarted },
  { label: 'Work Started', status: ChecklistStatus.NotStarted },
  { label: 'Inspection Scheduled', status: ChecklistStatus.NotStarted },
  { label: 'Final Check', status: ChecklistStatus.NotStarted },
];
