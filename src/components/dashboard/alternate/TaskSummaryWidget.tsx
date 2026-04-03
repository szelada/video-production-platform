import React from 'react';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

interface TaskSummaryWidgetProps {
  tasks: Task[];
}

const TaskSummaryWidget: React.FC<TaskSummaryWidgetProps> = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  const progress = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[0.65rem] font-bold text-zinc-400 uppercase tracking-widest">
            Progreso General
          </span>
          <span className="text-xl font-black text-zinc-800 tracking-tighter">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#D9FF54] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Task List (Top 3) */}
      <div className="space-y-3">
        {tasks.slice(0, 3).map((task) => (
          <div key={task.id} className="flex items-center gap-3 p-2 rounded-xl bg-zinc-50/50 border border-zinc-100/50 hover:bg-white transition-colors">
            <div className={`
              w-1.5 h-1.5 rounded-full
              ${task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-blue-400'}
            `} />
            <span className="text-xs font-semibold text-zinc-700 line-clamp-1 flex-1">
              {task.title}
            </span>
            <span className={`
              text-[0.6rem] font-bold px-2 py-0.5 rounded-full uppercase
              ${task.status === 'done' ? 'bg-emerald-100 text-emerald-700' : 
                task.status === 'in_progress' ? 'bg-[#D9FF54]/20 text-zinc-800' : 
                'bg-zinc-100 text-zinc-500'}
            `}>
              {task.status}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-auto pt-4 flex items-center gap-4 border-t border-zinc-100/50">
        <div className="flex flex-col">
          <span className="text-[0.6rem] font-bold text-zinc-400 uppercase">Todo</span>
          <span className="text-sm font-black text-zinc-700">{stats.todo}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[0.6rem] font-bold text-zinc-400 uppercase">Doing</span>
          <span className="text-sm font-black text-zinc-700">{stats.in_progress}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[0.6rem] font-bold text-zinc-400 uppercase">Done</span>
          <span className="text-sm font-black text-zinc-700">{stats.done}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskSummaryWidget;
