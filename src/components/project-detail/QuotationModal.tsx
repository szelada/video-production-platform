'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Plus, Trash2, Save, 
  ChevronDown, Calculator, 
  FileText, User, Tag, 
  DollarSign, Package,
  AlertCircle, CheckCircle2,
  RefreshCw, Layers
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface QuotationModalProps {
  projectId: string;
  quotationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({ 
  projectId, 
  quotationId, 
  isOpen, 
  onClose 
}) => {
  const [clientName, setClientName] = useState('');
  const [status, setStatus] = useState('draft');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (quotationId) {
        fetchQuotationDetails();
      } else {
        // Reset for new quotation
        setClientName('');
        setStatus('draft');
        setItems([
          { id: 'new-1', category: 'Producción', description: '', unit_price: 0, quantity: 1, total: 0 }
        ]);
      }
    }
  }, [isOpen, quotationId]);

  const fetchQuotationDetails = async () => {
    setLoading(true);
    try {
      const { data: qData, error: qError } = await supabase
        .from('project_quotations')
        .select('*')
        .eq('id', quotationId)
        .single();
      
      if (qError) throw qError;
      setClientName(qData.client_name);
      setStatus(qData.status);

      const { data: iData, error: iError } = await supabase
        .from('quotation_items')
        .select('*')
        .eq('quotation_id', quotationId)
        .order('created_at', { ascending: true });

      if (iError) throw iError;
      setItems(iData || []);
    } catch (error) {
      console.error('Error fetching quotation details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: `temp-${Date.now()}`,
      category: 'General',
      description: '',
      unit_price: 0,
      quantity: 1,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'unit_price' || field === 'quantity') {
          updated.total = Number(updated.unit_price || 0) * Number(updated.quantity || 1);
        }
        return updated;
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const grandTotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (Number(item.total) || 0), 0);
  }, [items]);

  const handleSave = async () => {
    if (!clientName.trim()) {
      alert('Por favor ingrese el nombre del cliente');
      return;
    }

    setIsSaving(true);
    try {
      let currentQuotationId = quotationId;

      // 1. Create or Update Quotation Header
      const quotationPayload = {
        project_id: projectId,
        client_name: clientName,
        status: status,
        total_amount: grandTotal,
        updated_at: new Date().toISOString()
      };

      if (currentQuotationId) {
        const { error: qError } = await supabase
          .from('project_quotations')
          .update(quotationPayload)
          .eq('id', currentQuotationId);
        if (qError) throw qError;
      } else {
        const { data: newQ, error: qError } = await supabase
          .from('project_quotations')
          .insert([quotationPayload])
          .select()
          .single();
        if (qError) throw qError;
        currentQuotationId = newQ.id;
      }

      // 2. Sync Items
      // For simplicity, we'll delete old items and insert current ones if updating
      // or just insert if new. (Optimized sync can be added later)
      if (quotationId) {
        const { error: deleteError } = await supabase
          .from('quotation_items')
          .delete()
          .eq('quotation_id', currentQuotationId);
        if (deleteError) throw deleteError;
      }

      const itemsToInsert = items.map(item => ({
        quotation_id: currentQuotationId,
        category: item.category,
        description: item.description,
        unit_price: Number(item.unit_price) || 0,
        quantity: Number(item.quantity) || 0,
        total: Number(item.total) || 0
      }));

      const { error: itemsError } = await supabase
        .from('quotation_items')
        .insert(itemsToInsert);
      
      if (itemsError) throw itemsError;

      onClose();
    } catch (error) {
      console.error('Error saving quotation:', error);
      alert('Error al guardar la cotización');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card w-full max-w-5xl h-[90vh] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col relative"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <Calculator size={24} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                  {quotationId ? 'Editar Cotización' : 'Nueva Cotización de Cliente'}
                </h3>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-0.5">Calculadora de presupuestos comerciales</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            {/* Top Config Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1 flex items-center gap-2">
                  <User size={12} /> Cliente / Empresa
                </label>
                <input 
                  type="text"
                  placeholder="Nombre de la marca o contacto..."
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1 flex items-center gap-2">
                  <Tag size={12} /> Estado de Propuesta
                </label>
                <div className="flex gap-2">
                  {['draft', 'sent', 'approved'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        status === s 
                          ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20 scale-[1.02]' 
                          : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {s === 'draft' ? 'Borrador' : s === 'sent' ? 'Enviado' : 'Aprobado'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                <h4 className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] flex items-center gap-2">
                  <Layers size={12} className="text-blue-400" /> Desglose de Servicios
                </h4>
                <button 
                  onClick={handleAddItem}
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-black uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-blue-500/5 hover:bg-blue-500/10 rounded-xl border border-blue-500/20 transition-all"
                >
                  <Plus size={14} /> Añadir Ítem
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <motion.div 
                    layout
                    key={item.id}
                    className="grid grid-cols-12 gap-4 items-center bg-white/[0.02] border border-white/5 p-5 rounded-3xl group hover:border-white/10 transition-all"
                  >
                    <div className="col-span-2">
                       <input 
                        type="text"
                        placeholder="Categoría"
                        value={item.category}
                        onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                        className="w-full bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-white/40 focus:text-blue-400 focus:ring-0"
                      />
                    </div>
                    <div className="col-span-5">
                       <input 
                        type="text"
                        placeholder="Descripción del servicio..."
                        value={item.description}
                        onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                        className="w-full bg-transparent border-none text-sm font-bold text-white focus:ring-0 p-0"
                      />
                    </div>
                    <div className="col-span-2">
                       <div className="flex items-center gap-2 bg-black/20 rounded-xl px-3 py-2 border border-white/5">
                        <span className="text-[10px] text-white/20 font-black">$</span>
                        <input 
                          type="number"
                          placeholder="0.00"
                          value={item.unit_price}
                          onChange={(e) => handleUpdateItem(item.id, 'unit_price', e.target.value)}
                          className="w-full bg-transparent border-none text-xs font-black text-white focus:ring-0 p-0 text-right appearance-none"
                        />
                       </div>
                    </div>
                    <div className="col-span-1">
                       <div className="flex items-center bg-black/20 rounded-xl px-3 py-2 border border-white/5">
                        <input 
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                          className="w-full bg-transparent border-none text-xs font-black text-white focus:ring-0 p-0 text-center"
                        />
                       </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-between">
                       <div className="text-sm font-black text-white tracking-widest w-full text-right pr-4">
                         {Number(item.total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                       </div>
                       <button 
                         onClick={() => handleRemoveItem(item.id)}
                         className="p-2 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                       >
                         <Trash2 size={14} />
                       </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer with Totals */}
          <div className="p-10 border-t border-white/5 bg-white/[0.03] shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-10">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-1">Monto Subtotal</span>
                <div className="text-xl font-bold text-white/60 tracking-tight">
                  <span className="text-xs mr-1">$</span>
                  {grandTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="w-px h-12 bg-white/5 hidden md:block" />
              <div className="flex flex-col">
                <span className="text-[10px] text-[#D9FF54] uppercase font-black tracking-widest mb-1">Total Cotización</span>
                <div className="text-4xl font-black text-white tracking-tighter shadow-glow">
                  <span className="text-lg text-white/40 mr-1">$</span>
                  {grandTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-3 bg-white text-black px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] hover:bg-[#D9FF54] transition-all shadow-2xl active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
              {quotationId ? 'ACTUALIZAR CAMBIOS' : 'GUARDAR COTIZACIÓN'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
