import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Calendar, 
  Tag, 
  User, 
  FileText,
  TrendingDown,
  X,
  Loader2,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpenseManagerProps {
  projectId: string;
  onUpdate: () => void;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({ projectId, onUpdate }) => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  
  const [newExpense, setNewExpense] = useState({
    description: '',
    category: 'crew',
    amount: 0,
    expense_date: new Date().toISOString().split('T')[0],
    supplier_id: ''
  });

  const categories = [
    { id: 'crew', label: 'Personal / Crew', color: 'bg-blue-500' },
    { id: 'equipment', label: 'Equipamiento', color: 'bg-purple-500' },
    { id: 'locations', label: 'Locaciones', color: 'bg-emerald-500' },
    { id: 'transport', label: 'Transporte', color: 'bg-amber-500' },
    { id: 'catering', label: 'Catering', color: 'bg-orange-500' },
    { id: 'postproduction', label: 'Post-Producción', color: 'bg-indigo-500' },
    { id: 'misc', label: 'Otros / Varios', color: 'bg-gray-500' }
  ];

  const fetchData = async () => {
    setLoading(true);
    const { data: expData } = await supabase
      .from('project_expenses')
      .select('*, suppliers(name)')
      .eq('project_id', projectId)
      .order('expense_date', { ascending: false });
    
    const { data: suppData } = await supabase
      .from('suppliers')
      .select('id, name');

    setExpenses(expData || []);
    setSuppliers(suppData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('project_expenses')
      .update({ 
        is_approved: true, 
        approved_at: new Date().toISOString() 
      })
      .eq('id', id);
    
    if (!error) {
      fetchData();
      onUpdate();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('project_expenses')
      .insert([{
        ...newExpense,
        project_id: projectId,
        supplier_id: newExpense.supplier_id || null,
        is_approved: false
      }]);

    if (!error) {
      setIsModalOpen(false);
      setNewExpense({
        description: '',
        category: 'crew',
        amount: 0,
        expense_date: new Date().toISOString().split('T')[0],
        supplier_id: ''
      });
      fetchData();
      onUpdate();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('project_expenses')
      .delete()
      .eq('id', id);
    
    if (!error) {
      fetchData();
      onUpdate();
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Search & Actions Barra */}
      <div className="glass-bento p-10 border border-white/5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
         <div className="flex-1 max-w-2xl relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 transition-all group-focus-within:text-indigo-400" size={24} />
            <input 
              type="text" 
              placeholder="Buscar por descripción o proveedor..."
              className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] pl-20 pr-10 py-6 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner placeholder:text-white/20"
            />
         </div>
         <div className="flex items-center gap-6">
            <button className="p-6 bg-white/5 border border-white/10 rounded-[1.5rem] text-white/20 hover:text-white shadow-xl transition-all backdrop-blur-md">
               <Filter size={24} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-4 bg-white text-black px-10 py-6 rounded-[2.5rem] font-black hover:scale-105 active:scale-95 transition-all shadow-2xl uppercase tracking-[0.2em] text-[10px]"
            >
               <Plus size={20} strokeWidth={4} /> Registrar Gasto
            </button>
         </div>
      </div>

      {/* Expenses Ledger */}
      <div className="glass-bento border border-white/5 shadow-2xl overflow-hidden p-6 relative">
         <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                     <th className="px-10 py-8 text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Gasto / Concepto</th>
                     <th className="px-10 py-8 text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Proveedor</th>
                     <th className="px-10 py-8 text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Categoría</th>
                     <th className="px-10 py-8 text-[11px] font-black text-white/20 uppercase tracking-[0.3em] text-center">Status</th>
                     <th className="px-10 py-8 text-[11px] font-black text-white/20 uppercase tracking-[0.3em] text-right">Monto</th>
                     <th className="px-10 py-8 w-40 text-center">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {expenses.map((expense) => (
                    <motion.tr 
                      key={expense.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-white/5 transition-all"
                    >
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                             <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-white/10 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all shadow-inner">
                                <FileText size={24} />
                             </div>
                             <div>
                                <span className="block text-base font-black text-white uppercase tracking-tightest italic group-hover:translate-x-1 transition-all">{expense.description}</span>
                                <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                                  ID: {expense.id.slice(0, 8)} <div className="w-1 h-1 rounded-full bg-white/10" /> {new Date(expense.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-4 group/supp">
                             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover/supp:bg-white/10 transition-all">
                                <User size={14} />
                             </div>
                             <span className="text-xs font-black text-white/60 tracking-tight">{expense.suppliers?.name || 'Varios/Directo'}</span>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <span className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                            categories.find(c => c.id === expense.category)?.color.replace('bg-', 'bg-').concat('/10')
                          } ${
                            categories.find(c => c.id === expense.category)?.color.replace('bg-', 'border-').concat('/20')
                          } ${
                            categories.find(c => c.id === expense.category)?.color.replace('bg-', 'text-')
                          }`}>
                             {categories.find(c => c.id === expense.category)?.label || expense.category}
                          </span>
                       </td>
                       <td className="px-10 py-8 text-center">
                          {expense.is_approved ? (
                            <div className="flex flex-col items-center gap-1">
                               <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                  APROBADO
                               </span>
                               <span className="text-[7px] font-black text-white/20 uppercase">Por EP</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                               <span className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest rounded-full animate-pulse">
                                  PENDIENTE
                               </span>
                               <span className="text-[7px] font-black text-white/20 uppercase">Revisión Requerida</span>
                            </div>
                          )}
                       </td>
                       <td className="px-10 py-8 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-xl font-black text-white tracking-tighter">${Number(expense.amount).toLocaleString()}</span>
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{new Date(expense.expense_date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                          </div>
                       </td>
                       <td className="px-10 py-8 text-center">
                          <div className="flex items-center justify-center gap-3">
                             {!expense.is_approved && (
                                <button 
                                  onClick={() => handleApprove(expense.id)}
                                  className="p-3 bg-white/5 border border-white/5 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-xl transition-all shadow-xl group/btn"
                                  title="Aprobar Gasto (EP ONLY)"
                                >
                                   <CheckCircle2 size={20} className="group-hover/btn:scale-110 transition-transform" />
                                </button>
                             )}
                             <button 
                               onClick={() => handleDelete(expense.id)}
                               className="p-3 bg-white/5 border border-white/5 text-white/10 hover:bg-rose-500 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                             >
                                <Trash2 size={20} />
                             </button>
                          </div>
                       </td>
                    </motion.tr>
                  ))}
                  {expenses.length === 0 && !loading && (
                    <tr>
                       <td colSpan={6} className="py-32">
                          <div className="flex flex-col items-center text-center max-w-sm mx-auto space-y-8">
                             <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-white/10 border-2 border-dashed border-white/10 shadow-inner">
                                <TrendingDown size={48} strokeWidth={1} />
                             </div>
                             <div>
                                <h4 className="text-lg font-black text-white uppercase tracking-tightest mb-3 italic">Sin Registros</h4>
                                <p className="text-xs text-white/30 font-medium leading-relaxed italic">
                                   La visibilidad financiera comienza aquí. Registra el primer gasto real para activar el análisis de margen.
                                </p>
                             </div>
                             <button 
                                onClick={() => setIsModalOpen(true)}
                                className="px-12 py-6 bg-white text-black rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
                             >
                                Registrar Primer Gasto
                             </button>
                          </div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
         
         {/* Footer Ledger Info */}
         <div className="px-10 py-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
              Sincronización Bancaria: <span className="text-indigo-400">ACTIVA</span>
            </p>
            <div className="flex items-center gap-6">
               <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">916 Studio Ledger v2.0</span>
               <button className="flex items-center gap-2 text-[9px] font-black text-indigo-400 hover:text-white transition-all uppercase tracking-widest">
                  <Download size={12} /> Exportar CSV
               </button>
            </div>
         </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-24 bg-black/80 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-bento w-full max-w-3xl p-10 sm:p-16 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              {/* Modal Blur Decor */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] translate-y-1/2 -translate-x-1/2" />

              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-10 right-10 p-4 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all z-20"
              >
                <X size={28} />
              </button>

              <div className="mb-16 relative z-10">
                <h3 className="text-4xl font-black text-white uppercase tracking-tightest leading-none mb-4 italic">Registro Regie</h3>
                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">Documentación Financiera de Alta Resolución</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] pl-4">Concepto del Gasto</label>
                    <input 
                      required
                      type="text" 
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      placeholder="Ej: Pago de Catering Rodaje Día 1..."
                      className="w-full px-10 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] text-base font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner placeholder:text-white/10 italic"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] pl-4">Vertical / Categoría</label>
                       <div className="relative">
                          <select 
                            value={newExpense.category}
                            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                            className="w-full px-10 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer italic"
                          >
                             {categories.map(cat => <option key={cat.id} value={cat.id} className="bg-zinc-900">{cat.label}</option>)}
                          </select>
                          <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 rotate-90 pointer-events-none" size={18} />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] pl-4">Monto ($ USD)</label>
                       <div className="relative">
                          <DollarSign className="absolute left-8 top-1/2 -translate-y-1/2 text-indigo-400" size={24} />
                          <input 
                            required
                            type="number" 
                            step="0.01"
                            value={newExpense.amount || ''}
                            onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                            placeholder="0.00"
                            className="w-full px-16 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] text-2xl font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner placeholder:text-white/5"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] pl-4">Proveedor Vinculado</label>
                       <div className="relative">
                         <select 
                           value={newExpense.supplier_id}
                           onChange={(e) => setNewExpense({ ...newExpense, supplier_id: e.target.value })}
                           className="w-full px-10 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] text-sm font-black text-white/60 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer italic"
                         >
                            <option value="" className="bg-zinc-900 text-white/20">Seleccionar Proveedor...</option>
                            {suppliers.map(s => <option key={s.id} value={s.id} className="bg-zinc-900">{s.name}</option>)}
                         </select>
                         <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 rotate-90 pointer-events-none" size={18} />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] pl-4">Fecha de Ejecución</label>
                       <input 
                         type="date"
                         value={newExpense.expense_date}
                         onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
                         className="w-full px-10 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all italic"
                       />
                    </div>
                 </div>

                 <div className="pt-10">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-8 bg-white text-black rounded-[3rem] text-[11px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-5 disabled:opacity-50"
                    >
                       {isSubmitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={22} className="text-indigo-600" /> SINCRONIZAR CON LEDGER</>}
                    </button>
                    <p className="text-center text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mt-10 flex items-center justify-center gap-4">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Transmisión Segura SSL/Regie
                    </p>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
