import { useMemo, useState } from 'react';
import { Circle, Edit3 } from 'lucide-react';

import type { Task } from '../db/schemas/task.schema';
import Button from './ui/Button';
import FieldActionButtons from './FieldActionButtons';
import { statusConfig } from '../constants/taskModal';
import { useTask } from '../hooks/useTask';
import { useChecklist } from '../hooks/useChecklist';
import { getTaskStatus } from '../utils';

interface Props {
  task: Task;
}

const TaskModalHeader = ({ task }: Props) => {
  const { isEditingTaskName, setActiveTask, toggleIsEditingTaskName } = useTask();
  const { items: checklistItems, getStatuses } = useChecklist();
  const [editingTaskName, setEditingTaskName] = useState(task.title);

  /* Task Name Handlers */
  const startEditingTaskName = () => {
    toggleIsEditingTaskName();
    setEditingTaskName(task.title);
  };

  const saveTaskName = () => {
    toggleIsEditingTaskName();
    setActiveTask({ ...task, title: editingTaskName });
  };

  const cancelTaskNameEdit = () => {
    toggleIsEditingTaskName();
  };
  /* Task Name Handlers */

  const taskStatus = useMemo(() => getTaskStatus(getStatuses()), [checklistItems, getStatuses]);

  return (
    <div className="mb-6">
      {isEditingTaskName ? (
        <div className="mb-3">
          <input
            type="text"
            value={editingTaskName}
            onChange={e => setEditingTaskName(e.target.value)}
            className="text-xl font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600 w-full"
            onKeyDown={e => {
              if (e.key === 'Enter') saveTaskName();
              if (e.key === 'Escape') cancelTaskNameEdit();
            }}
            autoFocus
            aria-label="Edit task name"
          />
          <FieldActionButtons
            onCancle={cancelTaskNameEdit}
            onSuccess={saveTaskName}
            cancelLabel="Cancel editing task name"
            successLabel="Save task name"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-3 group">
          <h2 id="task-modal-title" className="text-xl font-semibold text-gray-900 flex-1">
            {task.title}
          </h2>
          <Button
            onClick={startEditingTaskName}
            color="secondary"
            className="!p-1 opacity-0 group-hover:opacity-100"
            aria-label="Edit task name"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Task Status */}
      <div className="flex items-center gap-2">
        <Circle className={`w-3 h-3 fill-current ${statusConfig[taskStatus].dotColor}`} />
        <span className={`text-sm font-medium ${statusConfig[taskStatus].color}`}>
          {`Ticket is ${statusConfig[taskStatus].label}`}
        </span>
      </div>
    </div>
  );
};

export default TaskModalHeader;
