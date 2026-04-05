'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  DollarSign, Calculator, Percent, Calendar, 
  Save, RefreshCw, AlertCircle, CheckCircle2,
  TrendingUp, Wallet, Info, ArrowRight,
  Clock, Package, Users, Camera, Truck, 
  Utensils, Film, Microscope, ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickQuoteProps {
  projectId: string;
  project: any;
  budgetSummary: any[];
  onUpdate: () => void;
}

export const QuickQuote: React.FC<QuickQuoteProps> = ({
  projectId,
  project,
  budgetSummary,
  onUpdate
}) => {
  const [shootDays, setShootDays] = useState<number>(project?.total_shoot_days || 1);
  const [markupPercent, setMarkupPercent] = useState<number>(project?.markup_percentage || 15);
  const [localBudgets, setLocalBudgets] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Initialize local budgets from summary
  useEffect(() => {
    if (budgetSummary.length > 0) {
      setLocalBudgets(budgetSummary.map(b => ({
        id: b.budget_id,
        category: b.category,
        planned_amount: b.planned_amount,
        is_commissionable: b.is_commissionable ?? true,
        is_day_multiplier: b.is_day_multiplier ?? false
      })));
    }
  }, [budgetSummary]);

  // Icon mapping for categories
  const getCategoryIcon = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('equip')) return <Camera size={18} />;
    if (c.includes('crew') || c.includes('personal')) return <Users size={18} />;
    if (c.includes('talent')) return <Film size={18} />;
    if (c.includes('locac')) return <Camera size={18} />;
    if (c.includes('movil') || c.includes('transp')) return <Truck size={18} />;
    if (c.includes('cater')) return <Utensils size={18} />;
    if (c.includes('post')) return <Microscope size={18} />;
    if (c.includes('seguro')) return <ShieldCheck size={18} />;
    return <Package size={18} />;
  };

  // -----------------------------------------------------
  // CALCULATIONS
  // -----------------------------------------------------
  const totals = useMemo(() => {
    let baseCommissionable = 0;
    let baseExempt = 0;

    localBudgets.forEach(b => {
      const amount = b.is_day_multiplier ? b.planned_amount * shootDays : b.planned_amount;
      if (b.is_commissionable) {
        baseCommissionable += amount;
      } else {
        baseExempt += amount;
      }
    });

    const markupAmount = baseCommissionable * (markupPercent / 100);
    const grandTotal = baseCommissionable + baseExempt + markupAmount;

    return {
      baseCommissionable,
      baseExempt,
      baseTotal: baseCommissionable + baseExempt,
      markupAmount,
      grandTotal
    };
  }, [localBudgets, shootDays, markupPercent]);

  // -----------------------------------------------------
  // ACTIONS
  // -----------------------------------------------------
  const handleUpdateLocalAmount = (id: string, amount: number) => {
    setLocalBudgets(prev => prev.map(b => b.id === id ? { ...b, planned_amount: amount } : b));
  };

  const handleToggleFlag = (id: string, field: 'is_commissionable' | 'is_day_multiplier') => {
    setLocalBudgets(prev => prev.map(b => b.id === id ? { ...b, [field]: !b[field] } : b));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      // 1. Update project settings
      const { error: pError } = await supabase
        .from('projects')
        .update({
          total_shoot_days: shootDays,
          markup_percentage: markupPercent
        })
        .eq('id', projectId);
      
      if (pError) throw pError;

      // 2. Update all budget items
      const updatePromises = localBudgets.map(b => 
        supabase
          .from('project_budgets')
          .update({
            planned_amount: b.planned_amount,
            is_commissionable: b.is_commissionable,
            is_day_multiplier: b.is_day_multiplier
          })
          .eq('id', b.id)
      );

      await Promise.all(updatePromises);
      
      setSaveStatus('success');
      onUpdate();
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving quote:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Global Controls */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-100/50">
            <Calculator size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Cotización Rápida</h2>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em] mt-1">Reacción Ágil de Presupuesto Pre-pro</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600"><Calendar size={18} /></div>
            <div>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Días de Rodaje</p>
              <div className="flex items-center gap-2 mt-1">
                <button onClick={() => setShootDays(Math.max(1, shootDays - 1))} className="w-6 h-6 flex items-center justify-center bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors">-</button>
                <input 
                  type="number" 
                  value={shootDays} 
                  onChange={(e) => setShootDays(parseInt(e.target.value) || 1)}
                  className="w-12 text-center bg-transparent font-black text-gray-900 focus:outline-none"
                />
                <button onClick={() => setShootDays(shootDays + 1)} className="w-6 h-6 flex items-center justify-center bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors">+</button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600"><Percent size={18} /></div>
            <div>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Markup / Comisión</p>
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="number" 
                  value={markupPercent} 
                  onChange={(e) => setMarkupPercent(parseFloat(e.target.value) || 0)}
                  className="w-12 text-center bg-transparent font-black text-gray-900 focus:outline-none"
                />
                <span className="text-[10px] font-black text-gray-400">%</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl ${
              saveStatus === 'success' ? 'bg-emerald-500 text-white' :
              saveStatus === 'error' ? 'bg-rose-500 text-white' :
              'bg-gray-900 text-white hover:bg-black'
            }`}
          >
            {isSaving ? <RefreshCw size={18} className="animate-spin" /> : 
             saveStatus === 'success' ? <CheckCircle2 size={18} /> :
             saveStatus === 'error' ? <AlertCircle size={18} /> :
             <Save size={18} />}
            {isSaving ? 'GUARDANDO...' : saveStatus === 'success' ? 'ACTUALIZADO' : 'GUARDAR CAMBIOS'}
          </button>
        </div>
      </div>

      {/* Main Quoting Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Editable Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoría</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Config.</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Costo Unit/Día</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {localBudgets.map((item) => {
                  const categoryTotal = item.is_day_multiplier ? item.planned_amount * shootDays : item.planned_amount;
                  return (
                    <tr key={item.id} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-gray-100 text-gray-500 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{item.category}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                              {item.is_day_multiplier ? 'Costo Diario' : 'Costo Fijo'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleToggleFlag(item.id, 'is_day_multiplier')}
                            className={`p-2 rounded-xl transition-all ${item.is_day_multiplier ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-300'}`}
                            title={item.is_day_multiplier ? "Multiplica por días" : "Costo único"}
                          >
                            <Calendar size={14} />
                          </button>
                          <button 
                            onClick={() => handleToggleFlag(item.id, 'is_commissionable')}
                            className={`p-2 rounded-xl transition-all ${item.is_commissionable ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-300'}`}
                            title={item.is_commissionable ? "Aplica Markup" : "Exento de Markup"}
                          >
                            <Percent size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 max-w-[140px] px-4 py-2 bg-gray-50/80 rounded-xl border border-gray-100 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                          <span className="text-gray-400 font-bold">$</span>
                          <input 
                            type="number" 
                            value={item.planned_amount} 
                            onChange={(e) => handleUpdateLocalAmount(item.id, parseFloat(e.target.value) || 0)}
                            className="bg-transparent font-black text-gray-900 focus:outline-none w-full text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`text-sm font-black ${item.is_day_multiplier ? 'text-indigo-600' : 'text-gray-900'}`}>
                          ${categoryTotal.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 border-dashed flex items-center gap-4 text-indigo-600/80">
            <Info size={20} />
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              * El Markup se aplica únicamente a las categorías marcadas con el icono de porcentaje (%). 
              Las categorías con el icono de calendario se multiplican por los días de rodaje (<span className="text-indigo-600 font-black">{shootDays}</span>).
            </p>
          </div>
        </div>

        {/* Totals & Summary Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl shadow-indigo-100/30 sticky top-10 flex flex-col gap-8">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Resumen Ejecutivo</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all"><Wallet size={16} /></div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Costo Producción</span>
                </div>
                <span className="text-lg font-black text-gray-900">${totals.baseTotal.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all"><TrendingUp size={16} /></div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Markup ({markupPercent}%)</span>
                </div>
                <span className="text-lg font-black text-indigo-600">+ ${totals.markupAmount.toLocaleString()}</span>
              </div>

              <div className="h-px bg-gray-100 my-2" />

              <div className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200">
                <p className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em] mb-2 opacity-80">Total Cotización</p>
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-black tracking-tighter">${totals.grandTotal.toLocaleString()}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-indigo-100/60 uppercase">VALOR FINAL</span>
                    <span className="text-[9px] font-black text-indigo-100/60 uppercase">SIN I.V.A</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-2xl border border-amber-100">
                <AlertTriangle size={20} className="text-amber-600 mt-1" />
                <div>
                  <p className="text-[9px] font-black text-amber-900 uppercase">Aviso de Rentabilidad</p>
                  <p className="text-[10px] text-amber-700 font-medium mt-1 leading-relaxed">
                    Recuerda que los costos de post-producción y talento suelen ser fijos, mientras que equipos y crew son sensibles a los días de rodaje.
                  </p>
                </div>
              </div>

              <button className="w-full py-5 bg-indigo-50 text-indigo-600 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3">
                <RefreshCw size={16} /> RECALCULAR TODO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
