'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckSquare, X, Loader2 } from 'lucide-react';
import KanbanBoard from '@/components/KanbanBoard';
import GanttChart from '@/components/GanttChart';

interface PhaseProTasksProps {
  tasks: any[];
  crew: any[];
  taskViewMode: 'kanban' | 'gantt';
  setTaskViewMode: (mode: 'kanban' | 'gantt') => void;
  handleUpdateTaskStatus: (taskId: string, status: string) => void;
  handleAssignMemberToTask: (taskId: string, profileId: string) => void;
  setSelectedTask: (task: any) => void;
  fetchTaskDetails: (taskId: string) => void;
  handleRemoveTask: (taskId: string) => void;
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: (open: boolean) => void;
  handleAddTask: (e: React.FormEvent) => void;
  newTask: any;
  setNewTask: (task: any) => void;
  isSubmitting: boolean;
  hasPermission: (perm: string) => boolean;
}

export const PhaseProTasks: React.FC<PhaseProTasksProps> = ({
  tasks,
  crew,
  taskViewMode,
  setTaskViewMode,
  handleUpdateTaskStatus,
  handleAssignMemberToTask,
  setSelectedTask,
  fetchTaskDetails,
  handleRemoveTask,
  isAddTaskModalOpen,
  setIsAddTaskModalOpen,
  handleAddTask,
  newTask,
  setNewTask,
  isSubmitting,
  hasPermission
}) => {
  return (
    <motion.div
      key="tasks"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cronograma de Tareas</h2>
          <p className="text-sm text-gray-500">Flujo de trabajo y responsabilidades de producción</p>
        </div>
        {hasPermission('manage_tasks') && (
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 shadow-lg shadow-indigo-200 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} /> Nueva Tarea
          </button>
        )}
      </div>

      {/* Task View Toggle - Sub-Tabs Style */}
      <div className="flex items-center gap-8 border-b border-gray-100 mb-6">
        <button
          onClick={() => setTaskViewMode('kanban')}
          className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${taskViewMode === 'kanban' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Tablero Kanban
          {taskViewMode === 'kanban' && <motion.div layoutId="taskTab" className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600" />}
        </button>
        <button
          onClick={() => setTaskViewMode('gantt')}
          className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${taskViewMode === 'gantt' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Diagrama de Gantt
          {taskViewMode === 'gantt' && <motion.div layoutId="taskTab" className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600" />}
        </button>
      </div>

      <div className="mt-2">
        {taskViewMode === 'kanban' ? (
          <KanbanBoard
            tasks={tasks}
            crew={crew}
            onStatusChange={handleUpdateTaskStatus}
            onMemberAssign={handleAssignMemberToTask}
            onTaskClick={(task) => {
              setSelectedTask(task);
              fetchTaskDetails(task.id);
            }}
            onDeleteTask={handleRemoveTask}
          />
        ) : (
          <GanttChart tasks={tasks} onTaskClick={setSelectedTask} />
        )}
      </div>

    </motion.div>
  );
};
