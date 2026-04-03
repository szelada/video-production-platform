'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WidgetFrame from './WidgetFrame';
import AgendaWidget from './widgets/AgendaWidget';
import ProjectShortcut from './widgets/ProjectShortcut';
import AssistantFeed from './widgets/AssistantFeed';
import CalendarWidget from './widgets/CalendarWidget';
import { 
  Plus, 
  Settings, 
  Bell, 
  Search, 
  Sparkles,
  Calendar,
  Briefcase,
  PanelRightClose,
  PanelRightOpen,
  Activity,
  Maximize2,
  Home,
  LayoutDashboard,
  FolderOpen,
  Users,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function MasterControlGrid() {
  const [isStatusOpen, setIsStatusOpen] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects(data || []);
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] relative h-[calc(100vh-theme(spacing.24))] overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Bento Grid Layout Area */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
           <div className="h-full grid grid-cols-12 grid-rows-6 gap-6">
              
              {/* Card 1: Status Hero (The Vibrant Accent) */}
              <div className="col-span-12 lg:col-span-8 row-span-3 bg-gradient-to-br from-[#DFFF00] to-[#BFFF00] rounded-[3rem] p-10 shadow-2xl shadow-lime-200/40 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                 <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                       <div className="flex items-center gap-3 mb-6">
                          <span className="px-3 py-1 bg-black text-white text-[9px] font-black rounded-lg uppercase tracking-widest">LIVE STATUS</span>
                          <span className="text-lime-900 text-[9px] font-black uppercase tracking-widest opacity-60">5 Proyectos Activos</span>
                       </div>
                       <h2 className="text-5xl font-black text-lime-950 tracking-tightest max-w-2xl leading-[1.1]">
                          Monitorea tu producción en tiempo real con <span className="text-black">Precisión IA</span>
                       </h2>
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                       <button className="px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Crear Nuevo Proyecto</button>
                       <div className="flex -space-x-3">
                          {[1, 2, 3, 4].map(i => (
                             <div key={i} className="w-10 h-10 rounded-full border-4 border-lime-400 bg-white" />
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Card 2: Calendar Shortcut (One Screen Fit) */}
              <div className="col-span-12 lg:col-span-4 row-span-6 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden flex flex-col">
                 <CalendarWidget />
              </div>

              {/* Card 3: Recent Projects (Compact Grid) */}
              <div className="col-span-12 lg:col-span-8 row-span-3 bg-white/40 rounded-[3rem] flex flex-col gap-6">
                 <div className="flex items-center justify-between px-4">
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Proyectos Recientes</h3>
                    <button className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-all flex items-center gap-2">Ver Todo <ChevronRight size={14} /></button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-0 overflow-y-auto pr-2 scrollbar-hide">
                    <AnimatePresence>
                       {projects.slice(0, 4).map((p, i) => (
                          <motion.div
                            key={p.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                          >
                             <ProjectShortcut project={p} />
                          </motion.div>
                       ))}
                    </AnimatePresence>
                 </div>
              </div>

           </div>
        </div>

      {/* Side Monitor Toggle (Optional floating) */}
      <button 
        onClick={() => setIsStatusOpen(!isStatusOpen)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-zinc-900 text-white rounded-3xl shadow-3xl hover:scale-110 active:scale-95 transition-all z-[60] flex items-center justify-center"
      >
        <Activity size={28} />
      </button>

      {/* Side Status Panel Overlay */}
      <AnimatePresence>
        {isStatusOpen && (
          <motion.aside
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 100 }}
            className="fixed right-6 top-6 bottom-6 w-[400px] bg-white/80 backdrop-blur-2xl rounded-[4rem] border border-white/50 shadow-[0_50px_100px_rgba(0,0,0,0.1)] z-[100] flex flex-col overflow-hidden"
          >
             <div className="p-10 border-b border-gray-100 flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-black tracking-tightest text-zinc-900">Estado Vital</h3>
                   <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mt-1">Real-time Feed</p>
                </div>
                <button onClick={() => setIsStatusOpen(false)} className="p-3 bg-zinc-50 text-zinc-400 rounded-2xl hover:text-zinc-900 transition-all">
                   <PanelRightClose size={20} />
                </button>
             </div>
             
             <div className="flex-1 overflow-auto p-10 space-y-12">
                <section className="space-y-6">
                   <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Feed de Asistencia</h4>
                      <button className="text-[10px] font-bold text-indigo-500">Ver Canal</button>
                   </div>
                   <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                      <AssistantFeed />
                   </div>
                </section>

                <section className="space-y-6">
                   <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Próximos Hitos</h4>
                   </div>
                   <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-4">
                      <AgendaWidget />
                   </div>
                </section>
             </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
