'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Save, X, ChevronDown, ChevronUp, 
  Trash2, DollarSign, Calculator, Layout, 
  Camera, Users, Truck, Utensils, Sparkles,
  ArrowRight, Download, Send, CheckCircle2,
  MoreHorizontal, GripVertical, Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface StructuredQuotationEditorProps {
  projectId: string;
  quotationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StructuredQuotationEditor: React.FC<StructuredQuotationEditorProps> = ({ 
  projectId, 
  quotationId, 
  isOpen, 
  onClose 
}) => {
  const [clientName, setClientName] = useState('');
  const [status, setStatus] = useState('draft');
  const [sections, setSections] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (quotationId) {
        fetchQuotationData();
      } else {
        // Default sections for a new professional budget
        setClientName('');
        setStatus('draft');
        const defaultSections = [
          { id: 'sec-1', name: 'EQUIPO HUMANO (CREW)', order: 0, items: [], icon: <Users size={16} /> },
          { id: 'sec-2', name: 'EQUIPOS & TÉCNICA', order: 1, items: [], icon: <Camera size={16} /> },
          { id: 'sec-3', name: 'LOGÍSTICA & PRODUCCIÓN', order: 2, items: [], icon: <Truck size={16} /> }
        ];
        setSections(defaultSections);
        setActiveSectionId('sec-1');
      }
    }
  }, [isOpen, quotationId]);

  const fetchQuotationData = async () => {
    try {
      const { data: qData, error: qError } = await supabase
        .from('project_quotations')
        .select('*')
        .eq('id', quotationId)
        .single();
      
      if (qError) throw qError;
      setClientName(qData.client_name);
      setStatus(qData.status);

      const { data: sData, error: sError } = await supabase
        .from('quotation_sections')
        .select('*, quotation_items(*)')
        .eq('quotation_id', quotationId)
        .order('order', { ascending: true });

      if (sError) throw sError;
      
      const formattedSections = sData.map(s => ({
        ...s,
        items: s.quotation_items.sort((a: any, b: any) => a.order - b.order)
      }));
      
      setSections(formattedSections);
      if (formattedSections.length > 0) setActiveSectionId(formattedSections[0].id);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddSection = () => {
    const newId = `new-sec-${Date.now()}`;
    const newSection = {
      id: newId,
      name: 'NUEVA SECCIÓN',
      order: sections.length,
      items: [],
      icon: <Layout size={16} />
    };
    setSections([...sections, newSection]);
    setActiveSectionId(newId);
  };

  const handleAddItem = (sectionId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        const newItem = {
          id: `new-item-${Date.now()}`,
          description: '',
          unit_price: 0,
          quantity: 1,
          total: 0,
          order: sec.items.length
        };
        return { ...sec, items: [...sec.items, newItem] };
      }
      return sec;
    }));
  };

  const updateItem = (sectionId: string, itemId: string, field: string, value: any) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        const updatedItems = sec.items.map((item: any) => {
          if (item.id === itemId) {
            const up = { ...item, [field]: value };
            if (field === 'unit_price' || field === 'quantity') {
              up.total = Number(up.unit_price || 0) * Number(up.quantity || 1);
            }
            return up;
          }
          return item;
        });
        return { ...sec, items: updatedItems };
      }
      return sec;
    }));
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
    if (activeSectionId === id) setActiveSectionId(sections[0]?.id || null);
  };

  const removeItem = (sectionId: string, itemId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, items: sec.items.filter((i: any) => i.id !== itemId) };
      }
      return sec;
    }));
  };

  const calculateGrandTotal = () => {
    return sections.reduce((acc, sec) => {
      const secTotal = sec.items.reduce((sAcc: number, item: any) => sAcc + (Number(item.total) || 0), 0);
      return acc + secTotal;
    }, 0);
  };

  const handleSave = async () => {
    if (!clientName.trim()) return alert('Nombre del cliente requerido');
    setIsSaving(true);
    try {
      let currentQuotationId = quotationId;
      const total = calculateGrandTotal();

      // 1. Header
      const qPayload = { project_id: projectId, client_name: clientName, status, total_amount: total, updated_at: new Date().toISOString() };
      if (currentQuotationId) {
        await supabase.from('project_quotations').update(qPayload).eq('id', currentQuotationId);
      } else {
        const { data, error } = await supabase.from('project_quotations').insert([qPayload]).select().single();
        if (error) throw error;
        currentQuotationId = data.id;
      }

      // 2. Clear & Rewrite Sections/Items (Atomic approach for simplicity in this version)
      if (quotationId) {
        await supabase.from('quotation_sections').delete().eq('quotation_id', currentQuotationId);
      }

      for (const sec of sections) {
        const { data: newSec, error: sErr } = await supabase
          .from('quotation_sections')
          .insert([{ quotation_id: currentQuotationId, name: sec.name, "order": sec.order }])
          .select().single();
        
        if (sErr) throw sErr;

        const itemsToInsert = sec.items.map((item: any, idx: number) => ({
          section_id: newSec.id,
          description: item.description,
          unit_price: item.unit_price,
          quantity: item.quantity,
          total: item.total,
          "order": idx
        }));

        if (itemsToInsert.length > 0) {
          await supabase.from('quotation_items').insert(itemsToInsert);
        }
      }

      onClose();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error guardando la cotización');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card w-full max-w-[95vw] h-[95vh] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col relative bg-neutral-950/40"
        >
          {/* Visual Progress Bar - Header */}
          <div className="h-1 w-full bg-white/5 relative overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
              initial={{ width: 0 }}
              animate={{ width: isSaving ? '70%' : '100%' }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Superior Header: Visual & Branding */}
          <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                <Calculator size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">
                  {quotationId ? 'Editor de Presupuesto Real' : 'Nueva Estructura de Costos'}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <Sparkles size={12} className="text-amber-400" /> Executive Production Intelligence
                  </span>
                  {quotationId && (
                    <>
                      <div className="h-1 w-1 rounded-full bg-white/20" />
                      <a 
                        href={`/api/projects/${projectId}/quotations/${quotationId}/pdf`} 
                        target="_blank"
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all"
                      >
                        <Download size={12} /> Descargar PDF Oficial
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/5">
                {['draft', 'sent', 'approved'].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setStatus(s)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      status === s ? 'bg-white text-black shadow-xl scale-105' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {s === 'draft' ? 'Borrador' : s === 'sent' ? 'Enviado' : 'Aprobado'}
                  </button>
                ))}
              </div>
              <button onClick={onClose} className="p-4 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all bg-white/5 ml-2 border border-white/10">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar: Navigation por Secciones */}
            <div className="w-80 bg-black/20 border-r border-white/5 p-8 flex flex-col">
              <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <label className="text-[10px] text-white/20 uppercase font-black tracking-widest block mb-6">Estructura del Proyecto</label>
                
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`w-full group flex items-center justify-between p-4 rounded-2xl transition-all border ${
                      activeSectionId === sec.id 
                        ? 'bg-blue-500/10 border-blue-500/30 text-white shadow-lg' 
                        : 'bg-transparent border-transparent text-white/40 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activeSectionId === sec.id ? 'bg-blue-500 text-white shadow-glow' : 'bg-white/5 text-white/20 group-hover:bg-white/10'}`}>
                        {sec.icon || <Layout size={14} />}
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-wider truncate w-32 text-left ${activeSectionId === sec.id ? 'text-white' : ''}`}>
                        {sec.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold opacity-30 tracking-tighter">${sec.items.length}</span>
                       {activeSectionId === sec.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    </div>
                  </button>
                ))}

                <button 
                  onClick={handleAddSection}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl border border-dashed border-white/10 text-white/20 hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-500/5 transition-all mt-4"
                >
                  <Plus size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Añadir Categoría</span>
                </button>
              </div>

              {/* Grand Total Display */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex flex-col gap-1 mb-4">
                   <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Inversión Final Proyectada</p>
                   <p className="text-4xl font-black text-white tracking-tighter">
                     <span className="text-lg mr-1 text-white/20 font-bold">$</span>
                     {calculateGrandTotal().toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                   </p>
                </div>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-400 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                >
                  {isSaving ? <MoreHorizontal className="animate-pulse" /> : <Save size={18} />}
                  SINCRONIZAR
                </button>
              </div>
            </div>

            {/* Main Editor Zone */}
            <div className="flex-1 bg-black/10 p-12 overflow-y-auto custom-scrollbar flex flex-col">
              <AnimatePresence mode="wait">
                {activeSectionId ? (
                  <motion.div 
                    key={activeSectionId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center gap-4">
                        <input 
                          value={sections.find(s => s.id === activeSectionId)?.name}
                          onChange={(e) => setSections(sections.map(s => s.id === activeSectionId ? { ...s, name: e.target.value.toUpperCase() } : s))}
                          className="text-4xl font-black text-white uppercase tracking-tighter bg-transparent border-none focus:ring-0 p-0 w-max min-w-[300px]"
                        />
                        <button onClick={() => removeSection(activeSectionId)} className="p-3 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                          <Trash2 size={20} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-6 bg-white/[0.03] border border-white/5 py-3 px-8 rounded-3xl">
                        <div>
                          <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-1">Items en Sección</p>
                          <p className="text-xl font-bold text-white leading-none whitespace-nowrap">
                            {sections.find(s => s.id === activeSectionId)?.items.length} UNIDADES
                          </p>
                        </div>
                        <div className="w-px h-8 bg-white/5" />
                        <div>
                          <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-1">Subtotal Área</p>
                          <p className="text-xl font-black text-white leading-none whitespace-nowrap">
                            $ {sections.find(s => s.id === activeSectionId)?.items.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Excel Table Layout */}
                    <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col">
                      <div className="grid grid-cols-12 gap-0 border-b border-white/5 bg-white/[0.02] px-10 py-5">
                        <div className="col-span-1 text-[10px] font-black text-white/30 uppercase tracking-widest">Pos</div>
                        <div className="col-span-6 text-[10px] font-black text-white/30 uppercase tracking-widest pl-4 border-l border-white/5">Descripción del Concepto</div>
                        <div className="col-span-2 text-[10px] font-black text-white/30 uppercase tracking-widest text-right px-4 border-l border-white/5">Costo Unit.</div>
                        <div className="col-span-1 text-[10px] font-black text-white/30 uppercase tracking-widest text-center px-4 border-l border-white/5">Cant.</div>
                        <div className="col-span-2 text-[10px] font-black text-white/30 uppercase tracking-widest text-right pl-4 border-l border-white/5">Total Neto</div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-px bg-white/[0.01]">
                        {sections.find(s => s.id === activeSectionId)?.items.map((item: any, idx: number) => (
                          <div 
                            key={item.id} 
                            className="grid grid-cols-12 gap-0 items-center group hover:bg-white/[0.03] transition-all rounded-xl"
                          >
                            <div className="col-span-1 flex items-center justify-center text-[10px] font-bold text-white/20">
                              #{idx + 1}
                            </div>
                            <div className="col-span-6 p-4 border-l border-white/5 flex items-center gap-3">
                              <input 
                                placeholder="Escribe el concepto de producción..."
                                value={item.description}
                                onChange={(e) => updateItem(activeSectionId, item.id, 'description', e.target.value)}
                                className="w-full bg-transparent border-none text-sm font-bold text-white/90 focus:ring-0 focus:text-white"
                              />
                            </div>
                            <div className="col-span-2 p-4 border-l border-white/5 bg-white/[0.01]">
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-white/20">$</span>
                                <input 
                                  type="number"
                                  value={item.unit_price}
                                  onChange={(e) => updateItem(activeSectionId, item.id, 'unit_price', e.target.value)}
                                  className="w-full bg-transparent border-none text-right text-xs font-black text-white focus:ring-0 appearance-none"
                                />
                              </div>
                            </div>
                            <div className="col-span-1 p-4 border-l border-white/5">
                               <input 
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(activeSectionId, item.id, 'quantity', e.target.value)}
                                className="w-full bg-transparent border-none text-center text-xs font-black text-white focus:ring-0"
                              />
                            </div>
                            <div className="col-span-2 p-4 border-l border-white/5 flex items-center justify-between">
                              <div className="w-full text-right text-sm font-black text-white tracking-widest pr-4 select-none">
                                {Number(item.total).toLocaleString()}
                              </div>
                              <button 
                                onClick={() => removeItem(activeSectionId, item.id)}
                                className="p-2 text-white/5 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-white/5 hover:bg-white rounded-lg"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}

                        <button 
                          onClick={() => handleAddItem(activeSectionId)}
                          className="w-full p-8 flex items-center justify-center gap-4 text-white/10 hover:text-blue-500/50 hover:bg-white/[0.02] transition-all group"
                        >
                          <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-all">
                            <Plus size={24} />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-[0.3em]">Insertar Nuevo Concepto</span>
                        </button>
                      </div>

                      {/* Section Summary Row */}
                      <div className="bg-black/40 px-10 py-6 flex items-center justify-between border-t border-white/5">
                        <div className="flex items-center gap-3 opacity-30">
                           <Info size={14} />
                           <span className="text-[9px] font-black uppercase tracking-widest">Los subtotales se calculan dinámicamente y se bloquean para evitar inconsistencias técnicas.</span>
                        </div>
                        <div className="flex items-center gap-10">
                           <div className="text-right">
                              <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">Peso Sobre Total</span>
                              <div className="w-40 h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                                <motion.div 
                                  className="h-full bg-blue-500 shadow-glow" 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(sections.find(s => s.id === activeSectionId)?.items.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0) / (calculateGrandTotal() || 1)) * 100}%` }}
                                />
                              </div>
                           </div>
                           <div className="text-right">
                              <span className="text-[10px] text-blue-400 uppercase font-black tracking-widest">Subtotal Acumulado</span>
                              <p className="text-2xl font-black text-white">
                                <span className="text-sm text-white/20 mr-1">$</span>
                                {sections.find(s => s.id === activeSectionId)?.items.reduce((acc: number, item: any) => acc + (Number(item.total) || 0), 0).toLocaleString()}
                              </p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-white/5 space-y-6">
                    <Layout size={64} strokeWidth={1} />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">Selecciona una categoría para comenzar el desglose</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
