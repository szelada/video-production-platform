'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Film, 
  Wallet, 
  CheckCircle2, 
  Rocket, 
  Plus, 
  Video, 
  Download, 
  BarChart3, 
  IdCard, 
  Check, 
  Package, 
  RefreshCw 
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';


interface PhaseEntregaProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  budgetSummary: any[];
  expenses: any[];
}

export const PhaseEntrega: React.FC<PhaseEntregaProps> = ({
  activeSubTab,
  setActiveSubTab,
  budgetSummary,
  expenses
}) => {
  return (
    <motion.div
      key="entrega-phase"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      {/* ENTREGA: RESUMEN */}
      {activeSubTab === 'resumen' && (
        <div className="space-y-10">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 rounded-[3rem] p-12 text-white shadow-2xl shadow-emerald-100/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">Fase de Finalización</span>
                <span className="flex items-center gap-2 text-emerald-100 text-[10px] font-bold">
                  <Rocket size={12} /> Listo para entrega
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tight leading-tight mb-4">Mesa de Entrega <br/> & Cierre</h1>
              <p className="text-emerald-100/80 text-lg max-w-xl font-medium">
                Gestiona los entregables finales, aprueba versiones con el cliente y realiza el balance financiero para el cierre formal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <StatCard
              icon={Film}
              title="Entregables Totales"
              value="12/12"
              secondary="Listos para revisión"
              color="text-emerald-600"
            />
            <StatCard
              icon={Wallet}
              title="Balance Financiero"
              value={`$${(budgetSummary.reduce((acc: number, curr: any) => acc + curr.planned, 0)).toLocaleString()}`}
              secondary={(() => {
                const totalPlanned = budgetSummary.reduce((acc: number, curr: any) => acc + curr.planned, 0);
                const totalSpent = expenses.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
                const percent = totalPlanned > 0 ? (totalSpent / totalPlanned * 100).toFixed(1) : "0";
                return `${percent}% Ejecutado`;
              })()}
              color="text-blue-600"
            />
            <StatCard
              icon={CheckCircle2}
              title="Estado de Cierre"
              value="85%"
              secondary="Checklist de liquidación"
              color="text-amber-600"
            />
          </div>
        </div>
      )}

      {/* ENTREGA: ENTREGABLES */}
      {activeSubTab === 'entregables' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Piezas Finales & Adaptaciones</h2>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
              <Plus size={16} /> Añadir Versión
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 1, title: 'Master 60" - Color Final', type: 'Master', status: 'approved', date: '2024-03-20', version: 'v3.0' },
              { id: 2, title: 'Adaptación RRSS 15" - 9:16', type: 'Social', status: 'pending', date: '2024-03-21', version: 'v1.2' },
              { id: 3, title: 'Corte de Director 45"', type: 'Alternative', status: 'shipped', date: '2024-03-22', version: 'v2.1' },
            ].map((item) => (
              <div key={item.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group lg:min-h-[220px] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      item.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      item.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {item.status === 'approved' ? 'Aprobado' : item.status === 'pending' ? 'Pendiente' : 'En Revision'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{item.version}</span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-2">
                    <Film size={12} /> {item.type} • {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 mt-8">
                  <button className="flex-1 py-3 bg-gray-50 text-gray-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                    <Video size={14} /> Ver Pieza
                  </button>
                  <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ENTREGA: FINANZAS */}
      {activeSubTab === 'finanzas' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Sustentación Financiera</h2>
            <div className="flex gap-4">
              <button className="bg-white border border-gray-100 text-gray-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
                <Download size={16} /> Exportar Excel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart3 size={14} className="text-indigo-600" /> Balance General Activo
              </h3>
              
              <div className="space-y-6">
                {budgetSummary.map((cat: any) => {
                  const percent = (cat.spent / cat.planned) * 100;
                  return (
                    <div key={cat.category} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{cat.category}</span>
                          <span className="text-sm font-black text-gray-900">${cat.spent.toLocaleString()} <span className="text-gray-400 font-bold">/ ${cat.planned.toLocaleString()}</span></span>
                        </div>
                        <span className={`text-[10px] font-black ${percent > 100 ? 'text-red-500' : 'text-emerald-500'} uppercase`}>
                          {percent.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percent, 100)}%` }}
                          className={`h-full ${percent > 100 ? 'bg-red-500' : 'bg-emerald-500'} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-8">Estado de Liquidación</h3>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-indigo-100 opacity-60">Utilidad Proyectada</span>
                  <span className="text-2xl font-black text-emerald-400">+$12,450.00</span>
                </div>
                
                <div className="flex items-center justify-between mb-10">
                  <span className="text-sm font-medium text-indigo-100 opacity-60">Gastos No Sustentados</span>
                  <span className="text-2xl font-black text-orange-400">$0.00</span>
                </div>
                
                <button className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all shadow-xl active:scale-95">
                  CERRAR CAJA CHICA
                </button>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Próximos Pagos Pendientes</h4>
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 border border-gray-100">
                          <IdCard size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">Proveedor S.A.C</p>
                          <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">Factura #4059</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-gray-900">$1,500.00</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ENTREGA: CIERRE */}
      {activeSubTab === 'cierre' && (
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Cierre Formal del Proyecto</h2>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">
              Una vez que todos los entregables estén aprobados y los gastos sustentados, puedes proceder a la liquidación final.
            </p>
          </div>

          <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-4">Checklist de Liquidación</h3>
                 {[
                   { label: 'Entregables Aprobados', checked: true },
                   { label: 'Gastos Sustentados (100%)', checked: true },
                   { label: 'Material Base Archivado', checked: false },
                   { label: 'Feedback de Cliente Recibido', checked: true },
                   { label: 'Facturación Final Emitida', checked: false },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 group cursor-pointer">
                     <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 group-hover:border-indigo-200'}`}>
                       {item.checked && <Check size={14} strokeWidth={3} />}
                     </div>
                     <span className={`text-sm font-bold ${item.checked ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</span>
                   </div>
                 ))}
              </div>

              <div className="bg-gray-50 p-8 rounded-[2.5rem] space-y-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Resumen de Activos</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Branding Kit', size: '12 MB' },
                    { label: 'Biblia del Proyecto', size: '4.5 MB' },
                    { label: 'Master File', size: '1.2 GB' },
                  ].map((asset, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <Package size={14} className="text-gray-400" />
                        <span className="font-bold text-gray-600">{asset.label}</span>
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase">{asset.size}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                  <Download size={14} /> Descargar Proyecto Completo
                </button>
              </div>
            </div>

            <div className="pt-10 border-t border-gray-50">
              <button className="w-full py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-4 border-t border-white/10">
                <RefreshCw size={18} /> CERRAR Y ARCHIVAR PROYECTO
              </button>
              <p className="text-center text-[9px] text-gray-400 font-black uppercase tracking-widest mt-6 opacity-50">
                * Al cerrar, el proyecto pasará a modo de solo lectura y se guardará en el historial.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
