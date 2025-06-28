export type Task = {
  id: string;
  userId: string;
  title: string;
  x: number;
  y: number;
  createdAt: string;
};

const taskSchema = {
  title: 'task schema',
  version: 0,
  description: 'Task created by user on floorplan',
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', maxLength: 36 },
    userId: { type: 'string' },
    title: { type: 'string' },
    x: { type: 'number' },
    y: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'userId', 'title', 'x', 'y', 'createdAt'],
};

export default taskSchema;
