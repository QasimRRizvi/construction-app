import { ChecklistStatus } from "../../constants";

export type Checklist = {
  id: string
  taskId: string
  label: string
  status: ChecklistStatus
};

const checklistSchema = {
  title: 'checklist schema',
  version: 0,
  description: 'Checklist item for a task',
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', maxLength: 36 },
    taskId: { type: 'string' },
    label: { type: 'string' },
    status: {
      type: 'string',
      enum: Object.values(ChecklistStatus),
    },
  },
  required: ['id', 'taskId', 'label', 'status'],
};

export default checklistSchema;
