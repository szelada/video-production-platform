'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Briefcase, Plus, UserPlus, CheckSquare, Users, 
  MapPin, Calendar, TrendingDown, Clock, Truck, Camera, MoreVertical, X, Loader2
} from 'lucide-react';
import Link from 'next/link';
import AlternateDashboard from '@/components/dashboard/alternate/AlternateDashboard';

interface PhaseProOverviewProps {
  isAlternateView: boolean;
  project: any;
  tasks: any[];
  crew: any[];
  locations: any[];
  setIsAddExpenseModalOpen: (open: boolean) => void;
  setIsAddSupplierModalOpen: (open: boolean) => void;
  setIsAddLocationModalOpen: (open: boolean) => void;
  setActiveSubTab: (tab: string) => void;
  setIsAddCastingModalOpen: (open: boolean) => void;
  setIsAddTaskModalOpen: (open: boolean) => void;
  casting: any[];
  activities: any[];
}

export const PhaseProOverview: React.FC<PhaseProOverviewProps> = ({
  isAlternateView,
  project,
  tasks,
  crew,
  locations,
  setIsAddExpenseModalOpen,
  setIsAddSupplierModalOpen,
  setIsAddLocationModalOpen,
  setActiveSubTab,
  setIsAddCastingModalOpen,
  setIsAddTaskModalOpen,
  casting,
  activities
}) => {
  if (isAlternateView) {
    return (
      <motion.div
        key="overview-alternate"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full"
      >
        <AlternateDashboard 
          project={project} 
          tasks={tasks} 
          crew={crew} 
          locations={locations} 
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 lg:grid-cols-4 gap-8"
    >
      <div className="lg:col-span-3 space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setIsAddExpenseModalOpen(true)}
            className="flex flex-col items-center gap-3 p-6 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Gasto</span>
          </button>
          <button
            onClick={() => setIsAddSupplierModalOpen(true)}
            className="flex flex-col items-center gap-3 p-6 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Proveedor</span>
          </button>
           <button
            onClick={() => {
              setActiveSubTab('tasks');
              setIsAddTaskModalOpen(true);
            }}
            className="flex flex-col items-center gap-3 p-6 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tarea</span>
          </button>
          <button
            onClick={() => setIsAddCastingModalOpen(true)}
            className="flex flex-col items-center gap-3 p-6 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserPlus size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Casting</span>
          </button>
        </div>

        {/* Tasks Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckSquare size={20} className="text-indigo-600" /> Tareas del Proyecto
            </h2>
            <Link href="/tasks" className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1 transition-colors">
              Gestionar <Plus size={14} />
            </Link>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
            {tasks.length > 0 ? tasks.slice(0, 5).map(task => (
              <div key={task.id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${task.priority === 'urgent' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]' :
                    task.priority === 'high' ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`} />
                  <div>
                    <p className="text-sm text-gray-900 font-bold">{task.title}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">{task.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{task.due_date}</span>
                  <button type="button" onClick={() => setActiveSubTab('tasks')} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="p-16 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckSquare size={24} className="text-gray-200" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No hay tareas asignadas aún.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users size={20} className="text-purple-600" /> Casting Seleccionado
              </h2>
              <button 
                onClick={() => setIsAddCastingModalOpen(true)}
                className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1 transition-colors"
                >
                Vincular <Plus size={12} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {casting.length > 0 ? casting.map(c => (
                <div key={c.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-indigo-100 transition-colors">
                  <div className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {c.casting_photos?.length > 0 ? (
                      <img src={c.casting_photos[0]?.file_url} alt={c.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <Users size={24} className="text-gray-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{c.full_name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">{c.casting_profiles?.age_range || c.age_range} años</p>
                  </div>
                </div>
              )) : (
                <div className="p-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Sin perfiles vinculados.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin size={20} className="text-emerald-600" /> Locaciones
              </h2>
              <button 
                onClick={() => setIsAddLocationModalOpen(true)}
                className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1 transition-colors"
                >
                Vincular <Plus size={12} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {locations.length > 0 ? locations.map(l => (
                <div key={l.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-indigo-100 transition-colors">
                  <div className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {l.main_photo_url || l.location_photos?.length > 0 ? (
                      <img src={l.main_photo_url || l.location_photos[0]?.file_url} alt={l.name} className="w-full h-full object-cover" />
                    ) : (
                      <MapPin size={24} className="text-gray-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{l.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">{l.city}</p>
                  </div>
                </div>
              )) : (
                <div className="p-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Sin locaciones registradas.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm space-y-7">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Briefcase size={14} className="text-indigo-600" /> Información
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mb-1.5">Cliente</p>
              <p className="text-sm text-gray-900 font-bold">{project.client_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mb-1.5">Cronograma</p>
              <div className="flex items-center gap-2 text-sm text-gray-900 font-bold">
                <Calendar size={14} className="text-indigo-600" />
                <span>{project.start_date || '?'} — {project.end_date || '?'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm space-y-7">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <TrendingDown size={14} className="text-indigo-600 rotate-180" /> Actividad Reciente
          </h3>
          <div className="space-y-7 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
            {activities.length > 0 ? activities.slice(0, 5).map((act) => (
              <div key={act.id} className="relative pl-9 space-y-1.5">
                <div className="absolute left-0 w-6 h-6 rounded-full border border-white bg-gray-50 flex items-center justify-center z-10 shadow-sm">
                   <Clock size={12} className="text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{act.description}</p>
                <span className="block text-[9px] text-gray-300 uppercase font-black tracking-widest">{new Date(act.created_at).toLocaleDateString()}</span>
              </div>
            )) : (
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-center py-4">Sin actividad reciente.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
