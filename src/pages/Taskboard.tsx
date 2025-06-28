import { useEffect, useState } from "react"
import { Edit3, Trash2, List, LayoutGrid, Calendar, Circle } from "lucide-react"
import Badge from "../components/ui/Badge"
import Button from "../components/ui/Button"
import { ChecklistStatus } from "../constants"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useTask } from "../hooks/useTask"
import { getDB } from "../db"
import { getTaskStatus } from "../utils"
import type { Task } from "../db/schemas/task.schema"
import { statusConfig } from "../constants/taskModal"
import { useChecklist } from "../hooks/useChecklist"
import TaskModal from "../components/TaskModal"
import type { Checklist } from "../db/schemas/checklist.schema"

const statusOrder: ChecklistStatus[] = [
  ChecklistStatus.NotStarted,
  ChecklistStatus.InProgress,
  ChecklistStatus.Blocked,
  ChecklistStatus.FinalCheckAwaiting,
  ChecklistStatus.Done
];

export default function TaskManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tasks, setTasks, activeTask, setActiveTask } = useTask();
  const { getStatusesByTask, setChecklistForTask } = useChecklist();

  const [viewMode, setViewMode] = useState<"list" | "board">("list")

  useEffect(() => {
    const fetchTasksAndChecklists = async () => {
      const db = await getDB();
      const taskResults = await db.tasks.find({ selector: { userId: user?.id } }).exec();
      const tasks = taskResults.map((doc) => doc.toJSON());
      setTasks(tasks);

      // Load checklist status per task
      const checklistResults = await db.checklists.find({ selector: { taskId: { $in: tasks.map(t => t.id) } } }).exec();
      const checklists = checklistResults.map((doc) => doc.toJSON());

      const grouped: Record<string, Checklist[]> = {};
      for (const item of checklists) {
        if (!grouped[item.taskId]) grouped[item.taskId] = [];
        grouped[item.taskId].push({ ...item, });
      }

      Object.entries(grouped).forEach(([taskId, items]) => {
        setChecklistForTask(taskId, items);
      });
    }

    user?.id ? fetchTasksAndChecklists() : navigate("/");
  }, [user]);

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const groupedTasks = statusOrder.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => {
      const statuses = getStatusesByTask(task.id)
      return getTaskStatus(statuses) === status
    })
    return acc
  }, {} as Record<ChecklistStatus, Task[]>)

  const StatusBadge = ({ status }: { status: ChecklistStatus }) => {
    const config = statusConfig[status]
    return (
      <Badge className={`${config.bgColor} border-0`}>
        <Circle className={`w-2 h-2 fill-current ${config.dotColor}`} />
        <span className={`text-xs font-bold ml-2 ${config.color}`}>
          {config.label}
        </span>
      </Badge>
    )
  }

  const TaskCard = ({ task, status, isBoard = false }: { task: Task; status: ChecklistStatus, isBoard?: boolean }) => (
    <div className={`${isBoard ? "mb-3" : "mb-2"} border border-gray-300 rounded-lg hover:shadow-md transition-shadow duration-200 bg-white`}>
      <div className={`${isBoard ? "p-4" : "p-3"}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium ${isBoard ? "text-sm" : "text-base"} text-gray-900 truncate`}>{task.title}</h3>
            <div className="flex items-center mt-2 space-x-2">
              {!isBoard && <StatusBadge status={status} />}
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(task.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 transition-opacity">
            <Button
              onClick={() => setActiveTask(task)}
              color="secondary"
              className="!p-1"
              aria-label={`Edit ${task.title}`}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleDeleteTask(task.id)}
              color="error"
              className="!p-1"
              aria-label={`Delete ${task.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const ListView = () => (
    <div className="space-y-6 ">
      {statusOrder.map((status) => (
        <div key={status} className="space-y-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">{status}</h2>
            <Badge className="text-xs">
              {groupedTasks[status].length}
            </Badge>
          </div>
          <div className="space-y-2">
            {groupedTasks[status].length > 0 ? (
              groupedTasks[status].map((task) => <TaskCard key={task.id} task={task} status={status} />)
            ) : (
              <div className="text-center py-8 text-gray-500 border border-gray-300 rounded-lg bg-white">
                <p className="text-sm">No tasks in this status</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const BoardView = () => (
    <div className="flex gap-1 overflow-x-auto px-1 overflow-y-hidden h-full">
      {statusOrder.map((status) => {
        const config = statusConfig[status]
        return (
          <div key={status} className="w-80 shrink-0 border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                <h3 className="font-medium text-gray-900">{status}</h3>
              </div>
              <Badge className="text-xs">
                {groupedTasks[status].length}
              </Badge>
            </div>
            <div className="space-y-3 max-h-[calc(100vh-260px)] overflow-y-auto">
              {groupedTasks[status].map((task) => (
                <TaskCard key={task.id} task={task} status={status} isBoard />
              ))}
              {groupedTasks[status].length === 0 && (
                <div className="text-center py-8 text-gray-400 ">
                  <p className="text-sm">No tasks</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-950 px-4 py-6 text-white">
      <h1 className="text-3xl font-bold text-center ">🗂️ Task Board</h1>
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="flex flex-col items-end sm:flex-row sm:items-center sm:justify-end mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-200 rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'contained' : 'text'}
                color={viewMode === 'list' ? '#000' : 'secondary'}
                size="sm"
                className="h-8 px-3 hover:border-none"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4 mr-1" />
                List
              </Button>
              <Button
                variant={viewMode === 'board' ? 'contained' : 'text'}
                color={viewMode === 'board' ? '#000' : 'secondary'}
                size="sm"
                className="h-8 px-3 hover:border-none"
                onClick={() => setViewMode("board")}
              >
                <LayoutGrid className="w-4 h-4 mr-1" />
                Board
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="transition-all duration-300 ease-in-out overflow-auto h-[calc(100vh-150px)] bg-gray-50 rounded-lg p-4 border-4 border-gray-500">
          {viewMode === "list" ? <ListView /> : <BoardView />}
        </div>

        {activeTask && (
          <TaskModal task={activeTask} onClose={() => setActiveTask(null)} />
        )}
      </div>
    </div>
  )
}
