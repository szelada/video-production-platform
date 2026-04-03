'use client';
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Building,
  X,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    client_name: '',
    project_type: 'Comercial',
    status: 'draft' as 'draft' | 'active' | 'completed',
    start_date: '',
    end_date: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.code.trim()) newErrors.code = 'El código es obligatorio';
    if (!formData.client_name.trim()) newErrors.client_name = 'El cliente es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          ...formData,
          // Convert empty strings to null for optional dates
          start_date: formData.start_date || null,
          end_date: formData.end_date || null
        }
      ])
      .select();

    if (!error && data) {
      const newProject = data[0];

      // Log activity
      await supabase.from('project_activity').insert([{
        project_id: newProject.id,
        action: 'project_created',
        description: `Proyecto "${newProject.name}" creado.`,
        created_at: new Date().toISOString()
      }]);

      setProjects(prev => [newProject, ...prev]);
      setIsModalOpen(false);
      setFormData({
        name: '',
        code: '',
        description: '',
        client_name: '',
        project_type: 'Comercial',
        status: 'draft',
        start_date: '',
        end_date: ''
      });
    } else if (error) {
      console.error('Error creating project:', error);
      alert('Error al crear el proyecto: ' + error.message);
    }
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-6 p-8 lg:p-12 min-h-[calc(100vh-theme(spacing.24))] bg-[#F8F9FA]"
    >
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-5xl font-black tracking-tightest text-zinc-900 leading-none mb-4">Proyectos</h1>
          <p className="text-sm font-black text-zinc-400 uppercase tracking-widest leading-none">Gestiona y supervisa tus rodajes activos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-[2rem] font-black hover:bg-zinc-800 transition-all shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-widest text-[10px]"
        >
          <Plus size={18} strokeWidth={3} /> Nuevo Proyecto
        </button>
      </div>

      {/* Main Content Area */}
      <div className="space-y-10">
        {/* Unified Search & Filter Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/50 backdrop-blur-xl p-4 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-[2rem] px-6 py-4 flex-1 w-full shadow-sm group focus-within:ring-4 focus-within:ring-zinc-100 transition-all">
            <Search size={16} className="text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
            <input
              type="text"
              placeholder="Buscar por nombre, cliente o código..."
              className="bg-transparent border-none outline-none text-[11px] font-bold w-full placeholder:text-zinc-300 text-zinc-900"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-[2rem] bg-white border border-gray-100 text-zinc-400 font-black hover:text-zinc-900 transition-all w-full sm:w-auto uppercase tracking-widest text-[10px] shadow-sm">
              <Filter size={14} strokeWidth={3} /> Estado
            </button>
            <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-[2rem] bg-zinc-900 text-white font-black transition-all shadow-xl w-full sm:w-auto uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95">
              Recientes
            </button>
          </div>
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
            <p className="text-zinc-400 font-black uppercase tracking-widest text-[10px] animate-pulse">Cargando la mesa de trabajo...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center gap-6 bg-white rounded-[3rem] border border-gray-100 border-dashed shadow-sm">
            <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center text-zinc-200">
               <FolderOpen size={40} />
            </div>
            <div className="text-center">
               <p className="text-zinc-900 font-black text-sm uppercase tracking-tight">No hay proyectos registrados</p>
               <p className="text-zinc-400 text-xs font-medium mt-1">Comienza creando tu primera producción</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-4 text-[10px] font-black text-white bg-zinc-900 rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl uppercase tracking-[0.2em]"
            >
              CREAR PRIMER PROYECTO
            </button>
          </div>
        ) : (
          /* Premium Project Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-white group flex flex-col rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 overflow-hidden"
              >
                <div className="p-8 lg:p-10 flex-1 space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-black text-zinc-300 tracking-[0.2em] uppercase">{project.code}</span>
                         <div className="h-px flex-1 bg-zinc-50" />
                      </div>
                      <Link href={`/projects/${project.id}`}>
                        <h3 className="text-2xl font-black text-zinc-900 group-hover:text-indigo-600 transition-colors leading-[1.1] tracking-tightest">{project.name}</h3>
                      </Link>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        alert(`Opciones para: ${project.name}`);
                      }}
                      className="p-3 bg-zinc-50 rounded-2xl text-zinc-300 hover:text-zinc-900 hover:bg-zinc-100 transition-all shadow-inner"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] font-black px-4 py-2 rounded-xl bg-zinc-50 text-zinc-400 uppercase tracking-widest border border-gray-100/50">
                      {project.project_type}
                    </span>
                    <span className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${project.status === 'active' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                      project.status === 'draft' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                        'bg-zinc-50 text-zinc-300 border border-gray-100'
                      }`}>
                      {project.status === 'active' ? 'EN RODAJE' : project.status === 'draft' ? 'PRE-PRO' : 'COMPLETADO'}
                    </span>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#F8F9FA] flex items-center justify-center border border-gray-100 shadow-inner">
                        <Building size={16} className="text-zinc-400" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Cliente</span>
                         <span className="text-xs font-bold text-zinc-700">{project.client_name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#F8F9FA] flex items-center justify-center border border-gray-100 shadow-inner">
                        <Calendar size={16} className="text-zinc-400" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Cronograma</span>
                         <span className="text-xs font-bold text-zinc-700 tracking-tight">{project.start_date || 'TBD'} — {project.end_date || 'TBD'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-10 py-6 bg-[#F8F9FA]/50 border-t border-gray-50 flex items-center justify-between group-hover:bg-zinc-950 transition-colors duration-500">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-9 h-9 rounded-xl bg-white border-4 border-[#F8F9FA] group-hover:border-zinc-900 group-hover:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-200 transition-all">
                        ?
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-[9px] font-black text-zinc-900 bg-white border border-gray-100 px-6 py-3 rounded-xl hover:bg-zinc-900 hover:text-white group-hover:bg-white group-hover:text-zinc-950 transition-all uppercase tracking-[0.2em] shadow-sm"
                  >
                    ABRIR PROYECTO
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tooltip / Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-[3rem] border border-gray-100 overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                <div>
                   <h2 className="text-3xl font-black text-zinc-900 tracking-tightest">Nuevo Proyecto</h2>
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Configura tu producción</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-4 bg-zinc-50 hover:bg-zinc-100 rounded-2xl text-zinc-300 hover:text-zinc-900 transition-all border border-gray-100 shadow-inner"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nombre del Proyecto *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Campaña Verano 2024"
                      className={`w-full bg-[#F8F9FA] border ${errors.name ? 'border-red-200' : 'border-gray-100'} rounded-2xl px-6 py-4 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all placeholder:text-zinc-300`}
                    />
                    {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.name}</p>}
                  </div>

                  {/* Code */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Código *</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="Ej: CV24-001"
                      className={`w-full bg-[#F8F9FA] border ${errors.code ? 'border-red-200' : 'border-gray-100'} rounded-2xl px-6 py-4 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all placeholder:text-zinc-300`}
                    />
                    {errors.code && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.code}</p>}
                  </div>

                  {/* Client */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Cliente *</label>
                    <input
                      type="text"
                      name="client_name"
                      value={formData.client_name}
                      onChange={handleInputChange}
                      placeholder="Nombre de la marca o empresa"
                      className={`w-full bg-[#F8F9FA] border ${errors.client_name ? 'border-red-200' : 'border-gray-100'} rounded-2xl px-6 py-4 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all placeholder:text-zinc-300`}
                    />
                    {errors.client_name && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.client_name}</p>}
                  </div>

                  {/* Type */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tipo de Proyecto</label>
                    <select
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleInputChange}
                      className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Comercial">Comercial</option>
                      <option value="Documental">Documental</option>
                      <option value="Videoclip">Videoclip</option>
                      <option value="Ficción">Ficción</option>
                      <option value="Corporativo">Corporativo</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Estado Inicial</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="draft">Pre-producción</option>
                      <option value="active">En Rodaje</option>
                      <option value="completed">Completado</option>
                    </select>
                  </div>

                  {/* Dates */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Fecha Inicio</label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 text-sm text-zinc-400 font-bold focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Descripción</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Breve descripción del alcance del proyecto..."
                    rows={3}
                    className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl px-6 py-4 text-sm text-zinc-900 font-medium focus:outline-none focus:ring-4 focus:ring-zinc-50 transition-all placeholder:text-zinc-300 resize-none"
                  />
                </div>

                <div className="pt-10 border-t border-gray-50 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-5 rounded-[2rem] font-black text-[10px] text-zinc-400 bg-zinc-50 hover:bg-zinc-100 hover:text-zinc-900 transition-all uppercase tracking-widest border border-gray-100"
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-5 rounded-[2rem] font-black text-[10px] text-white bg-zinc-900 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        CREANDO...
                      </>
                    ) : 'Crear Proyecto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
