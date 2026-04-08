import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  AlertCircle,
  CheckCircle2,
  PieChart,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FinancialDashboardProps {
  financials: {
    revenue: number;
    planned: number;
    actual: number;
    margin: number;
  };
  projectId: string;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ financials, projectId }) => {
  const marginPercent = financials.revenue > 0 
    ? (financials.margin / financials.revenue) * 100 
    : 0;

  const burnRate = financials.planned > 0 
    ? (financials.actual / financials.planned) * 100 
    : 0;

  const isMarginHealthy = marginPercent > 20;

  const remainingBudget = financials.planned - financials.actual;
  const isOverBudget = financials.actual > financials.planned;

  return (
    <div className="space-y-12 pb-24">
      {/* LEVEL 1: FINANCIAL CONTROL (HERO) */}
      <div className="bento-grid-layout">
        {/* Main KPI: Presupuesto Restante (The most critical number) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-2 row-span-2 glass-bento p-12 flex flex-col justify-between relative overflow-hidden group shadow-2xl border-white/10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9FF54]/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-12">
              <div className={`w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center ${!isOverBudget ? 'text-[#D9FF54]' : 'text-rose-400'} shadow-inner`}>
                <DollarSign size={32} />
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${!isOverBudget ? 'bg-[#D9FF54]/10 border-[#D9FF54]/20 text-[#D9FF54]' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                {!isOverBudget ? 'Presupuesto Saludable' : 'Sobre-Gasto Detectado'}
              </div>
            </div>
            
            <div className="mt-auto">
              <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">Saldo Disponible para Operación</p>
              <h3 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                ${remainingBudget.toLocaleString()}
              </h3>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Costo Real</span>
                  <span className="text-xl font-bold text-white leading-none">${financials.actual.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Utilidad Proyectada</span>
                  <span className="text-xl font-bold text-[#D9FF54] leading-none">${financials.margin.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Small Cells: Revenue & Planned Cost */}
        {[
          { 
            label: 'Venta Total', 
            value: financials.revenue, 
            icon: Target, 
            color: 'text-indigo-400', 
            desc: 'Ingreso aprobado'
          },
          { 
            label: 'Techo de Gasto', 
            value: financials.planned, 
            icon: BarChart3, 
            color: 'text-white', 
            desc: 'Presupuesto base'
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-bento p-10 flex flex-col justify-between group hover:border-white/20 transition-all shadow-xl"
          >
            <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center ${stat.color} shadow-inner`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h4 className="text-3xl font-black text-white tracking-tighter">${stat.value.toLocaleString()}</h4>
            </div>
          </motion.div>
        ))}

        {/* Medium Cell: Alert System (Critical Decisions) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`col-span-1 md:col-span-2 glass-bento p-10 flex flex-col justify-between relative overflow-hidden group shadow-xl border ${burnRate > 90 ? 'border-rose-500/30' : 'border-white/5'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
          <div className="relative z-10 flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${burnRate > 90 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-[#D9FF54]/10 text-[#D9FF54] border-[#D9FF54]/20'}`}>
                {burnRate > 90 ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
              </div>
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Estado de Ejecución</p>
                <p className={`text-[9px] font-bold uppercase tracking-widest ${burnRate > 90 ? 'text-rose-400' : 'text-white/30'}`}>
                  {burnRate > 90 ? 'ALERTA: TECHO DE GASTO' : 'RITMO DE GASTO NORMAL'}
                </p>
              </div>
            </div>
            <span className="text-2xl font-black text-white">{burnRate.toFixed(1)}%</span>
          </div>
          
          <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 px-1 flex items-center">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${Math.min(burnRate, 100)}%` }}
               className={`h-2 rounded-full ${burnRate > 90 ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-[#D9FF54] shadow-[0_0_15px_rgba(217,255,84,0.3)]'} transition-all`}
             />
          </div>
        </motion.div>
      </div>

      {/* Main Analysis Area - Glass Bento style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Detail Analysis Chart View Replacement */}
        <div className="lg:col-span-2 glass-bento p-12 relative overflow-hidden group shadow-2xl border border-white/5 min-h-[400px]">
           <div className="flex items-center justify-between mb-16 px-2">
              <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Análisis Operativo</h3>
                <div className="flex items-center gap-3 mt-4">
                  <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">Detección de Anomalías</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-white/10 text-rose-500/20">
                <AlertCircle size={32} />
              </div>
           </div>

           <div className="space-y-12">
              {[
                { label: 'Transporte y Movilidad', planned: 2500, actual: 2300, risk: 'low' },
                { label: 'Catering y Alimentación', planned: 1200, actual: 1450, risk: 'high' },
                { label: 'Equipos y Cámara', planned: 8000, actual: 7500, risk: 'low' },
              ].map((category, i) => (
                <div key={i} className="group/item space-y-4">
                  <div className="flex justify-between items-end px-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{category.label}</span>
                      <p className="text-xl font-black text-white underline decoration-white/5 decoration-2 underline-offset-8">
                        ${category.actual.toLocaleString()}
                      </p>
                    </div>
                    {category.actual > category.planned && (
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest animate-pulse">Exceso de ${(category.actual - category.planned).toLocaleString()}</span>
                    )}
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(category.actual / category.planned) * 100}%` }}
                      className={`h-full ${category.actual > category.planned ? 'bg-rose-500' : 'bg-white/40'} rounded-full`}
                    />
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Actionable Insights - Premium Glass */}
        <div className="glass-bento p-12 bg-gradient-to-br from-indigo-600/20 to-blue-600/10 border border-indigo-500/20 shadow-2xl shadow-indigo-900/40 min-h-[500px] flex flex-col justify-between">
           <div className="space-y-12">
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 bg-white/5 backdrop-blur-3xl rounded-[1.5rem] flex items-center justify-center border border-white/10 shadow-xl">
                   <Sparkles size={32} className="text-[#D9FF54] drop-shadow-lg" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D9FF54]">Regie Intelligence</span>
                  <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-1">Financial Check</p>
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-6">Próximos Pasos</h3>
                <p className="text-white/60 text-xs font-medium leading-relaxed italic">
                  "{isOverBudget 
                    ? "Alerta: El presupuesto ha sido excedido. Revisar facturas de Catering inmediatamente." 
                    : `Cierre proyectado con una utilidad de **$${financials.margin.toLocaleString()}**. Mantener ritmo de gasto.`}"
                </p>
              </div>
              
              <div className="space-y-6">
                 {[
                   { text: 'Aprobar Gastos Pendientes (5)', done: false, urgent: true },
                   { text: 'Archivar comprobantes de equipo', done: true, urgent: false },
                   { text: 'Revisar margen de rentabilidad', done: marginPercent > 20, urgent: false }
                 ].map((tip, i) => (
                   <div key={i} className="flex items-center gap-5 group/item">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${tip.done ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : tip.urgent ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-white/5 border-white/10 text-white/40'}`}>
                        {tip.done ? <CheckCircle2 size={16} /> : tip.urgent ? <AlertCircle size={16} /> : <div className="w-2 h-2 rounded-full bg-white/20" />}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.1em] transition-all ${tip.done ? 'text-white/20 line-through' : 'text-white/70 group-hover/item:text-white'}`}>
                         {tip.text}
                      </span>
                   </div>
                 ))}
              </div>
           </div>

           <a 
             href={`/api/projects/${projectId}/financial-report/pdf`}
             target="_blank"
             rel="noreferrer"
             className="w-full bg-[#D9FF54] text-black py-6 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.03] active:scale-95 shadow-2xl shadow-[#D9FF54]/10 transition-all mt-12 text-center block"
           >
              Generar Reporte de Cierre
           </a>
        </div>
      </div>
    </div>
  );
};
