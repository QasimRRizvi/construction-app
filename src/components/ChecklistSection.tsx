import { useEffect, useState } from "react";
import clsx from "clsx";
import { ChevronDown, ChevronRight, Circle, Plus, Edit2, Trash2 } from "lucide-react";

import type { Checklist } from "../db/schemas/checklist.schema";
import type { Task } from "../db/schemas/task.schema";
import Button from "./ui/Button";
import FieldActionButtons from "./FieldActionButtons";
import StatusCheckBox from "./ui/StatusCheckBox";
import { ChecklistStatus } from "../constants";
import { useChecklist } from "../hooks/useChecklist";
import { getDB } from "../db";
import { statusConfig } from "../constants/taskModal";

interface Props {
  task: Task;
}

const ChecklistSection = ({ task }: Props) => {
  const {
    open,
    editingItemId,
    items,
    activeDropdown,
    addItem,
    deleteItem,
    setEditingItemId,
    setItems,
    setActiveDropdown,
    toggleOpen,
    updateItemLabel,
    updateItemStatus
  } = useChecklist();

  const [editingItemName, setEditingItemName] = useState("");


  // Fetch old checklist items
  useEffect(() => {
    const fetchChecklist = async () => {
      const db = await getDB()
      const items = await db.checklists.find({ selector: { taskId: task.id } }).exec()
      setItems(items.map((doc) => doc.toJSON()) as (Checklist & { isUpdated: boolean })[])
    }

    fetchChecklist()
  }, [task.id]);

  /* Checklist Item handlres */
  const addNewItem = () => {
    const newItem = addItem(task.id);
    setEditingItemName(newItem.label);
    setActiveDropdown(null); // Close any open dropdowns
  }

  const handleStatusUpdate = (itemId: string, newStatus: ChecklistStatus) => {
    updateItemStatus(itemId, newStatus);
    setActiveDropdown(null);
  }

  const startEditingItem = (itemId: string, currentName: string) => {
    setEditingItemId(itemId);
    setEditingItemName(currentName);
    setActiveDropdown(null);
  }

  const saveItemName = () => {
    if (editingItemId && editingItemName.trim()) {
      updateItemLabel(editingItemId, editingItemName.trim());
    }
    setEditingItemName("");
  }

  const cancelItemEdit = () => {
    setEditingItemId(null);
    setEditingItemName("");
  }

  const handleItemDelete = (itemId: string) => {
    deleteItem(itemId);
    setActiveDropdown(null);
  }
  /* Checklist Item handlres */

  const StatusDropdown = ({ itemId, currentStatus }: { itemId: string; currentStatus: ChecklistStatus }) => (
    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[140px]">
      {Object.entries(statusConfig).map(([status, config]) => (
        <Button
          key={status}
          onClick={() => handleStatusUpdate(itemId, status as ChecklistStatus)}
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
    <div className="border-t pt-4">
      <Button
        onClick={toggleOpen}
        color="secondary"
        className="flex gap-2 w-full text-left mb-4 rounded !justify-start !p-1 hover:border-none focus:ring-transparent"
        aria-expanded={open}
        aria-controls="checklist-content"
      >
        {open ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
        <span className="font-medium text-gray-900">Checklist</span>
        <span className="text-sm text-gray-500">
          ({items.filter((item) => item.status === ChecklistStatus.Done).length}/{items.length})
        </span>
      </Button>

      {open && (
        <div id="checklist-content" className="space-y-4">
          {/* Checklist Items */}
          {items.map((item) => (
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
                          className={clsx(
                            "block text-md cursor-pointer flex-1 text-gray-900 ",
                            {
                              "line-through text-gray-500": item.status === ChecklistStatus.Done,
                              [statusConfig[item.status].color]: statusConfig[item.status].label === ChecklistStatus.Blocked
                            }
                          )}
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
                            onClick={() => handleItemDelete(item.id)}
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
                        <span className={clsx("text-xs text-black",
                          { [statusConfig[item.status].color]: statusConfig[item.status].label === ChecklistStatus.Blocked })}
                        >
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
              <span>Add New Item</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChecklistSection;