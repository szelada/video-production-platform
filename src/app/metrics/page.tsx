'use client';
import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Film,
  Calendar,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MetricsPage() {
  const stats = [
    { label: 'Eficiencia de Rodaje', value: '94%', change: '+2.4%', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Presupuesto Utilizado', value: '$142.5k', change: '-4.1%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Talento Confirmado', value: '128', change: '+12%', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Horas de Producción', value: '2,480', change: '+8%', icon: Clock, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  const container = {
    show: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  } as const;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10 p-8 lg:p-12 min-h-screen bg-[#F8F9FA]"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tightest text-zinc-900 leading-none mb-4">Métricas</h1>
          <p className="text-sm font-black text-zinc-400 uppercase tracking-widest leading-none">Análisis de rendimiento y KPIs de producción</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-8 py-4 rounded-[2rem] bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all shadow-sm">
             Exportar Reporte
           </button>
           <button className="px-8 py-4 rounded-[2rem] bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
             Actualizar Datos
           </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            variants={item}
            className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-all duration-500 group-hover:scale-110`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-xl ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <div className="mt-8">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-zinc-900 mt-2 tracking-tightest leading-none">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 auto-rows-[250px]">
        {/* Main Chart Slot */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 lg:row-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10 flex flex-col relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-zinc-900 tracking-tightest">Rendimiento Mensual</h3>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Comparativa de carga vs entrega</p>
            </div>
            <div className="flex gap-2">
               <button className="px-5 py-2 rounded-xl bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest">Global</button>
               <button className="px-5 py-2 rounded-xl bg-zinc-50 text-zinc-400 text-[9px] font-black uppercase tracking-widest hover:text-zinc-900 transition-all border border-gray-100">Por Proyecto</button>
            </div>
          </div>
          
          <div className="flex-1 flex items-end gap-3 pb-4">
             {[65, 45, 75, 55, 90, 70, 85, 60, 95, 80, 75, 85].map((val, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-3">
                 <div className="w-full relative group/bar">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ delay: 0.5 + (i * 0.05), duration: 1 }}
                      className="w-full bg-zinc-900 rounded-t-xl group-hover/bar:bg-indigo-500 transition-all cursor-crosshair relative"
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-zinc-900 text-white text-[8px] font-black px-2 py-1 rounded shadow-xl pointer-events-none uppercase">
                        {val}%
                      </div>
                    </motion.div>
                 </div>
                 <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">M{i+1}</span>
               </div>
             ))}
          </div>

          <div className="absolute bottom-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
             <BarChart3 size={300} strokeWidth={1} />
          </div>
        </motion.div>

        {/* Small Widgets */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 bg-zinc-900 rounded-[3rem] p-10 flex flex-col justify-between text-white shadow-2xl group"
        >
          <div className="flex justify-between items-start">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md">
              <Film size={24} className="text-lime-300" />
            </div>
            <ArrowUpRight className="text-white/30 group-hover:text-lime-300 transition-all" size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Producciones Activas</h4>
            <div className="flex items-end gap-3 mt-2">
              <span className="text-5xl font-black tracking-tightest leading-none">24</span>
              <span className="text-[10px] font-black text-lime-400 mb-2 uppercase tracking-widest">+4 nuevo</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-4 bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10 flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start">
             <div className="p-4 rounded-2xl bg-rose-50 text-rose-500">
                <Calendar size={24} strokeWidth={2.5} />
             </div>
             <div className="w-12 h-1 rounded-full bg-zinc-100 mt-6 overflow-hidden">
                <div className="h-full bg-rose-500 w-[70%]" />
             </div>
          </div>
          <div>
             <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Días hasta Deadline</h4>
             <div className="flex items-end gap-3 mt-2">
               <span className="text-5xl font-black text-zinc-900 tracking-tightest leading-none">12</span>
               <span className="text-[10px] font-black text-rose-500 mb-2 uppercase tracking-widest">CRÍTICO</span>
             </div>
          </div>
        </motion.div>

        {/* Talent Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-4 lg:row-span-1 bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10 flex flex-col group"
        >
           <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-500">
                 <Layers size={18} />
              </div>
              <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Distribución de Talento</h4>
           </div>
           
           <div className="space-y-5 flex-1">
              {[
                { name: 'Actores', count: 45, color: 'bg-indigo-500' },
                { name: 'Extras', count: 82, color: 'bg-zinc-200' },
                { name: 'Crew', count: 12, color: 'bg-amber-400' }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-zinc-500">{item.name}</span>
                     <span className="text-zinc-900">{item.count}</span>
                   </div>
                   <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / 140) * 100}%` }}
                        transition={{ delay: 1 + (i * 0.1), duration: 1 }}
                        className={`h-full ${item.color}`} 
                      />
                   </div>
                </div>
              ))}
           </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-8 lg:row-span-1 bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10 flex flex-col md:flex-row items-center gap-10 group"
        >
           <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-black text-zinc-900 tracking-tightest leading-tight">Estado de Salud <br /> del Sistema</h3>
              <p className="text-[11px] text-zinc-400 font-bold leading-relaxed max-w-xs">
                Todos los módulos operan al 100% de eficiencia. No se reportan cuellos de botella en la fase de pre-producción.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-xl w-fit">
                <ShieldCheck size={14} /> Sistema Optimizado
              </div>
           </div>
           <div className="w-full md:w-64 aspect-square bg-[#F8F9FA] rounded-[2.5rem] border border-gray-100 shadow-inner flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-40 h-40 rounded-full border-8 border-indigo-50/50 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-8 border-indigo-100/50 flex items-center justify-center">
                       <div className="w-24 h-24 rounded-full border-8 border-indigo-200/50 flex items-center justify-center">
                          <TrendingUp className="text-indigo-500" size={32} />
                       </div>
                    </div>
                 </div>
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                UPTIME 99.9%
              </div>
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
