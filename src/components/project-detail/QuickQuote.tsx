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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header with Global Controls */}
      <div className="glass-bento p-10 border border-white/5 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-8">
          <div className="p-5 bg-white/5 border border-white/10 text-white rounded-[2rem] shadow-2xl backdrop-blur-2xl">
            <Calculator size={40} className="text-indigo-400 drop-shadow-lg" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tightest italic">Cotización Rápida</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/30">Agilidad Financiera</span>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="bg-white/5 p-5 rounded-[2rem] border border-white/10 flex items-center gap-5 shadow-inner backdrop-blur-md">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-indigo-400"><Calendar size={20} /></div>
            <div>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Días de Rodaje</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setShootDays(Math.max(1, shootDays - 1))} className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">-</button>
                <input 
                  type="number" 
                  value={shootDays} 
                  onChange={(e) => setShootDays(parseInt(e.target.value) || 1)}
                  className="w-14 text-center bg-transparent font-black text-white focus:outline-none text-lg"
                />
                <button onClick={() => setShootDays(shootDays + 1)} className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">+</button>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-5 rounded-[2rem] border border-white/10 flex items-center gap-5 shadow-inner backdrop-blur-md">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-indigo-400"><Percent size={20} /></div>
            <div>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Markup / FEE</p>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={markupPercent} 
                  onChange={(e) => setMarkupPercent(parseFloat(e.target.value) || 0)}
                  className="w-16 text-center bg-transparent font-black text-white focus:outline-none text-lg"
                />
                <span className="text-[11px] font-black text-white/20">%</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`px-10 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-4 shadow-2xl backdrop-blur-xl ${
              saveStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
              saveStatus === 'error' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
              'bg-white text-black hover:scale-105 active:scale-95'
            }`}
          >
            {isSaving ? <RefreshCw size={18} className="animate-spin" /> : 
             saveStatus === 'success' ? <CheckCircle2 size={18} /> :
             saveStatus === 'error' ? <AlertCircle size={18} /> :
             <Save size={18} />}
            {isSaving ? 'GUARDANDO...' : saveStatus === 'success' ? 'ACTUALIZADO' : 'CONSOLIDAR CAMBIOS'}
          </button>
        </div>
      </div>

      {/* Main Quoting Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Editable Table */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-bento border border-white/5 shadow-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-10 py-8 text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Categoría</th>
                  <th className="px-10 py-8 text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Config.</th>
                  <th className="px-10 py-8 text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Costo Unit/Día</th>
                  <th className="px-10 py-8 text-[11px] font-black text-white/20 uppercase tracking-[0.3em] text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {localBudgets.map((item) => {
                  const categoryTotal = item.is_day_multiplier ? item.planned_amount * shootDays : item.planned_amount;
                  return (
                    <tr key={item.id} className="group hover:bg-white/5 transition-all">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="p-3 bg-white/5 text-white/30 rounded-xl group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all border border-white/5">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <p className="text-base font-black text-white uppercase tracking-tightest italic group-hover:translate-x-1 transition-all">{item.category}</p>
                            <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] mt-1">
                              {item.is_day_multiplier ? 'Costo Variable' : 'Costo Directo'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleToggleFlag(item.id, 'is_day_multiplier')}
                            className={`p-2.5 rounded-xl transition-all border ${item.is_day_multiplier ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-white/5 border-white/5 text-white/10 hover:text-white/30'}`}
                            title={item.is_day_multiplier ? "Multiplica por días" : "Costo único"}
                          >
                            <Calendar size={16} />
                          </button>
                          <button 
                            onClick={() => handleToggleFlag(item.id, 'is_commissionable')}
                            className={`p-2.5 rounded-xl transition-all border ${item.is_commissionable ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-white/5 border-white/5 text-white/10 hover:text-white/30'}`}
                            title={item.is_commissionable ? "Aplica Markup" : "Exento de Markup"}
                          >
                            <Percent size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3 max-w-[160px] px-5 py-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-indigo-500/30 transition-all shadow-inner backdrop-blur-md">
                          <span className="text-white/20 font-black">$</span>
                          <input 
                            type="number" 
                            value={item.planned_amount} 
                            onChange={(e) => handleUpdateLocalAmount(item.id, parseFloat(e.target.value) || 0)}
                            className="bg-transparent font-black text-white focus:outline-none w-full text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex flex-col items-end">
                           <span className={`text-xl font-black tracking-tightest ${item.is_day_multiplier ? 'text-indigo-400' : 'text-white'}`}>
                             ${categoryTotal.toLocaleString()}
                           </span>
                           {item.is_day_multiplier && <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Calculado x{shootDays} días</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-indigo-500/5 rounded-[2.5rem] border border-indigo-500/10 border-dashed flex items-center gap-5 text-indigo-400/60 shadow-xl backdrop-blur-sm">
            <Info size={24} className="shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
              * El Markup inteligente se aplica únicamente a las categorías con bandera de comisión activa. 
              Los costos variables se sincronizan con los <span className="text-indigo-400 font-black">{shootDays}</span> días de rodaje declarados globalmente.
            </p>
          </div>
        </div>

        {/* Totals & Summary Card */}
        <div className="space-y-8">
          <div className="glass-bento p-12 border border-white/5 shadow-2xl sticky top-32 flex flex-col gap-10">
            <h3 className="text-3xl font-black text-white uppercase tracking-tightest italic">Resumen</h3>
            
            <div className="space-y-8">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 text-white/20 rounded-xl group-hover:bg-white/10 group-hover:text-white transition-all border border-white/5"><Wallet size={20} /></div>
                  <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">Costo Base</span>
                </div>
                <span className="text-2xl font-black text-white/80">${totals.baseTotal.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all border border-indigo-500/20"><TrendingUp size={20} /></div>
                  <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em]">Markup Comisionable</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-400">+ ${totals.markupAmount.toLocaleString()}</span>
                  <p className="text-[9px] font-black text-indigo-400/40 uppercase tracking-widest mt-1">Sujeto a {markupPercent}% FEE</p>
                </div>
              </div>

              <div className="h-px bg-white/5 my-4" />

              <div className="p-10 bg-gradient-to-br from-indigo-600 to-violet-800 rounded-[3rem] text-white shadow-2xl shadow-indigo-900/50 border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all" />
                <p className="text-[10px] font-black text-indigo-100/40 uppercase tracking-[0.3em] mb-3 relative z-10">Total Cotizado</p>
                <div className="flex items-end justify-between relative z-10">
                  <span className="text-5xl font-black tracking-tightest drop-shadow-2xl">${totals.grandTotal.toLocaleString()}</span>
                  <div className="flex flex-col items-end opacity-40">
                    <span className="text-[9px] font-black uppercase">NET VALUE</span>
                    <span className="text-[9px] font-black uppercase">NO TAX</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6">
              <div className="flex items-start gap-5 p-6 bg-amber-500/10 rounded-[2rem] border border-amber-500/20 shadow-xl backdrop-blur-md">
                <AlertTriangle size={24} className="text-amber-500 mt-1 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">Health Check</p>
                  <p className="text-[11px] text-white/50 font-medium leading-relaxed">
                    Las proyecciones se basan en el plan de rodaje activo. Cualquier cambio en jornadas afectará el Margen Neto.
                  </p>
                </div>
              </div>

              <button className="w-full py-6 bg-white/5 text-white/40 border border-white/10 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-4 group">
                <RefreshCw size={18} className="group-hover:rotate-180 transition-all duration-700" /> RECALCULAR PROYECCIÓN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
