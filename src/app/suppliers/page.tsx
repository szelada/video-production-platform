'use client';
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Globe,
  MapPin,
  Star,
  Loader2,
  Building2,
  X,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Catering', 'Transporte', 'Equipos', 'Seguros', 'Locaciones', 'Post-Producción', 'Varios'];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<any[]>([]);
  const [isCompareViewOpen, setIsCompareViewOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Varios',
    contact_name: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    rating: 5,
    notes: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name');

    if (!error && data) {
      setSuppliers(data);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('suppliers')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('suppliers')
          .insert([formData]);

        if (error) throw error;
      }

      fetchSuppliers();
      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving supplier:', error);
      alert('Error: ' + error.message);
    }
    setSubmitting(false);
  };

  const handleEdit = (supplier: any) => {
    setEditingId(supplier.id);
    setFormData({
      name: supplier.name || '',
      category: supplier.category || 'Varios',
      contact_name: supplier.contact_name || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      website: supplier.website || '',
      address: supplier.address || '',
      rating: supplier.rating || 5,
      notes: supplier.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Varios',
      contact_name: '',
      phone: '',
      email: '',
      website: '',
      address: '',
      rating: 5,
      notes: ''
    });
  };

  const toggleSelection = (supplier: any) => {
    if (selectedForCompare.find(s => s.id === supplier.id)) {
      setSelectedForCompare(prev => prev.filter(s => s.id !== supplier.id));
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare(prev => [...prev, supplier]);
    } else {
      alert("Solo se pueden comparar hasta 3 proveedores simultáneamente.");
    }
  };

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-1">Proveedores</h1>
          <p className="text-zinc-500 font-medium">Catálogo maestro de servicios y recursos logísticos.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3.5 rounded-full font-bold hover:bg-zinc-800 transition-all shadow-lg hover:-translate-y-1 self-start uppercase tracking-widest text-sm"
        >
          <Plus size={18} strokeWidth={2.5} /> Nuevo Proveedor
        </button>
      </div>

      {/* Dark Container Wraps Everything Below */}
      <div className="bg-[#1C1C1E] rounded-[40px] p-6 lg:p-8 shadow-2xl space-y-8">

        {/* Stats Quick View */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-200/20 p-6 rounded-[32px] border border-emerald-500/20">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Total Registrados</p>
            <p className="text-3xl font-black text-white">{suppliers.length}</p>
          </div>
          <div className="bg-blue-500/10 p-6 rounded-[32px] border border-blue-500/20">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Categorías</p>
            <p className="text-3xl font-black text-white">{new Set(suppliers.map(s => s.category)).size}</p>
          </div>
          <div className="bg-amber-500/10 p-6 rounded-[32px] border border-amber-500/20">
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Mejor Valorados</p>
            <p className="text-3xl font-black text-white">{suppliers.filter(s => s.rating === 5).length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#2C2C2E] p-3 rounded-[32px] border border-zinc-800">
          <div className="flex items-center gap-3 bg-zinc-900 rounded-full px-5 py-3 flex-1 w-full border border-zinc-800 shadow-inner">
            <Search size={18} className="text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-500 text-zinc-100 font-medium"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar max-w-full">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap uppercase tracking-widest ${!selectedCategory ? 'bg-orange-500 text-zinc-950' : 'bg-transparent text-zinc-500 hover:text-white'}`}
            >
              TODOS
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap uppercase tracking-widest ${selectedCategory === cat ? 'bg-orange-500 text-zinc-950' : 'bg-transparent text-zinc-500 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-orange-500" size={40} />
            <p className="text-zinc-500 text-sm font-medium animate-pulse">Cargando catálogo...</p>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 bg-[#2C2C2E] rounded-[32px] border border-zinc-800 border-dashed">
            <p className="text-zinc-400 font-bold text-sm">No se encontraron proveedores.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <motion.div
                layout
                key={supplier.id}
                className="bg-[#2C2C2E] group flex flex-col rounded-[32px] border border-transparent hover:border-zinc-700 overflow-hidden shadow-sm transition-all duration-300 cursor-pointer hover:-translate-y-1 relative"
              >
                {/* Comparison Selection Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelection(supplier);
                  }}
                  className={`absolute top-6 left-6 z-20 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedForCompare.find(s => s.id === supplier.id)
                    ? 'bg-orange-500 border-orange-500 text-zinc-950'
                    : 'bg-black/20 border-white/20 text-transparent hover:border-white/40'
                  }`}
                >
                  <Star size={12} fill="currentColor" />
                </button>

                <div className="p-6 flex-1 space-y-5 pt-12" onClick={() => handleEdit(supplier)}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase bg-blue-500/10 px-2.5 py-1 rounded-md">{supplier.category}</span>
                      <h3 className="text-xl font-bold text-zinc-50 group-hover:text-orange-400 transition-colors">{supplier.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-black text-white">{supplier.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {supplier.contact_name && (
                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                          <Plus size={12} className="text-zinc-500" />
                        </div>
                        <span className="font-bold text-zinc-300">{supplier.contact_name}</span>
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                          <Phone size={12} className="text-zinc-500" />
                        </div>
                        <span>{supplier.phone}</span>
                      </div>
                    )}
                    {supplier.email && (
                      <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                          <Mail size={12} className="text-zinc-500" />
                        </div>
                        <span>{supplier.email}</span>
                      </div>
                    )}
                    {supplier.website && (
                      <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                          <Globe size={12} className="text-zinc-500" />
                        </div>
                        <a href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 hover:underline transition-colors" onClick={(e) => e.stopPropagation()}>
                          {supplier.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-zinc-900/50 border-t border-zinc-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                    <span className={`w-2 h-2 rounded-full shadow-inner ${supplier.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {supplier.status === 'active' ? 'ACTIVO' : 'INACTIVO'}
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); alert('Funcionalidad de historial en desarrollo'); }}
                    className="text-[10px] font-black text-zinc-600 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Ver Historial
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tooltip / Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#1C1C1E] rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  {editingId ? 'Editar Proveedor' : 'Registro de Proveedor'}
                </h2>
                <button onClick={handleCloseModal} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nombre de Empresa *</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Rent-A-Cam S.A.C."
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Categoría</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-zinc-500 transition-all appearance-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-zinc-900 text-white">{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Persona de Contacto</label>
                    <input
                      type="text"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleInputChange}
                      placeholder="Nombre del ejecutivo"
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Teléfono / WhatsApp</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+51 ..."
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Correo Electrónico</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ventas@empresa.com"
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sitio Web</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="www.empresa.com"
                      className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Dirección / Dirección Fiscal</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Sede principal..."
                    rows={2}
                    className="w-full bg-[#2C2C2E] border border-transparent rounded-[20px] px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-zinc-500 transition-all resize-none"
                  />
                </div>

                <div className="pt-8 border-t border-zinc-800 flex gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-4 rounded-full font-bold text-sm text-zinc-400 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-all uppercase tracking-widest"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-4 rounded-full font-black text-sm text-zinc-950 bg-emerald-300 hover:bg-emerald-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : 'REGISTRAR PROVEEDOR'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Comparison Floating Bar */}
      <AnimatePresence>
        {selectedForCompare.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 bg-zinc-900 border border-zinc-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[32px] px-8 py-5 flex items-center gap-10 backdrop-blur-xl"
          >
            <div className="flex -space-x-3">
              {selectedForCompare.map(s => (
                <div key={s.id} className="w-12 h-12 rounded-full border-4 border-zinc-900 bg-zinc-800 flex items-center justify-center text-zinc-100 font-black text-xs shadow-lg overflow-hidden group relative">
                  {s.name.charAt(0)}
                  <button 
                    onClick={() => toggleSelection(s)}
                    className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {selectedForCompare.length < 3 && (
                <div className="w-12 h-12 rounded-full border-4 border-zinc-900 bg-zinc-900/50 border-dashed border-zinc-700 flex items-center justify-center text-zinc-600">
                  <Plus size={16} />
                </div>
              )}
            </div>
            
            <div className="h-10 w-px bg-zinc-800" />
            
            <div className="space-y-0.5">
              <p className="text-white font-black text-sm uppercase tracking-tight">{selectedForCompare.length} Seleccionados</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Comparador de Precios</p>
            </div>
            
            <button
              onClick={() => setIsCompareViewOpen(true)}
              disabled={selectedForCompare.length < 2}
              className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-[0.15em] transition-all shadow-xl ${
                selectedForCompare.length >= 2 
                ? 'bg-orange-500 text-zinc-950 hover:scale-105 active:scale-95' 
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              Iniciar Comparación
            </button>
            
            <button 
              onClick={() => setSelectedForCompare([])}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              Limpiar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison View Modal */}
      <AnimatePresence>
        {isCompareViewOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCompareViewOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-6xl bg-[#1C1C1E] rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Comparativa de Proveedores</h2>
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mt-1">Análisis de Costos y Capacidad</p>
                </div>
                <button onClick={() => setIsCompareViewOpen(false)} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              <div className="p-10 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="py-6 px-4 border-b border-zinc-800 w-48">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Atributo</span>
                      </th>
                      {selectedForCompare.map(s => (
                        <th key={s.id} className="py-6 px-8 border-b border-zinc-800 text-center bg-zinc-900/30">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl font-black text-orange-500 border border-zinc-700 shadow-xl">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-lg font-black text-white uppercase tracking-tight">{s.name}</p>
                              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{s.category}</span>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    <tr>
                      <td className="py-8 px-4 font-black text-[10px] text-zinc-500 uppercase tracking-widest">Valoración</td>
                      {selectedForCompare.map(s => (
                        <td key={s.id} className="py-8 px-8 text-center bg-zinc-900/10">
                          <div className="flex items-center justify-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} fill={i < s.rating ? "currentColor" : "none"} strokeWidth={i < s.rating ? 0 : 2} className={i < s.rating ? "" : "text-zinc-700"} />
                            ))}
                          </div>
                          <p className="text-[10px] font-black text-white mt-2 uppercase tracking-widest">{s.rating}/5 Estrellas</p>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-8 px-4 font-black text-[10px] text-zinc-500 uppercase tracking-widest">Contacto</td>
                      {selectedForCompare.map(s => (
                        <td key={s.id} className="py-8 px-8 text-center">
                          <p className="text-sm font-bold text-white mb-1">{s.contact_name || 'N/A'}</p>
                          <p className="text-xs text-zinc-500">{s.phone || 'Sin teléfono'}</p>
                          <p className="text-xs text-zinc-500 truncate max-w-[200px] mx-auto">{s.email || 'Sin email'}</p>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-8 px-4 font-black text-[10px] text-zinc-500 uppercase tracking-widest">Capacidades / Notas</td>
                      {selectedForCompare.map(s => (
                        <td key={s.id} className="py-8 px-8 text-center bg-zinc-900/10">
                          <p className="text-xs text-zinc-400 leading-relaxed italic max-w-[250px] mx-auto">
                            {s.notes || 'No hay especificaciones adicionales registradas para este proveedor.'}
                          </p>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-zinc-700 bg-zinc-900/50">
                      <td className="py-10 px-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Acción</td>
                      {selectedForCompare.map(s => (
                        <td key={s.id} className="py-10 px-8 text-center">
                          <button
                            onClick={() => {
                              setIsCompareViewOpen(false);
                              handleEdit(s);
                            }}
                            className="px-6 py-2.5 rounded-full border border-zinc-700 text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
                          >
                            Ver Detalles
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
