'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Users, ChevronRight, Activity, CheckCircle2, Clock, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function ProjectShortcut({ project }: { project: any }) {
  const [approvedCasting, setApprovedCasting] = useState<any[]>([]);
  const [taskProgress, setTaskProgress] = useState(0);

  useEffect(() => {
    fetchProjectExtras();
  }, [project.id]);

  const fetchProjectExtras = async () => {
    try {
      const { data: casting } = await supabase
        .from('casting_profiles')
        .select('*, casting_photos(file_url)')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      setApprovedCasting(casting || []);

      const { count: totalTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', project.id);
      
      const { count: completedTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', project.id)
        .eq('status', 'completed');

      if (totalTasks && totalTasks > 0) {
          setTaskProgress(Math.round((completedTasks || 0) / totalTasks * 100));
      }
    } catch (error) {
      console.error('Error fetching project extras:', error);
    }
  };

  const statusConfig: any = {
    'active': { bg: 'bg-[#007AFF]/10', text: 'text-[#007AFF]', icon: Activity, label: 'En Rodaje' },
    'draft': { bg: 'bg-zinc-50', text: 'text-zinc-400', icon: Clock, label: 'Pre-Pro' },
    'completed': { bg: 'bg-emerald-50', text: 'text-emerald-500', icon: CheckCircle2, label: 'Finalizado' }
  };

  const config = statusConfig[project.status?.toLowerCase()] || statusConfig.draft;

  return (
    <Link href={`/projects/${project.id}`} className="group block h-full">
      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 hover:border-indigo-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 flex flex-col h-full group relative overflow-hidden">
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className={`px-4 py-1.5 rounded-xl ${config.bg} ${config.text} text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/50 shadow-sm`}>
            <config.icon size={12} />
            {config.label}
          </div>
          <button className="p-2 hover:bg-zinc-50 rounded-xl transition-all text-zinc-300 hover:text-zinc-600">
             <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="space-y-2 mb-8 relative z-10">
           <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">{project.client_name || 'STUDIO MASTER'}</p>
           <h4 className="text-2xl font-black text-zinc-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-all">
             {project.name}
           </h4>
        </div>

        {/* Compact Progress */}
        <div className="mt-auto space-y-6 relative z-10">
           <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                 <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Progreso</span>
                 <span className="text-[10px] font-black text-zinc-900">{taskProgress}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-50 rounded-full overflow-hidden border border-zinc-100/50">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${taskProgress}%` }}
                   transition={{ duration: 1, ease: "easeOut" }}
                   className={`h-full ${taskProgress === 100 ? 'bg-emerald-400' : 'bg-indigo-500'} rounded-full`}
                 />
              </div>
           </div>

           <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
              <div className="flex -space-x-2">
                {approvedCasting.length > 0 ? (
                    approvedCasting.map((c, i) => (
                        <div key={c.id} className="w-10 h-10 rounded-full border-4 border-white bg-zinc-50 overflow-hidden shadow-sm hover:scale-110 hover:z-20 transition-all cursor-pointer">
                            {c.casting_photos?.[0]?.file_url ? (
                                <img src={c.casting_photos[0].file_url} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-zinc-400">{c.full_name?.charAt(0)}</div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="w-10 h-10 rounded-full bg-zinc-50 border-4 border-white flex items-center justify-center text-zinc-200">
                        <Users size={14} />
                    </div>
                )}
              </div>
              
              <div className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-2xl border border-zinc-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all">
                 <ChevronRight size={16} className="text-zinc-300 group-hover:text-white transition-all" />
              </div>
           </div>
        </div>
      </div>
    </Link>
  );
}
