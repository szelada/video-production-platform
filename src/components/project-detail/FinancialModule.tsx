import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  ArrowRight,
  Sparkles,
  PieChart,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { QuickQuote } from './QuickQuote';
import { FinancialDashboard } from './FinancialDashboard';
import { ExpenseManager } from './ExpenseManager';

interface FinancialModuleProps {
  projectId: string;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  project: any;
}

export const FinancialModule: React.FC<FinancialModuleProps> = ({ 
  projectId, 
  activeSubTab, 
  setActiveSubTab,
  project 
}) => {
  const [financials, setFinancials] = useState<any>({
    revenue: 0,
    planned: 0,
    actual: 0,
    margin: 0
  });
  const [budgetSummary, setBudgetSummary] = useState<any[]>([]);

  const fetchData = async () => {
    // 1. Get Approved Quotations (Revenue)
    const { data: quotes } = await supabase
      .from('project_quotations')
      .select('total_amount')
      .eq('project_id', projectId)
      .eq('status', 'approved');

    // 2. Get Budget Summary (from View)
    const { data: summary } = await supabase
      .from('project_budget_summary')
      .select('*')
      .eq('project_id', projectId);

    const totalRevenue = quotes?.reduce((sum, q) => sum + Number(q.total_amount), 0) || 0;
    const totalPlanned = summary?.reduce((sum, b) => sum + Number(b.planned_amount), 0) || 0;
    const totalActual = summary?.reduce((sum, b) => sum + Number(b.actual_spent), 0) || 0;

    setFinancials({
      revenue: totalRevenue,
      planned: totalPlanned,
      actual: totalActual,
      margin: totalRevenue - totalActual
    });
    setBudgetSummary(summary || []);
  };

  useEffect(() => {
    fetchData();
  }, [projectId, activeSubTab]);

  return (
    <div className="space-y-8 pb-20">
      {/* Financial Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            Control Regie <Wallet className="text-indigo-400" size={32} />
          </h2>
          <p className="text-[10px] text-white/40 mt-3 font-black uppercase tracking-[0.3em] flex items-center gap-3">
            <Sparkles size={16} className="text-amber-400 drop-shadow-md" /> Inteligencia Financiera Pro
          </p>
        </div>
        
        {/* Buttons previously here are now handled by the parent sub-tab navigation */}
        <div className="px-6 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">916 Studio Financial Intelligence</span>
        </div>
      </div>

      {/* Main Content Areas */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'resumen' && (
          <motion.div
            key="fin-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FinancialDashboard financials={financials} projectId={projectId} />
          </motion.div>
        )}

        {activeSubTab === 'gastos' && (
          <motion.div
            key="fin-expenses"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ExpenseManager projectId={projectId} onUpdate={fetchData} />
          </motion.div>
        )}

        {activeSubTab === 'cotizaciones' && (
          <motion.div
            key="fin-planned"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <QuickQuote 
              projectId={projectId} 
              onUpdate={fetchData}
              budgetSummary={budgetSummary} 
              project={project}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
