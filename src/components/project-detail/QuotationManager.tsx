'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, FileText, Send, CheckCircle2, 
  Clock, Trash2, Edit3, ArrowRight,
  MoreVertical, Download, ExternalLink,
  DollarSign, Calculator, ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { StructuredQuotationEditor } from './StructuredQuotationEditor';

interface QuotationManagerProps {
  projectId: string;
}

export const QuotationManager: React.FC<QuotationManagerProps> = ({ projectId }) => {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_quotations')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotations(data || []);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [projectId]);

  const handleCreateNew = () => {
    setSelectedQuotationId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedQuotationId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cotización?')) return;
    try {
      const { error } = await supabase
        .from('project_quotations')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchQuotations();
    } catch (error) {
      console.error('Error deleting quotation:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20"><CheckCircle2 size={10} /> Aprobado</span>;
      case 'sent':
        return <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-widest border border-blue-500/20"><Send size={10} /> Enviado</span>;
      default:
        return <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest border border-white/10"><Clock size={10} /> Borrador</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-3">
            <FileText className="text-blue-400" size={24} /> Cotizaciones a Clientes
          </h3>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-widest font-bold">Gestión de propuestas comerciales y estados</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all shadow-xl active:scale-95"
        >
          <Plus size={16} /> Nueva Cotización
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/10"></div>
        </div>
      ) : quotations.length === 0 ? (
        <div className="h-64 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-white/10 space-y-4">
          <Calculator size={48} strokeWidth={1} />
          <p className="text-xs font-black uppercase tracking-widest">No hay cotizaciones registradas</p>
          <button 
            onClick={handleCreateNew}
            className="text-[10px] text-blue-400 hover:text-blue-300 font-black uppercase tracking-widest underline decoration-2 underline-offset-4"
          >
            Crear la primera ahora →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotations.map((q) => (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] flex flex-col h-full group hover:border-white/20 transition-all relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <a 
                  href={`/api/projects/${projectId}/quotations/${q.id}/pdf`} 
                  target="_blank" 
                  className="p-2 text-white/40 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
                  title="Descargar PDF"
                >
                  <Download size={16} />
                </a>
                <button onClick={() => handleDelete(q.id)} className="p-2 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-blue-500/10 transition-all">
                  <FileText className="text-blue-400" size={20} />
                </div>
                {getStatusBadge(q.status)}
              </div>

              <h4 className="text-xl font-bold text-white uppercase tracking-tight mb-1 truncate">{q.client_name}</h4>
              <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-6">
                Creada: {new Date(q.created_at).toLocaleDateString()}
              </p>

              <div className="mt-auto pt-6 border-t border-white/5 flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-white/20 uppercase font-black tracking-widest block mb-1">Monto Total</span>
                  <div className="text-2xl font-black text-white tracking-tighter">
                    <span className="text-sm text-white/40 mr-1">$</span>
                    {Number(q.total_amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <button 
                  onClick={() => handleEdit(q.id)}
                  className="p-4 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl transition-all shadow-xl active:scale-95"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <StructuredQuotationEditor 
        projectId={projectId}
        quotationId={selectedQuotationId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchQuotations();
        }}
      />
    </div>
  );
};
