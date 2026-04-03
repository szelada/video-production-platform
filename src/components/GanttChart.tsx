import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    start_date?: string;
    due_date?: string;
    priority?: string;
    status?: string;
    area?: string;
    profiles?: {
        full_name: string;
        avatar_url?: string;
    };
}

interface GanttChartProps {
    tasks: any[];
    onTaskClick?: (task: any) => void;
}

export default function GanttChart({ tasks, onTaskClick }: GanttChartProps) {
    // 1. Calculate Date Range with fallbacks for missing dates
    const tasksWithDates = tasks.map(t => {
        const start = t.start_date ? new Date(t.start_date) : new Date(t.created_at || Date.now());
        const due = t.due_date ? new Date(t.due_date) : new Date(start.getTime() + 86400000); // Default 1 day
        return { ...t, _start: start, _due: due };
    });

    const sortedTasks = [...tasksWithDates].sort((a, b) => a._start.getTime() - b._start.getTime());

    if (sortedTasks.length === 0) {
        return (
            <div className="p-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-center">
                <div className="p-4 rounded-full bg-gray-50 text-gray-400">
                    <Calendar size={32} />
                </div>
                <div>
                    <p className="text-gray-900 font-bold">No hay suficientes datos para el Gantt</p>
                    <p className="text-sm text-gray-400">Asegúrate de que las tareas tengan Fecha de Inicio y Fecha Límite.</p>
                </div>
            </div>
        );
    }

    const minDate = new Date(Math.min(...sortedTasks.map(t => t._start.getTime())));
    const maxDate = new Date(Math.max(...sortedTasks.map(t => t._due.getTime())));
    
    // Add some padding to the range (e.g., 2 days)
    minDate.setDate(minDate.getDate() - 2);
    maxDate.setDate(maxDate.getDate() + 5);

    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const daysArray = Array.from({ length: totalDays }, (_, i) => {
        const d = new Date(minDate);
        d.setDate(d.getDate() + i);
        return d;
    });

    const getXPosition = (date: Date) => {
        const diff = date.getTime() - minDate.getTime();
        return (diff / (1000 * 60 * 60 * 24)) * 40; // 40px per day
    };

    const getWidth = (start: Date, end: Date) => {
        const diff = end.getTime() - start.getTime();
        const days = Math.max(1, (diff / (1000 * 60 * 60 * 24)));
        return days * 40;
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-500 shadow-lg shadow-red-100';
            case 'high': return 'bg-orange-500 shadow-lg shadow-orange-100';
            case 'medium': return 'bg-indigo-500 shadow-lg shadow-indigo-100';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Cronograma de Producción</h3>
                    <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400"><ChevronLeft size={16} /></button>
                        <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400"><ChevronRight size={16} /></button>
                    </div>
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    {minDate.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-hide">
                <div className="min-w-fit flex">
                    {/* Y-Axis labels (Task titles) - Sticky left */}
                    <div className="w-64 flex-shrink-0 bg-white border-r border-gray-50 sticky left-0 z-10 pt-12">
                        {sortedTasks.map(task => (
                            <div key={task.id} className="h-14 px-6 flex items-center border-b border-gray-50/50">
                                <span className="text-xs font-bold text-gray-900 truncate" title={task.title}>
                                    {task.title}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Timeline Grid */}
                    <div className="relative">
                        {/* Days Header */}
                        <div className="h-12 flex border-b border-gray-50">
                            {daysArray.map((date, i) => (
                                <div key={i} className={`w-10 flex-shrink-0 flex flex-col items-center justify-center border-r border-gray-50/30 ${[0, 6].includes(date.getDay()) ? 'bg-gray-50/50' : ''}`}>
                                    <span className="text-[8px] font-black text-gray-400 uppercase">{date.toLocaleDateString('es-ES', { weekday: 'short' }).charAt(0)}</span>
                                    <span className={`text-[10px] font-bold ${new Date().toDateString() === date.toDateString() ? 'text-indigo-600' : 'text-gray-900'}`}>{date.getDate()}</span>
                                </div>
                            ))}
                        </div>

                        {/* Chart Rows */}
                        <div className="relative">
                            {/* Grid vertical lines */}
                            <div className="absolute inset-0 flex">
                                {daysArray.map((date, i) => (
                                    <div key={i} className={`w-10 flex-shrink-0 border-r border-gray-50/30 h-full ${[0, 6].includes(date.getDay()) ? 'bg-gray-50/20' : ''}`} />
                                ))}
                            </div>

                            {/* Task Bars */}
                            {sortedTasks.map((task, index) => (
                                <div key={task.id} className="h-14 border-b border-gray-50/50 relative flex items-center">
                                    <div 
                                        className={`absolute h-8 rounded-full flex items-center px-4 text-[10px] font-black text-white uppercase tracking-widest cursor-pointer hover:scale-[1.05] active:scale-95 transition-all z-20 ${getPriorityColor(task.priority || 'medium')}`}
                                        style={{ 
                                            left: `${getXPosition(task._start)}px`, 
                                            width: `${getWidth(task._start, task._due)}px` 
                                        }}
                                        onClick={() => onTaskClick?.(task)}
                                    >
                                        <span className="truncate">{task.title}</span>
                                    </div>
                                </div>
                            ))}

                            {/* Today Indicator */}
                            {getXPosition(new Date()) >= 0 && getXPosition(new Date()) <= totalDays * 40 && (
                                <div 
                                    className="absolute top-0 bottom-0 w-px bg-blue-500 z-30 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    style={{ left: `${getXPosition(new Date())}px` }}
                                >
                                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
                                    <div className="absolute top-0 px-2 py-0.5 bg-blue-500 text-white text-[8px] font-black rounded-r uppercase">Hoy</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer Legend */}
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex gap-6 px-10">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Urgente</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Alta</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Media</span>
                </div>
            </div>
        </div>
    );
}
