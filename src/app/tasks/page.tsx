'use client';
import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Search,
  Filter,
  User,
  Calendar,
  Loader2,
  ExternalLink,
  AlertCircle,
  CheckSquare,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        fetchMyTasks(session.user.id);
      } else {
        // DEMO STATE
        setCurrentUser({ id: 'mock-user-id', email: 'demo@916studio.com' });
        fetchMyTasks('mock-user-id');
      }
    };
    getSession();
  }, []);

  const fetchMyTasks = async (userId: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          projects (
            id,
            name,
            code
          )
        `)
        .order('due_date', { ascending: true });

      if (userId !== 'mock-user-id') {
        query = query.eq('assigned_to', userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ));

      // Optional: Log activity (though usually logged at project level)
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await supabase.from('project_activity').insert([{
          project_id: task.project_id,
          action: 'task_updated',
          description: `Tarea "${task.title}" marcada como ${newStatus.toUpperCase()}`,
          created_at: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'in_progress': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'blocked': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-rose-500';
      case 'medium': return 'text-amber-500';
      default: return 'text-emerald-500';
    }
  };

  if (!currentUser && !loading) {
    // Hidden by demo state, kept for safety
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">Inicia sesión para ver tus tareas</h2>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-6 pb-20"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-1">Mis Tareas</h1>
          <p className="text-zinc-500 font-medium">Gestiona tus responsabilidades asignadas en todos los proyectos.</p>
        </div>
      </div>

      {/* Dark Container Wraps Everything Below */}
      <div className="bg-[#1C1C1E] rounded-[40px] p-6 lg:p-8 shadow-2xl space-y-8">

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pendientes', count: tasks.filter(t => t.status === 'pending').length, bg: 'bg-[#FEE5CD]', text: 'text-zinc-900' },
            { label: 'En Proceso', count: tasks.filter(t => t.status === 'in_progress').length, bg: 'bg-white', text: 'text-zinc-900' },
            { label: 'Completadas', count: tasks.filter(t => t.status === 'completed').length, bg: 'bg-[#A7A3FF]', text: 'text-white' },
            { label: 'Total', count: tasks.length, bg: 'bg-[#C1F0D0]', text: 'text-zinc-900' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} p-6 rounded-[28px] relative overflow-hidden group shadow-sm transition-transform hover:-translate-y-1`}>
              <p className={`text-[10px] font-black uppercase ${stat.text} opacity-70 tracking-widest mb-2`}>{stat.label}</p>
              <p className={`text-4xl font-black ${stat.text}`}>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Tabs / Filters */}
        <div className="flex items-center gap-6 border-b border-zinc-800 pb-2 overflow-x-auto no-scrollbar">
          {['all', 'pending', 'in_progress', 'completed', 'blocked'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`pb-4 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${filter === f ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              {f === 'all' ? 'Todas' : f.replace('_', ' ')}
              {filter === f && (
                <motion.div layoutId="taskFilter" className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-orange-500" />
              )}
            </button>
          ))}
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-orange-500" size={40} />
              <p className="text-zinc-500 text-sm font-medium animate-pulse">Cargando tus tareas...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-20 text-center bg-[#2C2C2E] rounded-[32px] border border-zinc-800 border-dashed">
              <CheckSquare size={48} className="mx-auto text-zinc-600 mb-4" />
              <p className="text-zinc-500 font-bold text-sm">No tienes tareas en esta categoría.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="bg-[#2C2C2E] group p-6 lg:p-8 rounded-[32px] border border-transparent hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div className="flex gap-4">
                  <div className={`w-1.5 rounded-full ${getPriorityColor(task.priority).replace('text', 'bg')}`} />
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className={`text-xl font-bold text-white ${task.status === 'completed' ? 'line-through opacity-40' : ''}`}>
                        {task.title}
                      </h3>
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <Link
                        href={`/projects/${task.projects?.id}`}
                        className="text-[10px] font-black text-emerald-300 uppercase tracking-widest hover:text-emerald-200 transition-colors flex items-center gap-1 bg-zinc-800 px-3 py-1.5 rounded-full"
                      >
                        {task.projects?.name} <ChevronRight size={12} strokeWidth={2.5} />
                      </Link>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 bg-zinc-800/50 px-3 py-1.5 rounded-full">
                        <Calendar size={14} className="text-zinc-400" />
                        <span>Expira: {new Date(task.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-5 md:ml-0">
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:border-zinc-500 transition-all cursor-pointer"
                  >
                    <option value="pending" className="bg-zinc-900 font-bold">Pendiente</option>
                    <option value="in_progress" className="bg-zinc-900 font-bold">En Progreso</option>
                    <option value="completed" className="bg-zinc-900 font-bold">Completada</option>
                    <option value="blocked" className="bg-zinc-900 font-bold">Bloqueada</option>
                  </select>

                  <Link
                    href={`/projects/${task.projects?.id}?tab=tasks`}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all border border-transparent hover:border-zinc-600"
                    title="Ver en proyecto"
                  >
                    <ExternalLink size={18} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
