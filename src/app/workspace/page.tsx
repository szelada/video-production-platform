'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Briefcase,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  Calendar,
  Filter,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyWorkspace() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkspaceData();
  }, []);

  const fetchWorkspaceData = async () => {
    setLoading(true);
    try {
      // 1. Get Current User
      let { data: { user: authUser } } = await supabase.auth.getUser();

      const isDemo = !authUser;
      if (isDemo) {
        authUser = {
          id: 'mock-user-id',
          email: 'demo@916studio.com',
          user_metadata: { name: 'Demo User' }
        } as any;
      }

      setUser(authUser);

      // 2. Fetch Tasks
      let tasksQuery = supabase
        .from('tasks')
        .select('*, projects(name)')
        .order('due_date', { ascending: true });

      if (!isDemo) {
        tasksQuery = tasksQuery.eq('assigned_to', authUser?.id);
      }

      const { data: tasksData } = await tasksQuery.limit(10);

      // 3. Fetch Projects
      let membershipsData: any[] = [];
      if (!isDemo) {
        const { data: memberships } = await supabase
          .from('project_members')
          .select('project_id, roles(name), projects(*)')
          .eq('profile_id', authUser?.id);
        membershipsData = memberships || [];
      } else {
        const { data: allProjects } = await supabase.from('projects').select('*').limit(6);
        membershipsData = (allProjects || []).map(p => ({
          project_id: p.id,
          roles: { name: 'Admin (Demo)' },
          projects: p
        }));
      }

      // 4. Fetch Activities
      let activitiesData: any[] = [];
      if (isDemo) {
        const { data: act } = await supabase
          .from('project_activity')
          .select('*, projects(name)')
          .order('created_at', { ascending: false })
          .limit(10);
        activitiesData = act || [];
      } else if (membershipsData && membershipsData.length > 0) {
        const projectIds = membershipsData.map(m => m.project_id);
        const { data: act } = await supabase
          .from('project_activity')
          .select('*, projects(name)')
          .in('project_id', projectIds)
          .order('created_at', { ascending: false })
          .limit(10);
        activitiesData = act || [];
      }

      setTasks(tasksData || []);
      setMyProjects(membershipsData);
      setActivities(activitiesData);

    } catch (error) {
      console.error('Error fetching workspace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    setIsUpdating(taskId);
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

      // Log Activity
      if (user) {
        const task = tasks.find(t => t.id === taskId);
        await supabase.from('project_activity').insert([{
          project_id: task.project_id,
          action: 'task_updated',
          description: `Tarea "${task.title}" marcada como ${newStatus.toUpperCase()} por el usuario.`,
          created_at: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-white/20" size={40} />
        <p className="text-muted-foreground text-sm animate-pulse uppercase tracking-[0.2em]">Cargando tu espacio...</p>
      </div>
    );
  }

  if (!user) {
    // This will now rarely be hit due to our demo fallback, but keeping for safety
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6">
        <AlertCircle size={48} className="text-white/10" />
        <h2 className="text-xl font-bold uppercase tracking-tighter text-zinc-900">Sesión no detectada</h2>
        <p className="text-zinc-500 max-w-sm">Debes iniciar sesión para acceder a tu workspace personal.</p>
        <Link href="/projects" className="px-6 py-2 bg-zinc-900 text-white text-xs font-black uppercase rounded-lg">Ir a Proyectos</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-20"
    >
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-1">Mi Espacio</h1>
          <p className="text-zinc-500 font-medium tracking-widest uppercase text-[10px]">Personal Workspace</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-zinc-900 uppercase">{user?.email?.split('@')[0]}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Miembro Activo</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-xl font-black text-white shadow-lg">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Dark Container Wraps Everything Below */}
      <div className="bg-[#1C1C1E] rounded-[40px] p-6 lg:p-10 shadow-2xl space-y-12">
        
        {/* Executive Overview (General Producer Perspective) */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-indigo-500 rounded-full" />
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">Vista Ejecutiva</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Control de Salud Global</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Proyectos Activos', value: myProjects.length, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Tareas Globales', value: tasks.length, icon: CheckSquare, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Presupuesto Promedio', value: '85%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Días a Entrega', value: '12', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#2C2C2E] p-6 rounded-[32px] border border-transparent hover:border-white/10 transition-all">
                <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column: Tasks & Projects */}
          <div className="lg:col-span-2 space-y-10">

            {/* Section: My Tasks */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare size={18} className="text-amber-400" />
                  <h2 className="text-lg font-black uppercase tracking-tight text-white">Mis Tareas</h2>
                  <span className="ml-2 px-3 py-1 rounded-full bg-white/5 text-[10px] font-black text-zinc-300">
                    {tasks.filter(t => t.status !== 'completed').length} Pendientes
                  </span>
                </div>
                <Link href="/tasks" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 px-4 py-2 rounded-full">Ver todas</Link>
              </div>

              <div className="grid gap-4">
                {tasks.length > 0 ? tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`bg-[#2C2C2E] p-5 rounded-[24px] border transition-all flex items-center justify-between ${task.status === 'completed' ? 'border-transparent opacity-60' : 'border-transparent hover:border-zinc-700 hover:-translate-y-1'}`}
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <button
                        onClick={() => handleToggleTaskStatus(task.id, task.status)}
                        disabled={isUpdating === task.id}
                        className={`min-w-[40px] w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
                      >
                        {isUpdating === task.id ? <Loader2 size={18} className="animate-spin" /> : (task.status === 'completed' ? <CheckCircle2 size={20} /> : <Circle size={20} />)}
                      </button>
                      <div className="overflow-hidden">
                        <h3 className={`text-sm font-bold uppercase tracking-tight truncate ${task.status === 'completed' ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>{task.title}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 truncate max-w-[120px] bg-zinc-800 px-2 py-0.5 rounded-full">{task.projects?.name}</span>
                          <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${new Date(task.due_date) < new Date() && task.status !== 'completed' ? 'text-red-400' : 'text-emerald-400'}`}>
                            <Calendar size={10} /> {task.due_date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md bg-zinc-900/50 ${task.priority === 'urgent' ? 'text-red-500' :
                        task.priority === 'high' ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="py-12 bg-[#2C2C2E] rounded-[32px] border border-zinc-800 border-dashed flex flex-col items-center justify-center text-center gap-4">
                    <CheckSquare size={32} className="text-zinc-600" />
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">No tienes tareas asignadas</p>
                  </div>
                )}
              </div>
            </section>

            {/* Section: Project Health & Progress */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-blue-400" />
                  <h2 className="text-lg font-black uppercase tracking-tight text-white">Salud de Proyectos</h2>
                </div>
                <Link href="/projects" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 px-4 py-2 rounded-full">Ver todos</Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myProjects.length > 0 ? myProjects.map((entry) => {
                  const progress = Math.floor(Math.random() * 60) + 20; // Mock progress for now
                  const statusColor = progress > 70 ? 'bg-emerald-500' : progress > 40 ? 'bg-blue-500' : 'bg-amber-500';
                  
                  return (
                    <Link key={entry.project_id} href={`/projects/${entry.project_id}`} className="group">
                      <div className="bg-[#2C2C2E] p-8 rounded-[40px] border border-transparent hover:border-white/5 transition-all shadow-lg hover:-translate-y-1 h-full flex flex-col group">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${statusColor === 'bg-emerald-500' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : statusColor === 'bg-blue-500' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{entry.projects.status}</span>
                          </div>
                          <ArrowUpRight size={18} className="text-zinc-600 group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                        
                        <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2 group-hover:text-indigo-400 transition-colors leading-none">{entry.projects.name}</h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-6">{entry.projects.client_name}</p>
                        
                        <div className="mt-auto space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Progreso de Tareas</span>
                              <span className="text-[10px] font-black text-white">{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${statusColor}`} 
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-[#2C2C2E] flex items-center justify-center text-[8px] font-black text-zinc-500">
                                  {String.fromCharCode(64 + i)}
                                </div>
                              ))}
                              <div className="w-6 h-6 rounded-full bg-indigo-500/20 border-2 border-[#2C2C2E] flex items-center justify-center text-[8px] font-black text-indigo-400">
                                +5
                              </div>
                            </div>
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                              {entry.roles?.name || 'Producer'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }) : (
                  <div className="col-span-full py-12 bg-[#2C2C2E] rounded-[32px] border border-zinc-800 border-dashed flex flex-col items-center justify-center text-center gap-4">
                    <Briefcase size={32} className="text-zinc-600" />
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">No estás vinculado a ningún proyecto</p>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* Right Column: Activity Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-purple-400" />
                <h2 className="text-lg font-black uppercase tracking-tight text-white">Actividad Reciente</h2>
              </div>
            </div>

            <div className="bg-[#2C2C2E] rounded-[32px] border border-transparent p-6 space-y-6 min-h-[500px]">
              {activities.length > 0 ? activities.map((act, idx) => (
                <div key={act.id} className="relative pl-6 pb-6 border-l border-zinc-800 last:pb-0">
                  <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">{new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {act.projects?.name}</p>
                  <h4 className="text-xs font-black uppercase text-zinc-200 mb-1.5">{act.action.replace(/_/g, ' ')}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium line-clamp-2">{act.description}</p>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 gap-4 opacity-50">
                  <Clock size={32} className="text-zinc-600" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sin actividad reciente</p>
                </div>
              )}
              {activities.length > 0 && (
                <div className="pt-6 text-center border-t border-zinc-800">
                  <button className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">Sincronizar Feed</button>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-[32px] border border-indigo-500/20">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-indigo-300">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-3xl font-black text-white">{tasks.length}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 text-nowrap">Total Tareas</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-emerald-400">{Math.round((tasks.filter(t => t.status === 'completed').length / (tasks.length || 1)) * 100)}%</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80 text-nowrap">Completado</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
