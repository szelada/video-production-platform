import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Calendar, TrendingDown, UserMinus, MessageSquare, Paperclip } from 'lucide-react';

interface KanbanBoardProps {
    tasks: any[];
    crew: any[];
    onStatusChange: (taskId: string, newStatus: string) => void;
    onMemberAssign: (taskId: string, memberId: string) => void;
    onTaskClick: (task: any) => void;
    onDeleteTask: (taskId: string) => void;
}

const COLUMNS = [
    { id: 'pending', title: 'Pendiente', color: 'bg-gray-100', dot: 'bg-gray-400' },
    { id: 'in_progress', title: 'En Proceso', color: 'bg-indigo-50/50', dot: 'bg-indigo-600' },
    { id: 'blocked', title: 'Bloqueada', color: 'bg-red-50/50', dot: 'bg-red-500' },
    { id: 'completed', title: 'Completada', color: 'bg-emerald-50/50', dot: 'bg-emerald-500' }
];

export default function KanbanBoard({ tasks, crew, onStatusChange, onMemberAssign, onTaskClick, onDeleteTask }: KanbanBoardProps) {
    const [mounted, setMounted] = useState(false);
    const [localTasks, setLocalTasks] = useState<any[]>(tasks);
    const lastMovedTaskRef = React.useRef<{ id: string, time: number } | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // If a task was recently moved, we check if the incoming tasks prop still has the old status
        // We only want to update localTasks if the incoming tasks prop is actually NEWER/Different
        // than our optimistic state, OR if enough time has passed (e.g. 5 seconds)
        const now = Date.now();
        const recentMove = lastMovedTaskRef.current;
        
        if (recentMove && now - recentMove.time < 5000) {
            // Merge: keep the moved task's status from localTasks, take rest from props
            const mergedTasks = tasks.map(t => {
                if (t.id === recentMove.id) {
                    const local = localTasks.find(lt => lt.id === t.id);
                    return local || t;
                }
                return t;
            });
            setLocalTasks(mergedTasks);
        } else {
            setLocalTasks(tasks);
        }
    }, [tasks]);

    const handleDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        // 1. Check if dropped on a MEMBER (Assignment)
        if (destination.droppableId.startsWith('member-')) {
            const memberId = destination.droppableId.replace('member-', '');
            onMemberAssign(draggableId, memberId);
            return;
        }

        // 2. Check if dropped on a COLUMN (Status Change)
        if (source.droppableId !== destination.droppableId) {
            lastMovedTaskRef.current = { id: draggableId, time: Date.now() };
            const updatedTasks = localTasks.map(task => 
                task.id === draggableId ? { ...task, status: destination.droppableId } : task
            );
            setLocalTasks(updatedTasks);
            onStatusChange(draggableId, destination.droppableId);
        }
    };

    if (!mounted) {
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Cargando Tablero Kanban...</div>;
    }

    // Filter tasks into columns
    const getTasksByStatus = (status: string) => {
        return localTasks.filter(t => (t.status || 'pending') === status).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col lg:flex-row gap-6 p-1 h-full">
                {/* Main Kanban Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 overflow-x-auto pb-4">
                    {COLUMNS.map((col) => {
                        const colTasks = getTasksByStatus(col.id);

                        return (
                            <div key={col.id} className={`flex flex-col rounded-3xl border border-gray-100 min-h-[500px] ${col.color}`}>
                                <div className="p-4 border-b border-gray-100/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">{col.title}</h3>
                                    </div>
                                    <div className="bg-white/50 px-2 py-0.5 rounded-md text-[10px] font-black text-gray-500">
                                        {colTasks.length}
                                    </div>
                                </div>

                                <Droppable droppableId={col.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex-1 p-4 space-y-4 transition-colors ${snapshot.isDraggingOver ? 'bg-black/5' : ''}`}
                                        >
                                            {colTasks.map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-white p-5 rounded-2xl border transition-all cursor-grab group ${snapshot.isDragging ? 'shadow-2xl border-indigo-300 scale-105 rotate-2 z-[100]' : 'shadow-sm border-gray-100 hover:border-indigo-200'}`}
                                                            onClick={() => onTaskClick(task)}
                                                        >
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div className={`w-8 h-2 rounded-full ${task.priority === 'urgent' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : task.priority === 'medium' ? 'bg-indigo-500' : 'bg-gray-200'}`} />
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                                                                    className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <UserMinus size={14} />
                                                                </button>
                                                            </div>

                                                            <h4 className="text-sm font-bold text-gray-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{task.title}</h4>

                                                            <div className="flex flex-wrap gap-2 mb-4">
                                                                {task.due_date && (
                                                                    <div className="flex items-center gap-1 text-[9px] text-gray-500 uppercase font-black tracking-widest bg-gray-50 px-2 py-1 rounded-md">
                                                                        <Calendar size={10} />
                                                                        {new Date(task.due_date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    {task.profiles?.avatar_url ? (
                                                                        <img src={task.profiles.avatar_url} className="w-6 h-6 rounded-full border border-gray-100" />
                                                                    ) : (
                                                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500 border border-gray-200">
                                                                            {task.profiles?.full_name?.charAt(0) || '?'}
                                                                        </div>
                                                                    )}
                                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter truncate max-w-[80px]">
                                                                        {task.profiles?.full_name || 'Sin asignar'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>

                {/* Sidebar: Crew Assignment (Drop Targets) */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
                    <div className="bg-gray-50/50 p-5 rounded-[32px] border border-gray-100">
                        <div className="mb-4">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Asignación Rápida</h3>
                            <p className="text-[9px] text-gray-400 italic mt-0.5">Arrastra tareas aquí</p>
                        </div>
                        
                        <div className="space-y-2">
                            {crew.map((member: any) => (
                                <Droppable key={member.profiles?.id} droppableId={`member-${member.profiles?.id}`}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                                                snapshot.isDraggingOver 
                                                ? 'bg-indigo-600 border-indigo-600 shadow-lg scale-[1.02]' 
                                                : 'bg-white border-gray-50 hover:border-indigo-100'
                                            }`}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                                                {member.profiles?.avatar_url ? (
                                                    <img src={member.profiles.avatar_url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-[10px] font-black text-gray-400">{member.profiles?.full_name?.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className={`text-[10px] font-bold truncate ${snapshot.isDraggingOver ? 'text-white' : 'text-gray-900'}`}>
                                                    {member.profiles?.full_name}
                                                </p>
                                                <p className={`text-[8px] font-black uppercase tracking-widest truncate ${snapshot.isDraggingOver ? 'text-indigo-100' : 'text-gray-400'}`}>
                                                    {member.roles?.name || 'Staff'}
                                                </p>
                                            </div>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DragDropContext>
    );
}
