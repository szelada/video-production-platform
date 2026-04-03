'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Video,
  Plus,
  Filter,
  Search,
  Calendar as CalendarIcon,
  ChevronDown,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'tarea' as 'tarea' | 'rodaje',
    project_id: ''
  });
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchEvents();
    fetchProjects();
  }, [currentDate]);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('id, name').order('name');
    setProjects(data || []);
    if (data && data.length > 0) {
      setNewEvent(prev => ({ ...prev, project_id: data[0].id }));
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data: callSheets } = await supabase
        .from('call_sheets')
        .select('*, projects(name)')
        .gte('shoot_date', start.toISOString())
        .lte('shoot_date', end.toISOString());

      const { data: tasks } = await supabase
        .from('tasks')
        .select('*, projects(name)')
        .gte('due_date', start.toISOString())
        .lte('due_date', end.toISOString());

      const combined = [
        ...(callSheets || []).map(cs => ({
          id: cs.id,
          type: 'rodaje',
          title: `Rodaje: ${cs.projects?.name}`,
          time: '08:00',
          date: new Date(cs.shoot_date),
          color: 'bg-blue-500',
          textColor: 'text-blue-100',
          icon: Video
        })),
        ...(tasks || []).map(t => ({
          id: t.id,
          type: 'tarea',
          title: t.title,
          time: '10:00',
          date: new Date(t.due_date),
          color: 'bg-amber-500',
          textColor: 'text-amber-100',
          icon: Clock
        }))
      ];

      setEvents(combined);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, currentMonth: false });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true });
    }
    // Next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, currentMonth: false });
    }
    return days;
  };

  const rainbowColors = [
    'text-rose-500', 
    'text-indigo-500', 
    'text-amber-500', 
    'text-emerald-500', 
    'text-cyan-500', 
    'text-blue-500', 
    'text-violet-500'
  ];

  const rainbowBgs = [
    'bg-rose-50/5', 
    'bg-indigo-50/5', 
    'bg-amber-50/5', 
    'bg-emerald-50/5', 
    'bg-cyan-50/5', 
    'bg-blue-50/5', 
    'bg-violet-50/5'
  ];

  return (
    <div className="min-h-screen bg-zinc-950 p-8 pt-24 lg:pt-8 lg:ml-[100px] xl:ml-[280px]">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-[#DFFF00] text-black text-[10px] font-black rounded-full uppercase tracking-widest">Cronograma</span>
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">2026 Production</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tightest capitalize">
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-zinc-900/50 p-1.5 rounded-[1.5rem] border border-zinc-800/50">
              <button 
                onClick={() => setViewMode('month')}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'month' ? 'bg-white text-black shadow-xl shadow-white/10' : 'text-zinc-500 hover:text-white'}`}>
                Mes
              </button>
              <button 
                onClick={() => setViewMode('agenda')}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'agenda' ? 'bg-white text-black shadow-xl shadow-white/10' : 'text-zinc-500 hover:text-white'}`}>
                Agenda
              </button>
            </div>
            
            <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-[1.5rem] border border-zinc-800/50">
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 text-zinc-500 hover:text-white transition-all"><ChevronLeft size={20} /></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white">Hoy</button>
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 text-zinc-500 hover:text-white transition-all"><ChevronRight size={20} /></button>
            </div>

            <button 
              onClick={() => setIsEventModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#DFFF00] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-lime-400/10"
            >
              <Plus size={16} /> Nuevo Evento
            </button>
          </div>
        </div>

        {/* Modal: Nuevo Evento */}
        <AnimatePresence>
          {isEventModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEventModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                
                <header className="flex items-center justify-between mb-10 relative z-10">
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tightest">Nuevo Evento</h2>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Sincroniza con el cronograma global</p>
                  </div>
                  <button 
                    onClick={() => setIsEventModalOpen(false)}
                    className="p-3 bg-zinc-800 text-zinc-400 rounded-2xl hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                </header>

                <div className="space-y-8 relative z-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Proyecto</label>
                    <select 
                      value={newEvent.project_id}
                      onChange={(e) => setNewEvent({ ...newEvent, project_id: e.target.value })}
                      className="w-full px-8 py-5 bg-zinc-800/50 border border-white/5 rounded-[2rem] text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-lime-400/10 transition-all appearance-none"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Título del Evento</label>
                    <input 
                      type="text" 
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="ESCRIBE EL NOMBRE..."
                      className="w-full px-8 py-5 bg-zinc-800/50 border border-white/5 rounded-[2rem] text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-lime-400/10 transition-all font-mono uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Fecha</label>
                      <input 
                        type="date" 
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="w-full px-8 py-5 bg-zinc-800/50 border border-white/5 rounded-[2rem] text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-lime-400/10 transition-all hide-calendar-picker-indicator"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Tipo</label>
                      <select 
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                        className="w-full px-8 py-5 bg-zinc-800/50 border border-white/5 rounded-[2rem] text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-lime-400/10 transition-all appearance-none"
                      >
                        <option value="tarea">Tarea / Hito</option>
                        <option value="rodaje">Día de Rodaje</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={async () => {
                      try {
                        setLoading(true);
                        if (newEvent.type === 'tarea') {
                          const { error } = await supabase
                            .from('tasks')
                            .insert([{
                              project_id: newEvent.project_id,
                              title: newEvent.title,
                              due_date: newEvent.date,
                              status: 'pending'
                            }]);
                          if (error) throw error;
                        } else {
                          const { error } = await supabase
                            .from('call_sheets')
                            .insert([{
                              project_id: newEvent.project_id,
                              shoot_date: newEvent.date,
                              status: 'draft'
                            }]);
                          if (error) throw error;
                        }
                        setIsEventModalOpen(false);
                        fetchEvents();
                        setNewEvent({ ...newEvent, title: '' });
                      } catch (err: any) {
                        alert("Error al crear evento: " + err.message);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="w-full py-6 bg-[#DFFF00] text-black rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-lime-400/20 mt-4"
                  >
                    Crear Evento Maestro
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="bg-zinc-900/30 backdrop-blur-xl rounded-[3.5rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          {viewMode === 'month' ? (
            <div className="relative z-10">
              {/* Weekdays Labels - Rainbow Style */}
              <div className="grid grid-cols-7 gap-6 mb-8">
                {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map((day, i) => (
                  <div key={day} className="text-center">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${rainbowColors[i]}`}>{day}</span>
                  </div>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-6">
                {getDaysInMonth().map((d, i) => {
                  const dayEvents = events.filter(e => e.date.getDate() === d.day && d.currentMonth);
                  const colIndex = i % 7;
                  
                  return (
                    <div 
                      key={i} 
                      className={`min-h-[160px] rounded-[2.5rem] border transition-all group relative p-6 ${
                        d.currentMonth 
                          ? `${rainbowBgs[colIndex]} border-white/5 hover:border-white/20 hover:bg-white/5` 
                          : 'bg-transparent border-transparent opacity-20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-xl font-black ${d.day === new Date().getDate() && d.currentMonth ? 'text-[#DFFF00]' : 'text-white'}`}>
                          {d.day}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-[#DFFF00] shadow-[0_0_10px_#DFFF00]" />
                        )}
                      </div>

                      <div className="space-y-2">
                        {dayEvents.map(event => (
                          <div 
                            key={event.id}
                            className={`p-2 rounded-xl bg-zinc-800/50 border border-white/5 flex items-center gap-2 group/event hover:bg-zinc-700 transition-all cursor-pointer`}
                          >
                            <div className={`w-1 h-3 rounded-full ${event.color}`} />
                            <span className="text-[9px] font-black text-zinc-300 truncate tracking-tight">{event.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col gap-8">
              {/* Agenda View Implementation */}
              {Array.from({ length: 7 }).map((_, i) => {
                const day = new Date(currentDate);
                day.setDate(day.getDate() + i);
                const dayEvents = events.filter(e => e.date.getDate() === day.getDate());
                
                return (
                  <div key={i} className="flex gap-8 group">
                    <div className="w-32 pt-2 text-right">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{day.toLocaleDateString('es-ES', { weekday: 'short' })}</p>
                      <p className="text-2xl font-black text-white">{day.getDate()}</p>
                    </div>
                    <div className="flex-1 space-y-4">
                      {dayEvents.length > 0 ? (
                        dayEvents.map(event => (
                          <div key={event.id} className="bg-white/5 hover:bg-white/10 p-6 rounded-[2rem] border border-white/5 transition-all flex items-center justify-between group/card hover:scale-[1.01]">
                            <div className="flex items-center gap-6">
                              <div className={`w-12 h-12 rounded-2xl ${event.color} flex items-center justify-center text-white shadow-2xl`}>
                                <event.icon size={20} />
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-white tracking-tight mb-1">{event.title}</h4>
                                <div className="flex items-center gap-3 text-zinc-500">
                                  <Clock size={12} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">{event.time} - 10:00</span>
                                  <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Proyecto: Nike Core</span>
                                </div>
                              </div>
                            </div>
                            <button className="px-6 py-2 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover/card:opacity-100 transition-all">Ver Detalles</button>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 px-8 border border-dashed border-white/5 rounded-[2.5rem] flex items-center justify-center">
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Sin compromisos para este día</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
