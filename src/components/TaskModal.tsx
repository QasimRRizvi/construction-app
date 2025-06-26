import { useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronRight, Plus, Circle, Edit2, Trash2, Check, X } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'
import clsx from "clsx"

import { getDB } from "../db"
import type { Task } from "../db/schemas/task.schema"
import Button from "./ui/Button"
import StatusCheckBox from "./ui/StatusCheckBox"
import { ChecklistStatus } from "../constants"
import type { Checklist } from "../db/schemas/checklist.schema"
import { statusConfig } from "../constants/taskModal"
import { getTaskStatus } from "../utils"
import FieldActionButtons from "./FieldActionButtons"

interface Props {
  task: Task
  onClose: () => void
}

type ChecklistItems = Checklist & { isUpdated: boolean }

const TaskModal = ({ task, onClose }: Props) => {
  const [isChecklistOpen, setIsChecklistOpen] = useState(true)
  const [checklistItems, setChecklistItems] = useState<ChecklistItems[]>([])
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([])
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [taskName, setTaskName] = useState(task.title)
  const [editingTaskName, setEditingTaskName] = useState("")
  const [isEditingTaskName, setIsEditingTaskName] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingItemName, setEditingItemName] = useState("")

  // Fetch old checklist items
  useEffect(() => {
    const fetchChecklist = async () => {
      const db = await getDB()
      const items = await db.checklists.find({ selector: { taskId: task.id } }).exec()
      setChecklistItems(items.map((doc) => doc.toJSON()) as ChecklistItems[])
    }

    fetchChecklist()
  }, [task.id])

  /* Task Name Handlers */
  const startEditingTaskName = () => {
    setIsEditingTaskName(true)
    setEditingTaskName(taskName)
  }

  const saveTaskName = () => {
    setIsEditingTaskName(false)
    setTaskName(editingTaskName)
    setEditingTaskName('')
  }

  const cancelTaskNameEdit = () => {
    setIsEditingTaskName(false)
    setEditingTaskName('')
  }
  /* Task Name Handlers */

  /* Checklist Item handlres */
  const addNewItem = () => {
    const newItem: ChecklistItems = {
      id: uuidv4(),
      taskId: task.id,
      label: 'New Task',
      status: ChecklistStatus.NotStarted,
      isUpdated: true,
    }
    setChecklistItems([...checklistItems, newItem])

    // Automatically enter edit mode for the new item
    setEditingItemId(newItem.id)
    setEditingItemName(newItem.label)
    setActiveDropdown(null) // Close any open dropdowns
  }

  const updateItemStatus = (itemId: string, newStatus: ChecklistStatus) => {
    setChecklistItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? {
            ...item,
            status: newStatus,
            isUpdated: true,
          }
          : item,
      ),
    )
    setActiveDropdown(null)
  }

  const startEditingItem = (itemId: string, currentName: string) => {
    setEditingItemId(itemId)
    setEditingItemName(currentName)
    setActiveDropdown(null)
  }

  const saveItemName = () => {
    if (editingItemId && editingItemName.trim()) {
      setChecklistItems((items) =>
        items.map((item) => (item.id === editingItemId ? { ...item, label: editingItemName.trim(), isUpdated: true } : item)),
      )
    }
    setEditingItemId(null)
    setEditingItemName("")
  }

  const cancelItemEdit = () => {
    setEditingItemId(null)
    setEditingItemName("")
  }

  const deleteItem = (itemId: string) => {
    setChecklistItems((items) => items.filter((item) => item.id !== itemId));
    setDeletedItemIds((ids) => ([...ids, itemId]));
    setActiveDropdown(null);
  }
  /* Checklist Item handlres */

  /* Save in DB Handlres */
  const handleTaskTitleSave = async () => {
    if (taskName === task.title) return;

    const db = await getDB()
    const taskDoc = await db.tasks.findOne({ selector: { id: task.id } }).exec()

    if (taskDoc) {
      await taskDoc.update({ $set: { title: taskName } })
    }
  }

  const handleChecklistUpdate = async () => {
    const db = await getDB();
    // Filter only updated items
    const updatedItems = checklistItems.filter(item => item.isUpdated);

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

  const taskStatus = useMemo(() => {
    const statuses = checklistItems.reduce<ChecklistStatus[]>((acc, item) => {
      acc.push(item.status)
      return acc
    }, []);

    return getTaskStatus(statuses);
  }, [checklistItems]);

  const StatusDropdown = ({ itemId, currentStatus }: { itemId: string; currentStatus: ChecklistStatus }) => (
    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[140px]">
      {Object.entries(statusConfig).map(([status, config]) => (
        <Button
          key={status}
          onClick={() => updateItemStatus(itemId, status as ChecklistStatus)}
          color="secondary"
          className={clsx("w-full px-3 py-2 text-left flex items-center gap-2 first:rounded-t-md last:rounded-b-md focus:outline-none focus:bg-gray-50 !justify-start",
            { "bg-gray-200": status === currentStatus }
          )}
          aria-label={`Set status to ${config.label}`}
        >
          <Circle className={`w-2 h-2 fill-current ${config.dotColor}`} />
          <span className={`text-sm ${config.color}`}>{config.label}</span>
        </Button>
      ))}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="task-modal-title"
        aria-modal="true"
      >
        <div className="p-6">
          {/* Task Header */}
          <div className="mb-6">
            {isEditingTaskName ? (
              <div className="mb-3">
                <input
                  type="text"
                  value={editingTaskName}
                  onChange={(e) => setEditingTaskName(e.target.value)}
                  className="text-xl font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600 w-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveTaskName()
                    if (e.key === "Escape") cancelTaskNameEdit()
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
                  {taskName}
                </h2>
                <Button
                  onClick={startEditingTaskName}
                  color="secondary"
                  className="!p-1 opacity-0 group-hover:opacity-100"
                  // className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:opacity-100"
                  aria-label="Edit task name"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Task Status */}
            <div className="flex items-center gap-2">
              <Circle className={`w-3 h-3 fill-current ${statusConfig[taskStatus].dotColor}`} />
              <span className={`text-sm font-medium ${statusConfig[taskStatus].color}`}>
                {statusConfig[taskStatus].label}
              </span>
            </div>
          </div>

          {/* Checklist Section */}
          <div className="border-t pt-4">
            <Button
              onClick={() => setIsChecklistOpen(!isChecklistOpen)}
              color="secondary"
              className="flex gap-2 w-full text-left mb-4 rounded !justify-start !p-1 hover:border-none focus:ring-transparent"
              aria-expanded={isChecklistOpen}
              aria-controls="checklist-content"
            >
              {isChecklistOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <span className="font-medium text-gray-900">Checklist</span>
              <span className="text-sm text-gray-500">
                ({checklistItems.filter((item) => item.status === ChecklistStatus.Done).length}/{checklistItems.length})
              </span>
            </Button>

            {isChecklistOpen && (
              <div id="checklist-content" className="space-y-4">
                {/* Checklist Items */}
                {checklistItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <StatusCheckBox
                          id={`item-${item.id}`}
                          status={item.status}
                          onClick={() => {
                            if (editingItemId !== item.id) {
                              setActiveDropdown(activeDropdown === item.id ? null : item.id)
                            }
                          }}
                          className="mt-0.5 cursor-pointer"
                          aria-describedby={`item-${item.id}-status`}
                          disabled={editingItemId === item.id}
                        />
                        {activeDropdown === item.id && editingItemId !== item.id && (
                          <StatusDropdown itemId={item.id} currentStatus={item.status} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {editingItemId === item.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editingItemName}
                              onChange={(e) => setEditingItemName(e.target.value)}
                              className="block w-full text-sm text-black bg-transparent border-b border-gray-500 focus:outline-none focus:border-gray-600 pb-1"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveItemName()
                                if (e.key === "Escape") cancelItemEdit()
                              }}
                              autoFocus
                              aria-label="Edit item label"
                            />
                            <FieldActionButtons
                              onCancle={cancelItemEdit}
                              onSuccess={saveItemName}
                              cancelLabel="Cancel editing item label"
                              successLabel="Save item label"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <label
                                htmlFor={`item-${item.id}`}
                                className={`block text-sm cursor-pointer flex-1 ${item.status === ChecklistStatus.Done ? "line-through text-gray-500" : "text-gray-900"
                                  }`}
                              >
                                {item.label}
                              </label>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  onClick={() => startEditingItem(item.id, item.label)}
                                  color="secondary"
                                  className="!p-1"
                                  aria-label={`Edit ${item.label}`}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => deleteItem(item.id)}
                                  color="error"
                                  className="!p-1"
                                  aria-label={`Delete ${item.label}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Status indicator below item label */}
                            <div id={`item-${item.id}-status`} className="flex items-center gap-1">
                              <Circle className={`w-2 h-2 fill-current ${statusConfig[item.status].dotColor}`} />
                              <span className={`text-xs ${statusConfig[item.status].color}`}>
                                {statusConfig[item.status].label}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Item Button */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <Button
                    onClick={addNewItem}
                    className="!p-1"
                    aria-label="Add new checklist item"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outlined" size="sm" onClick={onClose}>Cancel</Button>
            <Button variant="contained" size="sm" onClick={handleSave} disabled={!!editingItemId || isEditingTaskName}>Save Changes</Button>
          </div>
        </div>
      </div>

      {/* Click outside to close overlay */}
      <div
        className="absolute inset-0 -z-10"
        onClick={() => {
          setActiveDropdown(null)
          // You could add modal close logic here
        }}
        aria-hidden="true"
      />
    </div>
  )
}

export default TaskModal;