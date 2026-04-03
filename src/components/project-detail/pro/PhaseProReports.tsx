'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, LayoutDashboard, CheckSquare, Users, MapPin, ClipboardCheck, Truck, Wallet, TrendingDown, History } from 'lucide-react';

interface PhaseProReportsProps {
  reportsData: any;
  fetchReportsData: () => void;
  budgetSummary: any[];
  expenses: any[];
  activities: any[];
}

export const PhaseProReports: React.FC<PhaseProReportsProps> = ({
  reportsData,
  fetchReportsData,
  budgetSummary,
  expenses,
  activities
}) => {
  return (
    <motion.div
      key="reports"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-10 pb-20"
    >
      {/* Reports Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Reportes de Producción</h2>
          <p className="text-sm text-gray-500 uppercase font-black tracking-widest mt-1">Operational & Financial Intelligence</p>
        </div>
        <button
          type="button"
          onClick={fetchReportsData}
          className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full text-indigo-600 transition-all border border-gray-100 shadow-sm"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* 1. OPERATIONS SUMMARY */}
      <div className="space-y-6">
        <label className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] pl-1 flex items-center gap-2">
          <LayoutDashboard size={12} className="text-indigo-500" /> Resumen Operativo
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Tareas Realizadas', value: `${reportsData.operations?.completed_tasks || 0}/${reportsData.operations?.total_tasks || 0}`, icon: CheckSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Talentos en Casting', value: reportsData.operations?.total_casting_profiles || 0, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { label: 'Locaciones Seleccionadas', value: reportsData.operations?.total_locations || 0, icon: MapPin, color: 'text-rose-500', bg: 'bg-rose-50' },
            { label: 'Reportes de Avanzada', value: reportsData.operations?.total_scouting_reports || 0, icon: ClipboardCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
          ].map((item) => (
            <div key={item.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2 hover:border-indigo-100 transition-colors">
              <div className={`p-2 w-fit rounded-xl ${item.bg} ${item.color}`}>
                <item.icon size={20} />
              </div>
              <p className="text-2xl font-black text-gray-900">{item.value}</p>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. LOGISTICS SUMMARY */}
      <div className="space-y-6">
        <label className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] pl-1 flex items-center gap-2">
          <Truck size={12} className="text-orange-500" /> Resumen de Logística
        </label>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:border-indigo-100 transition-colors">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            <div className="p-8 text-center space-y-1">
              <p className="text-3xl font-black text-gray-900">{reportsData.logistics?.total_call_sheets || 0}</p>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Call Sheets</p>
            </div>
            <div className="p-8 text-center space-y-1">
              <p className="text-3xl font-black text-gray-900">{reportsData.logistics?.total_transport_requests || 0}</p>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Transportes</p>
            </div>
            <div className="p-8 text-center space-y-1">
              <p className="text-3xl font-black text-gray-900">{reportsData.logistics?.total_catering_orders || 0}</p>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Órdenes Catering</p>
            </div>
            <div className="p-8 text-center space-y-1">
              <p className="text-3xl font-black text-gray-900">{reportsData.logistics?.total_suppliers_linked || 0}</p>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Proveedores</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FINANCIAL SUMMARY */}
      <div className="space-y-6">
        <label className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] pl-1 flex items-center gap-2">
          <Wallet size={12} className="text-emerald-500" /> Resumen Financiero
        </label>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stats */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-10 hover:border-emerald-100 transition-colors">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Presupuesto Ejecutado</p>
                <h4 className="text-5xl font-black text-gray-900 tracking-tighter">
                  ${(reportsData.financial?.total_actual_spent || 0).toLocaleString()}
                </h4>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Planificado</p>
                <p className="text-xl font-bold text-gray-400">
                  ${(reportsData.financial?.total_budget_planned || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-4">
              <div className="w-full h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((reportsData.financial?.total_actual_spent || 0) / (reportsData.financial?.total_budget_planned || 1)) * 100, 100)}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full ${((reportsData.financial?.total_actual_spent || 0) / (reportsData.financial?.total_budget_planned || 1)) > 0.9 ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                />
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-emerald-600">Restante: ${(reportsData.financial?.total_remaining_budget || 0).toLocaleString()}</span>
                <span className="text-gray-400">Ejecución: {Math.round(((reportsData.financial?.total_actual_spent || 0) / (reportsData.financial?.total_budget_planned || 1)) * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Expenses by Category List */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 hover:border-indigo-100 transition-colors">
            <h5 className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">Gastos por Categoría</h5>
            <div className="space-y-4">
              {budgetSummary.map((cat: any, i: number) => {
                const actual = expenses.filter(e => e.category === cat.category).reduce((sum, e) => sum + Number(e.amount), 0);
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-xs font-bold capitalize text-gray-700">{cat.category}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-900">${actual.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. ACTIVITY REPORT */}
      <div className="space-y-6">
        <label className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] pl-1 flex items-center gap-2">
          <History size={12} className="text-indigo-500" /> Registro de Actividad Reciente
        </label>
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
          {activities.slice(0, 10).map((activity: any) => (
            <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                  {activity.profiles?.avatar_url ? (
                    <img src={activity.profiles.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                    <Users size={16} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{activity.description}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-0.5">
                    {activity.profiles?.full_name} • {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100 uppercase font-black">
                {activity.action_type || activity.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
