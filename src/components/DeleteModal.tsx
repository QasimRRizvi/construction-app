import { TriangleAlert } from 'lucide-react';

import Button from './ui/Button';
import { getDB } from '../db';
import { useTask } from '../hooks/useTask';
import { useChecklist } from '../hooks/useChecklist';
import { useDelete } from '../hooks/useDelete';

const DeleteModal = () => {
  const { activeTask: task, tasks, setActiveTask, setTasks } = useTask();
  const { getIds, setItems, setActiveDropdown } = useChecklist();
  const { toggleOpen } = useDelete();

  const deleteTask = async () => {
    const db = await getDB();
    // remove task from db
    db.tasks.find({ selector: { id: task?.id } }).remove();
    // reset activeTask state in zustand
    setActiveTask(null);
    // remove task from all tasks list in zustand
    setTasks(tasks.filter(t => t.id !== task?.id));
    // get checklist item ids for active task
    const checklistIds = getIds();
    // remove checklist items from DB
    db.checklists.find({ selector: { id: { $in: checklistIds } } }).remove();
    // reset items state in zustand
    setItems([]);
    // close Task Modal
    setActiveDropdown(null);
  };

  const handleDelete = () => {
    deleteTask();
    toggleOpen();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-3xl shadow-xl max-w-xs w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="task-modal-title"
        aria-modal="true"
      >
        <div className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-red-100 w-20 h-20 rounded-full flex justify-center items-center">
              <TriangleAlert className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <div className="mb-4">
            <h2 id="task-modal-title" className="text-xl font-semibold text-gray-700 flex-1">
              {`Delete ${task?.title}!`}
            </h2>
          </div>

          <div className="text-gray-400 font-medium">
            <p>Your are going to delete the task.</p>
            <p>Are you sure?</p>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-center gap-4 mt-6 pt-4">
            <Button
              className="rounded-xl"
              variant="outlined"
              color="secondary"
              size="sm"
              onClick={toggleOpen}
            >
              No, Keep it.
            </Button>
            <Button
              className="rounded-xl"
              variant="contained"
              color="error"
              size="sm"
              onClick={handleDelete}
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
