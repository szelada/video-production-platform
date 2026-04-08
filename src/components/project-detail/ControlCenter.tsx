'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  Users,
  CheckCircle2,
  Timer
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ControlCenterProps {
  project: any;
  nextAction?: {
    label: string;
    url: string;
  };
  alerts?: Array<{
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    actionUrl?: string;
    subTab?: string;
  }>;
  todaySummary?: {
    crewCall?: string;
    location?: string;
    shoot_day?: string;
  };
  crew?: any[];
  onAlertClick?: (alert: any) => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({ 
  project, 
  nextAction, 
  alerts = [], 
  todaySummary,
  crew = [],
  onAlertClick
}) => {
  return (
    <div className="space-y-8 pb-20">
      {/* LEVEL 1: HERO ACTION & STATUS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 overflow-hidden"
        >
          <div className="glass-bento p-10 h-full flex flex-col justify-between relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Rocket size={120} className="text-white" />
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D9FF54] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Next Strategic Move</span>
              </div>
              <h2 className="text-5xl font-black text-white tracking-tighter leading-tight max-w-2xl">
                {nextAction?.label || "Definir Próxima Acción Estratégica"}
              </h2>
            </div>

            <div className="mt-10 flex items-center gap-4 relative z-10">
              <Button 
                variant="primary" 
                size="lg" 
                className="bg-[#D9FF54] text-black hover:bg-[#c4e64c] rounded-2xl px-10 py-8 text-sm font-black uppercase tracking-widest shadow-2xl shadow-[#D9FF54]/20 group/btn"
              >
                Ejecutar Ahora
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="hidden sm:flex items-center gap-6 px-8 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Estado Actual</span>
                  <span className="text-xs font-bold text-white uppercase">{project.status === 'production' ? 'Producción Activa' : 'Pre-Producción'}</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Día del Proyecto</span>
                  <span className="text-xs font-bold text-[#D9FF54]">Día {project.current_day_number || 1}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* PROJECT VELOCITY / STATS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4"
        >
          <div className="glass-bento p-8 h-full flex flex-col justify-between border-white/5">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Salud del Proyecto</span>
                <TrendingUp size={16} className="text-[#D9FF54]" />
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Tareas Completadas', value: '78%', progress: 78, color: 'bg-[#D9FF54]' },
                  { label: 'Presupuesto Usado', value: '42%', progress: 42, color: 'bg-white' },
                  { label: 'Aprobaciones EP', value: '12/15', progress: 80, color: 'bg-indigo-500' },
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                      <span className="text-white/60">{stat.label}</span>
                      <span className="text-white">{stat.value}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.progress}%` }}
                        className={`h-full ${stat.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full mt-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-[0.2em] transition-all">
              Ver Reporte de Auditoría
            </button>
          </div>
        </motion.div>
      </section>

      {/* LEVEL 2: ALERTS (BLOCKERS) */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <AlertTriangle size={16} className="text-rose-500" />
          <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Alertas Críticas & Bloqueos</h3>
          <div className="h-[1px] flex-1 bg-white/5 ml-2" />
          <Badge variant="error" className="bg-rose-500/10 text-rose-500 border-rose-500/20">{alerts.length}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => onAlertClick && onAlertClick(alert)}
                className={`p-6 rounded-2xl border flex items-start gap-4 transition-all hover:scale-[1.02] cursor-pointer group ${
                  alert.type === 'error' 
                    ? 'bg-rose-500/5 border-rose-500/20' 
                    : alert.type === 'warning'
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  alert.type === 'error' ? 'text-rose-500' : 'text-amber-500'
                }`}>
                  <AlertTriangle size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white group-hover:text-[#D9FF54] transition-colors">{alert.message}</p>
                  <span className="text-[10px] font-black uppercase text-white/30 tracking-widest group-hover:text-white transition-colors">
                    Resolver Ahora →
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="lg:col-span-3 py-10 glass-bento flex flex-col items-center justify-center text-center space-y-3 opacity-50">
              <CheckCircle2 size={32} className="text-[#D9FF54]" />
              <p className="text-xs font-bold text-white uppercase tracking-widest">Sin bloqueos activos. Operación al 100%.</p>
            </div>
          )}
        </div>
      </section>

      {/* LEVEL 3: TODAY OPERATIONS & ACTIVE MODULES */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* HOY SECTION */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-white/5">
            <Calendar size={16} className="text-[#D9FF54]" />
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Agenda del Día</h3>
          </div>

          <div className="glass-bento p-8 space-y-8">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#D9FF54] uppercase tracking-widest">Shooting Day</span>
                <h4 className="text-2xl font-black text-white italic uppercase">{todaySummary?.shoot_day || "Día 1 / Rodaje"}</h4>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
                <span className="text-2xl font-black text-white tabular-nums">12°</span>
                <span className="text-[8px] font-bold text-white/40 uppercase">Lima</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-white/40">
                  <Clock size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Crew Call</span>
                </div>
                <p className="text-xl font-black text-white tabular-nums">{todaySummary?.crewCall || "06:00 AM"}</p>
              </div>
              <div className="space-y-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-white/40">
                  <Timer size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Breakfast</span>
                </div>
                <p className="text-xl font-black text-white tabular-nums">06:30 AM</p>
              </div>
            </div>

            <div className="space-y-4 p-6 bg-[#D9FF54]/5 rounded-2xl border border-[#D9FF54]/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <MapPin size={40} className="text-[#D9FF54]" />
              </div>
              <div className="flex items-center gap-2 text-[#D9FF54]">
                <MapPin size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Locación del Día</span>
              </div>
              <p className="text-lg font-black text-white uppercase">{todaySummary?.location || "Parque Kennedy, Miraflores"}</p>
              <button className="text-[8px] font-black text-[#D9FF54] uppercase tracking-widest hover:underline">
                Abrir en Mapas →
              </button>
            </div>
          </div>
        </div>

        {/* CONTEXTUAL MODULES (BENTO GRID) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-white/5">
            <Rocket size={16} className="text-[#D9FF54]" />
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Módulos Activos</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Logística', icon: Users, color: 'text-indigo-400', count: crew.length },
              { label: 'Catering', icon: Clock, color: 'text-amber-400', count: '3' },
              { label: 'Casting', icon: Users, color: 'text-emerald-400', count: '12' },
              { label: 'Finanzas', icon: Timer, color: 'text-rose-400', count: '$12k' },
              { label: 'Transporte', icon: Timer, color: 'text-blue-400', count: '4' },
              { label: 'Equipos', icon: Rocket, color: 'text-purple-400', count: '8' },
            ].map((mod, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="glass-bento p-6 flex flex-col gap-4 cursor-pointer hover:border-white/20 transition-all border-white/5 shadow-sm"
              >
                <div className={`p-3 w-fit rounded-xl bg-white/5 ${mod.color}`}>
                  <mod.icon size={20} />
                </div>
                <div className="space-y-1">
                  <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest">{mod.label}</h5>
                  <p className="text-lg font-black text-white">{mod.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
