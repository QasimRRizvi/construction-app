
import type { Task } from "../db/schemas/task.schema"
import Button from "./ui/Button"
import ChecklistSection from "./ChecklistSection"
import TaskModalHeader from "./TaskModalHeader"
import { getDB } from "../db"
import { useTask } from "../hooks/useTask"
import { useChecklist } from "../hooks/useChecklist"

interface Props {
  task: Task
  onClose: () => void
}

const TaskModal = ({ task, onClose }: Props) => {
  const { isEditingTaskName, tasks, setTasks } = useTask()
  const {
    activeDropdown,
    deletedItemIds,
    editingItemId,
    getUpdatedItems,
    setActiveDropdown
  } = useChecklist()

  /* Save in DB Handlres */
  const handleTaskTitleSave = async () => {
    const taskIndex = tasks.findIndex((t) => t.id === task.id);

    const db = await getDB()
    const taskDoc = await db.tasks.findOne({ selector: { id: task.id } }).exec()

    if (taskDoc) {
      await taskDoc.update({ $set: { title: task.title } });
      tasks.splice(taskIndex, 1, task);
      setTasks(tasks)
    }
  }

  const handleChecklistUpdate = async () => {
    const db = await getDB();
    // Filter only updated items
    const updatedItems = getUpdatedItems();

    if (updatedItems.length === 0) return;

    await Promise.all(
      updatedItems.map(item => db.checklists.upsert(item))
    );

    db.checklists.find({ selector: { id: { $in: deletedItemIds } } }).remove();
  };

  const handleSave = () => {
    handleTaskTitleSave();
    handleChecklistUpdate();
    onClose();
  }
  /* Save in DB Handlres */

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={() => {
        activeDropdown && setActiveDropdown(null)
      }}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="task-modal-title"
        aria-modal="true"
      >
        <div className="p-6">
          {/* Task Header */}
          <TaskModalHeader task={task} />

          {/* Checklist Section */}
          <ChecklistSection task={task} />

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outlined" size="sm" onClick={onClose}>Cancel</Button>
            <Button variant="contained" size="sm" onClick={handleSave} disabled={!!editingItemId || isEditingTaskName}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskModal;