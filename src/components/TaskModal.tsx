
import type { Task } from "../db/schemas/task.schema"
import Button from "./ui/Button"
import ChecklistSection from "./ChecklistSection"
import TaskModalHeader from "./TaskModalHeader"
import { getDB } from "../db"
import { useTask } from "../hooks/useTask"
import { useChecklist } from "../hooks/useChecklist"
import { useDelete } from "../hooks/useDelete"
import DeleteModal from "./DeleteModal"

interface Props {
  task: Task
  onClose: () => void
}

const TaskModal = ({ task, onClose }: Props) => {
  const { open: openDeleteModal, toggleOpen: toggleDeleteModal } = useDelete();
  const { isEditingTaskName, tasks, setTasks } = useTask();
  const {
    activeDropdown,
    items,
    deletedItemIds,
    editingItemId,
    getUpdatedItems,
    setActiveDropdown,
    setChecklistForTask,
    resetDeletedItemId,
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

    if (updatedItems.length) {
      await Promise.all(
        updatedItems.map(item => db.checklists.upsert(item))
      );
    }
    if (deletedItemIds.length) {
      db.checklists.find({ selector: { id: { $in: deletedItemIds } } }).remove();
      resetDeletedItemId();
    }
    // to real-time update grouped items in task board
    setChecklistForTask(task.id, items);

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
        className="bg-white rounded-3xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
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
            <Button
              variant="outlined"
              className="rounded-xl"
              size="sm"
              onClick={onClose}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="rounded-xl !px-6"
              size="sm"
              onClick={handleSave}
              disabled={!!editingItemId || isEditingTaskName}
            >
              Save
            </Button>
            <Button
              variant="contained"
              className="rounded-xl"
              size="sm"
              onClick={toggleDeleteModal}
              disabled={!!editingItemId || isEditingTaskName}
              color="error"
            >
              Delete Task
            </Button>
          </div>
        </div>
      </div>
      {openDeleteModal && (
        <DeleteModal />
      )}
    </div>
  )
}

export default TaskModal;