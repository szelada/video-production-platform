'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, Video, FileText, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AgendaWidget() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fallbackProjectId, setFallbackProjectId] = useState<string | null>(null);

  useEffect(() => {
    fetchAgenda();
    fetchFallbackProject();
  }, []);

  const fetchFallbackProject = async () => {
    const { data } = await supabase.from('projects').select('id').order('created_at', { ascending: false }).limit(1).single();
    if (data) setFallbackProjectId(data.id);
  };

  const fetchAgenda = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split('T')[0];

      // 1. Fetch Call Sheets
      const { data: callSheets } = await supabase
        .from('call_sheets')
        .select('*, projects(name)')
        .gte('shoot_date', today)
        .lte('shoot_date', nextWeekStr)
        .order('shoot_date', { ascending: true });

      // 2. Fetch Tasks with due dates
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*, projects(name)')
        .gte('due_date', today)
        .lte('due_date', nextWeekStr)
        .order('due_date', { ascending: true });

      // 3. Combine and Format
      const combined = [
        ...(callSheets || []).map(cs => ({
          id: cs.id,
          type: 'call_sheet',
          title: `RODAJE: ${cs.projects?.name}`,
          date: cs.shoot_date,
          project: cs.projects?.name,
          projectId: cs.project_id,
          icon: Video,
          color: 'text-rose-500',
          bg: 'bg-rose-50'
        })),
        ...(tasks || []).map(t => ({
          id: t.id,
          type: 'task',
          title: t.title,
          date: t.due_date,
          project: t.projects?.name,
          projectId: t.project_id,
          icon: FileText,
          color: 'text-indigo-500',
          bg: 'bg-indigo-50'
        }))
      ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setEvents(combined);
    } catch (error) {
      console.error('Error fetching agenda:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center animate-pulse">
        <Clock size={24} className="text-zinc-200 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-1 pb-6">
      {events.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-100">
            <Calendar size={24} />
          </div>
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Sin compromisos próximos</p>
          <button 
            onClick={() => {
              if (events[0]?.projectId) {
               window.location.href = `/projects/${events[0].projectId}?tab=pro&subtab=tasks`;
             } else if (fallbackProjectId) {
               window.location.href = `/projects/${fallbackProjectId}?tab=pro&subtab=tasks`;
             } else {
               window.location.href = '/projects';
             }
            }}
            className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-2 hover:underline"
          >
            Programar Acción
          </button>
        </div>
      ) : (
        <div className="divide-y divide-zinc-50">
          {events.map((event) => (
            <Link key={event.id} href={`/projects/${event.projectId}`} className="block group">
              <div className="p-6 flex items-start gap-4 hover:bg-zinc-50/50 transition-colors">
                <div className={`w-12 h-12 rounded-2xl ${event.bg} flex items-center justify-center ${event.color} shadow-sm group-hover:scale-110 transition-transform`}>
                  <event.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1 flex items-center gap-2">
                    {new Date(event.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                    <span className="w-1 h-1 rounded-full bg-zinc-200" />
                    {event.project}
                  </p>
                  <h4 className="text-sm font-bold text-zinc-900 truncate tracking-tight">{event.title}</h4>
                </div>
                <ChevronRight size={16} className="text-zinc-200 group-hover:text-zinc-400 mt-2 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
