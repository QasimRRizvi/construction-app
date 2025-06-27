import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import type { Task } from '../db/schemas/task.schema'
import TaskModal from '../components/TaskModal'
import { getDB } from '../db';
import { useAuth } from '../hooks/useAuth';
import { useTask } from '../hooks/useTask';
import { DEFAULT_CHECKLIST } from '../constants';

const Plan = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { user } = useAuth();
  const { activeTask, tasks, setActiveTask, setTasks } = useTask();
  const navigate = useNavigate()

  useEffect(() => {
    const loadTasks = async () => {
      const db = await getDB()
      const results = await db.tasks
        .find({ selector: { userId: user?.id } })
        .exec()
      const data = results.map((doc) => doc.toJSON())
      setTasks(data)
    }

    user?.id ? loadTasks() : navigate('/')
  }, [user, navigate])

  const handleClick = async (e: React.MouseEvent) => {
    if (!user) return

    const rect = containerRef.current?.getBoundingClientRect()

    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newTask: Task = {
      id: uuidv4(),
      title: `Task ${tasks.length + 1}`,
      x,
      y,
      userId: user.id,
      createdAt: new Date().toISOString(),
    }

    const db = await getDB()
    await db.tasks.insert(newTask)

    // Add default checklist
    const checklistInserts = DEFAULT_CHECKLIST.map(item => ({
      id: uuidv4(),
      taskId: newTask.id,
      label: item.label,
      status: item.status
    }));

    await db.checklists.bulkInsert(checklistInserts);

    setTasks([...tasks, newTask]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-950 px-4 py-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">📍 Construction Plan</h1>
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl mx-auto border-4 border-slate-600 rounded-xl overflow-hidden shadow-lg cursor-crosshair"
        onClick={handleClick}
      >
        <img src="/floor_plan.webp" className="w-full" alt="Construction Floor Plan" />

        {/* Render task markers */}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="absolute group"
            style={{
              left: `${task.x}px`,
              top: `${task.y}px`,
              transform: 'translate(-50%, -100%)',
            }}
            onClick={(e) => {
              e.stopPropagation() // prevent new marker placement
              setActiveTask(task)
            }}
          >
            {/* Pin Container */}
            <div className="relative flex flex-col items-center cursor-pointer group">
              <div className="w-4 h-4 bg-red-600 rounded-full z-10" />
              <div className="w-3 h-3 rotate-45 bg-red-600 rounded-bl-[4px] rounded-tr-[4px] -mt-[11px]" />

              {/* Tooltip */}
              <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 px-2 py-1 rounded-md bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {task.title}
              </div>
            </div>
          </div>
        ))}
      </div>
      {activeTask && (
        <TaskModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
        />
      )}
    </div>
  )
}


export default Plan;