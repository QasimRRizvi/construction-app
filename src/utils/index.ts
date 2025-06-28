import { ChecklistStatus } from '../constants';

export function getTaskStatus(statuses: ChecklistStatus[]): ChecklistStatus {
  let hasInProgress = false;
  let allNotStarted = true;
  let allDone = true;
  let allFinalCheckAwaiting = true;

  for (const status of statuses) {
    // Check for short-circuit priorities
    if (status === ChecklistStatus.Blocked) {
      return ChecklistStatus.Blocked;
    }

    if (status === ChecklistStatus.InProgress) {
      // return ChecklistStatus.InProgress;
      hasInProgress = true;
    }

    // Evaluate uniformity for fallback
    if (status !== ChecklistStatus.NotStarted) {
      allNotStarted = false;
    }

    if (status !== ChecklistStatus.Done) {
      allDone = false;
    }

    if (status !== ChecklistStatus.FinalCheckAwaiting) {
      allFinalCheckAwaiting = false;
    }
  }

  if (hasInProgress) return ChecklistStatus.InProgress;
  if (allNotStarted) return ChecklistStatus.NotStarted;
  if (allDone) return ChecklistStatus.Done;
  if (allFinalCheckAwaiting) return ChecklistStatus.FinalCheckAwaiting;

  return ChecklistStatus.InProgress;
}
