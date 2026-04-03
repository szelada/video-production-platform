'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Camera, Clock, User, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AssistantFeed() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fallbackProjectId, setFallbackProjectId] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
    fetchFallbackProject();
  }, []);

  const fetchFallbackProject = async () => {
    const { data } = await supabase.from('projects').select('id').order('created_at', { ascending: false }).limit(1).single();
    if (data) setFallbackProjectId(data.id);
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('scouting_reports')
        .select(`
          *,
          projects(name),
          profiles:reported_by(full_name, avatar_url),
          scouting_report_photos(file_url)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching scouting reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Clock size={24} className="text-zinc-200 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-1 pb-6 h-full flex flex-col">
      {reports.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-100">
            <MessageSquare size={24} />
          </div>
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Sin reportes registrados</p>
        </div>
      ) : (
        <div className="flex flex-col gap-0 divide-y divide-zinc-50">
          {reports.map((report, i) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={report.id}
              className="p-6 hover:bg-zinc-50/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-white overflow-hidden shadow-sm shrink-0">
                  {report.profiles?.avatar_url ? (
                    <img src={report.profiles.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-white">
                      {report.profiles?.full_name?.charAt(0) || 'A'}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tight">{report.profiles?.full_name || 'Asistente'}</span>
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {report.projects?.name}
                  </p>
                  <p className="text-xs text-zinc-600 font-medium leading-relaxed mb-3 line-clamp-2 italic">
                    "{report.notes || 'Sin notas adicionales'}"
                  </p>
                  
                  {report.scouting_report_photos?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {report.scouting_report_photos.slice(0, 3).map((photo: any, idx: number) => (
                        <div key={idx} className="w-16 h-16 rounded-xl border border-white shadow-sm overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                          <img src={photo.file_url} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {report.scouting_report_photos.length > 3 && (
                        <div className="w-16 h-16 rounded-xl bg-zinc-900/10 flex items-center justify-center text-[10px] font-black text-zinc-500 border border-white shrink-0">
                          +{report.scouting_report_photos.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer / Connect Button */}
      <div className="mt-auto p-6 border-t border-zinc-50">
         <button 
           onClick={() => {
             if (reports[0]?.project_id) {
               window.location.href = `/projects/${reports[0].project_id}?tab=pro&subtab=logistics`;
             } else if (fallbackProjectId) {
               window.location.href = `/projects/${fallbackProjectId}?tab=pro&subtab=logistics`;
             } else {
               window.location.href = '/projects';
             }
           }}
           className="w-full py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
         >
           Ver Canal de Scouting
         </button>
      </div>
    </div>
  );
}
