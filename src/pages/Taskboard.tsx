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
  const { getStatuses } = useChecklist();

  const [viewMode, setViewMode] = useState<"list" | "board">("list")

  useEffect(() => {
    const fetchTasks = async () => {
      const db = await getDB();
      const results = await db.tasks.find({ selector: { userId: user?.id } }).exec();
      setTasks(results.map((doc) => doc.toJSON()));
    };

    user?.id ? fetchTasks() : navigate("/");
  }, [user]);

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const groupTasksByStatus = () => {
    return statusOrder.reduce(
      (acc, status) => {
        acc[status] = tasks.filter((task) => {
          const taskStatus = getTaskStatus(getStatuses())
          if (taskStatus === status) return true;
          return false;
        })
        return acc
      },
      {} as Record<ChecklistStatus, Task[]>,
    )
  }

  const StatusBadge = ({ status }: { status: ChecklistStatus }) => {
    const config = statusConfig[status]
    return (
      <Badge className={`${config.bgColor} border-0`}>
        <Circle className={`w-2 h-2 fill-current ${config.dotColor}`} />
        <span className={`text-xs font-medium ml-2 ${config.color}`}>
          {config.label}
        </span>
      </Badge>
    )
  }

  const TaskCard = ({ task, isBoard = false }: { task: Task; isBoard?: boolean }) => (
    <div className={`${isBoard ? "mb-3" : "mb-2"} border border-gray-300 rounded-lg hover:shadow-md transition-shadow duration-200`}>
      <div className={`${isBoard ? "p-4" : "p-3"}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium ${isBoard ? "text-sm" : "text-base"} text-gray-900 truncate`}>{task.title}</h3>
            {isBoard && task.title && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.title}</p>
            )}
            <div className="flex items-center mt-2 space-x-2">
              {!isBoard && <StatusBadge status={ChecklistStatus.Blocked} />}
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

  const ListView = () => {
    const groupedTasks = groupTasksByStatus()

    return (
      <div className="space-y-6">
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
                groupedTasks[status].map((task) => <TaskCard key={task.id} task={task} />)
              ) : (
                <div className="text-center py-8 text-gray-500 border border-gray-300 rounded-lg">
                  <p className="text-sm">No tasks in this status</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const BoardView = () => {
    const groupedTasks = groupTasksByStatus()

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto">
        {statusOrder.map((status) => {
          const config = statusConfig[status]
          return (
            <div key={status} className="min-w-[280px] bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${config.color}`} />
                  <h3 className="font-medium text-gray-900">{status}</h3>
                </div>
                <Badge className="text-xs">
                  {groupedTasks[status].length}
                </Badge>
              </div>
              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                {groupedTasks[status].map((task) => (
                  <TaskCard key={task.id} task={task} isBoard />
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
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
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
      <div className="transition-all duration-300 ease-in-out">
        {viewMode === "list" ? <ListView /> : <BoardView />}
      </div>

      {activeTask && (
        <TaskModal task={activeTask} onClose={() => setActiveTask(null)} />
      )}
    </div>
  )
}
