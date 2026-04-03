'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2 as Maximize, 
  Clock,
  Video,
  X,
  Calendar as CalendarIcon,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('agenda');

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Fetch for current month or week
      const start = new Date(currentDate);
      start.setDate(1);
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
          startTime: '08:00',
          endTime: '18:00',
          date: new Date(cs.shoot_date),
          color: 'bg-[#E5F0FF] text-[#007AFF]',
          dot: 'bg-[#007AFF]',
          icon: Video
        })),
        ...(tasks || []).map(t => ({
          id: t.id,
          type: 'tarea',
          title: t.title,
          startTime: '10:00',
          endTime: '11:00',
          date: new Date(t.due_date),
          color: 'bg-[#F2F2F7] text-zinc-600',
          dot: 'bg-zinc-400',
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

  const hours = Array.from({ length: 15 }, (_, i) => i + 6); // 6:00 to 20:00

  return (
    <div className={`flex flex-col h-full bg-white rounded-[3rem] shadow-sm border border-zinc-100 overflow-hidden ${isExpanded ? 'fixed inset-4 z-50 m-0' : ''}`}>
      {/* Apple-style Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 transition-all">
         <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-6">
            <h3 className="text-sm font-black tracking-tightest text-zinc-900 capitalize leading-none">
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex bg-zinc-50 p-1 rounded-xl gap-1 w-fit">
               <button 
                 onClick={() => setViewMode('agenda')}
                 className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'agenda' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}>
                 Agenda
               </button>
               <button 
                 onClick={() => setViewMode('month')}
                 className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'month' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}>
                 Mes
               </button>
            </div>
         </div>

         <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
               <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-1.5 hover:bg-zinc-50 rounded-full transition-all text-zinc-400"><ChevronLeft size={16} /></button>
               <button onClick={() => setCurrentDate(new Date())} className="px-2 py-1 text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all">Hoy</button>
               <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-1.5 hover:bg-zinc-50 rounded-full transition-all text-zinc-400"><ChevronRight size={16} /></button>
            </div>
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 bg-zinc-900 text-white rounded-xl hover:scale-105 transition-all shadow-lg">
               {isExpanded ? <X size={16} /> : <Maximize size={16} />}
            </button>
         </div>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-auto bg-zinc-50/30">
        {viewMode === 'agenda' ? (
          <div className="flex h-full relative p-6">
             {/* Timeline Sidebar */}
             <div className="w-14 shrink-0 border-r border-gray-100 pr-3 space-y-8 pt-6">
                {hours.map(hour => (
                  <div key={hour} className="text-[8px] font-black text-zinc-400 text-right uppercase tracking-tighter h-8">
                    {hour}:00
                  </div>
                ))}
             </div>

             {/* Events Grid with Rainbow Columns */}
             <div className="flex-1 relative pt-6 ml-6 overflow-x-auto min-w-0 flex gap-4">
                {[0, 1, 2, 3].map(dayOffset => {
                   const day = new Date(currentDate);
                   day.setDate(day.getDate() + dayOffset);
                   const dayEvents = events.filter(e => e.date.getDate() === day.getDate());
                   
                   const rainbowColors = [
                     'bg-red-50/30 border-red-100/50',
                     'bg-amber-50/30 border-amber-100/50',
                     'bg-emerald-50/30 border-emerald-100/50',
                     'bg-blue-50/30 border-blue-100/50',
                   ];
                   const colorClass = rainbowColors[dayOffset % rainbowColors.length];

                   return (
                     <div key={dayOffset} className={`flex-1 min-w-[200px] rounded-[2rem] ${colorClass} border p-4 relative h-[740px]`}>
                        <div className="text-center mb-6">
                           <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                             {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                           </p>
                           <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-xl text-xs font-black ${day.getDate() === new Date().getDate() ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-900'}`}>
                             {day.getDate()}
                           </div>
                        </div>

                        {/* Grid Lines per Column */}
                        <div className="absolute inset-x-0 top-24 bottom-4 z-0 flex flex-col pointer-events-none">
                           {hours.map(hour => (
                             <div key={hour} className="h-10 border-b border-zinc-100/30 w-full" />
                           ))}
                        </div>

                        <div className="relative z-10">
                           {dayEvents.map(event => {
                              const startHour = parseInt(event.startTime.split(':')[0]);
                              const top = (startHour - 6) * 40 + 80; 
                              const height = 60; // fixed for now

                              return (
                                <div 
                                  key={event.id}
                                  style={{ top: `${top}px`, height: `${height}px` }}
                                  className={`absolute w-full p-3 rounded-2xl ${event.color} border border-white shadow-xl shadow-zinc-200/20 flex flex-col justify-between hover:scale-[1.05] transition-all cursor-pointer group`}
                                >
                                   <div>
                                      <p className="text-[7px] font-black uppercase tracking-widest opacity-60">{event.startTime}</p>
                                      <h4 className="text-[10px] font-black leading-tight tracking-tight truncate">{event.title}</h4>
                                   </div>
                                </div>
                              );
                           })}
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>
        ) : (
          <div className="p-8">
             {/* Month Grid View with Rainbow Effect */}
             <div className="grid grid-cols-7 gap-3">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d, i) => {
                   const rainbowText = [
                     'text-rose-400', 'text-indigo-400', 'text-amber-400', 
                     'text-emerald-400', 'text-cyan-400', 'text-blue-400', 'text-violet-400'
                   ];
                   return (
                     <div key={d} className={`text-center text-[10px] font-black uppercase tracking-widest mb-4 ${rainbowText[i]}`}>{d}</div>
                   );
                })}
                {Array.from({ length: 35 }).map((_, i) => {
                   const colIndex = i % 7;
                   const bgColors = [
                     'bg-rose-50/20', 'bg-indigo-50/20', 'bg-amber-50/20', 
                     'bg-emerald-50/20', 'bg-cyan-50/20', 'bg-blue-50/20', 'bg-violet-50/20'
                   ];
                   return (
                     <div key={i} className={`aspect-square ${bgColors[colIndex]} border border-gray-100/50 rounded-3xl p-4 hover:border-zinc-300 transition-all group flex flex-col justify-between cursor-pointer shadow-sm active:scale-95`}>
                        <span className="text-xs font-black text-zinc-900">{i + 1}</span>
                        <div className="flex gap-1 justify-end">
                           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm" />
                           <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-sm" />
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>
        )}
      </div>

      {/* Footer / Stats Bar */}
      <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
         <div className="flex gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#007AFF]" />
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Rodajes</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-zinc-400" />
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tareas</span>
            </div>
         </div>
         <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Apple Calendar Design System</p>
      </div>
    </div>
  );
}
