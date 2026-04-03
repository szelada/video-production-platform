'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, FileText, Clock, CheckSquare, MapPin, UserPlus, Plus, 
  ChevronRight, Check, Trash2, Sparkles, FolderOpen, ImageIcon, 
  Link2, ListChecks, Phone, Maximize2, Mail, Calendar, Camera, Package,
  Loader2, X, MoreVertical, Users, Download
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';


interface PhasePreProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  materials: any[];
  isAnalyzing: boolean;
  analysisComplete: boolean;
  analyzingPhase: string;
  handleAIAnalysis: () => void;
  activeScriptId: string | null;
  setActiveScriptId: (id: string) => void;
  handleDeleteMaterial: (id: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  scriptInputRef: React.RefObject<HTMLInputElement | null>;
  storyboardInputRef: React.RefObject<HTMLInputElement | null>;
  breakdownItems: any[];
  breakdownFilter: string;
  setBreakdownFilter: (filter: string) => void;
  scoutingCategory: 'locaciones' | 'casting' | 'equipos' | 'utileria';
  setScoutingCategory: (cat: 'locaciones' | 'casting' | 'equipos' | 'utileria') => void;
  locations: any[];
  casting: any[];
  artItems: any[];
  crew: any[];
  callSheets: any[];
  setIsAddTaskModalOpen?: (open: boolean) => void;
  handleAddTask?: (e: React.FormEvent) => void;
  onPromoteToScouting?: (item: any) => void;
  onDeleteBreakdownItem?: (itemId: string) => void;
  onUpdateBreakdownItem?: (itemId: string, updates: any) => void;
  onCreateTaskFromResource?: (resource: any, type: 'location' | 'talent' | 'art') => void;
  onDeleteResource?: (resourceId: string, type: 'location' | 'casting' | 'art') => void;
  onUpdateResource?: (resourceId: string, type: 'location' | 'casting' | 'art', updates: any) => void;
  onAddBreakdownItem?: (item: any) => void;
  setIsCastingTerminalOpen?: (open: boolean) => void;
  setIsLocationTerminalOpen?: (open: boolean) => void;
  setIsArtTerminalOpen?: (open: boolean) => void;
}

export const PhasePre: React.FC<PhasePreProps> = ({
  activeSubTab,
  setActiveSubTab,
  materials,
  isAnalyzing,
  analysisComplete,
  analyzingPhase,
  handleAIAnalysis,
  activeScriptId,
  setActiveScriptId,
  handleDeleteMaterial,
  handleFileUpload,
  scriptInputRef,
  storyboardInputRef,
  breakdownItems,
  breakdownFilter,
  setBreakdownFilter,
  scoutingCategory,
  setScoutingCategory,
  locations,
  casting,
  artItems,
  crew,
  callSheets,
  setIsAddTaskModalOpen,
  handleAddTask,
  onPromoteToScouting,
  onDeleteBreakdownItem,
  onUpdateBreakdownItem,
  onCreateTaskFromResource,
  onDeleteResource,
  onUpdateResource,
  setIsCastingTerminalOpen,
  setIsLocationTerminalOpen,
  setIsArtTerminalOpen,
  onAddBreakdownItem
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedEditItem, setSelectedEditItem] = React.useState<any>(null);
  const [editForm, setEditForm] = React.useState<any>({});
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [isAddBreakdownModalOpen, setIsAddBreakdownModalOpen] = React.useState(false);
  const [newBreakdownForm, setNewBreakdownForm] = React.useState<any>({
    category: 'utileria',
    name: '',
    description: '',
    scene_number: '1',
    is_ai_generated: false
  });

  const openEditModal = (item: any, type: 'breakdown' | 'location' | 'casting' | 'art') => {
    setSelectedEditItem({ ...item, _type: type });
    setEditForm({
      name: item.name || item.full_name || '',
      description: item.description || item.notes || item.needs || '',
      // Extra fields for specific types
      age: item.age || '',
      physical_characteristics: item.physical_characteristics || '',
      city: item.city || '',
      needs: item.needs || '',
      distance: item.distance || '',
      access_details: item.access_details || '',
    });
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveEdit = () => {
    if (!selectedEditItem) return;
    const { _type, id } = selectedEditItem;
    
    if (_type === 'breakdown') {
      onUpdateBreakdownItem?.(id, { name: editForm.name, description: editForm.description });
    } else {
      onUpdateResource?.(id, _type, editForm);
    }
    setIsEditModalOpen(false);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBreakdownItem?.(newBreakdownForm);
    setIsAddBreakdownModalOpen(false);
    setNewBreakdownForm({
      category: 'utileria',
      name: '',
      description: '',
      scene_number: '1',
      is_ai_generated: false
    });
  };

  // -----------------------------------------------------
  // LOGIC: Character Counts & Stats
  // -----------------------------------------------------
  const characters = Array.from(new Set(
    breakdownItems
      .filter(item => item.category?.toLowerCase() === 'personaje')
      .map(item => item.name)
  ));

  const totalLocations = Array.from(new Set(
    breakdownItems
      .filter(item => item.category?.toLowerCase() === 'locación' || item.category?.toLowerCase() === 'locacion')
      .map(item => item.name)
  )).length;

  const totalProps = breakdownItems.filter(item => 
    item.category?.toLowerCase() === 'utilería' || 
    item.category?.toLowerCase() === 'utileria' ||
    item.category?.toLowerCase() === 'arte'
  ).length;

  const promotedCount = breakdownItems.filter(item => item.promoted || item.status === 'linked').length;
  const progressPercent = breakdownItems.length > 0 
    ? Math.round((promotedCount / breakdownItems.length) * 100) 
    : 0;

  return (
    <div className="space-y-10">
      {activeSubTab === 'resumen' && (
        <motion.div
          key="pre-resumen"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-10"
        >
          {/* Hero Summary Card */}
          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 rounded-[3rem] p-12 text-white shadow-2xl shadow-indigo-200/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">Estado de Pre-pro</span>
                  <span className="flex items-center gap-2 text-indigo-100 text-[10px] font-bold">
                    <Clock size={12} /> Actualizado hace 2h
                  </span>
                </div>
                <h1 className="text-5xl font-black tracking-tight leading-tight">Mesa de Control <br/> Pre-producción</h1>
                <p className="text-indigo-100/80 text-lg max-w-xl font-medium">
                  Gestiona el material base, desglosa escenas y prepara la biblia del proyecto antes de pasar al rodaje.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleAIAnalysis}
                  className="px-8 py-5 bg-white text-indigo-600 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-3 shadow-xl"
                >
                  <Rocket size={20} /> ANALIZAR CON IA
                </button>
                <button 
                  onClick={() => setIsAddTaskModalOpen?.(true)}
                  className="px-8 py-5 bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                >
                  <Plus size={20} /> NUEVA TAREA
                </button>
                <button className="px-8 py-5 bg-indigo-500/30 backdrop-blur-md border border-white/20 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                  <FileText size={20} /> GENERAR BIBLIA
                </button>
              </div>
            </div>
          </div>

          {/* Checklist & Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progress Checklist */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Estado del Desglose</h3>
                <span className="text-3xl font-black text-indigo-600">{progressPercent}%</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Script Analizado', status: breakdownItems.length > 0 ? 'done' : 'pending' },
                  { label: `Personajes Detectados (${characters.length})`, status: characters.length > 0 ? 'done' : 'pending' },
                  { label: `Locaciones Detectadas (${totalLocations})`, status: totalLocations > 0 ? 'done' : 'pending' },
                  { label: `Utilería Detectada (${totalProps})`, status: totalProps > 0 ? 'done' : 'pending' },
                  { label: 'Promoción a Scouting', status: promotedCount > 0 ? (promotedCount === breakdownItems.length ? 'done' : 'partial') : 'pending', info: `${promotedCount}/${breakdownItems.length} vinculados` },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      item.status === 'done' ? 'bg-emerald-100 text-emerald-600' :
                      item.status === 'partial' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {item.status === 'done' ? <CheckSquare size={16} /> : <Clock size={16} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black text-gray-800 uppercase tracking-widest">{item.label}</p>
                      {item.info && <p className="text-[10px] text-gray-400 font-bold mt-0.5">{item.info}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sourcing Overview */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Inventario AI</h3>
              <div className="space-y-4">
                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><MapPin size={18} /></div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase">Locaciones</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-black text-emerald-900">{totalLocations}</span>
                    <span className="text-[10px] font-bold text-emerald-600 mb-1">DETECTADAS</span>
                  </div>
                </div>
                <div className="p-6 bg-pink-50 rounded-3xl border border-pink-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><UserPlus size={18} /></div>
                    <span className="text-[10px] font-black text-pink-600 uppercase">Personajes</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-black text-pink-900">{characters.length}</span>
                    <span className="text-[10px] font-bold text-pink-600 mb-1">DETECTADOS</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveSubTab('desglose')}
                  className="w-full py-4 px-6 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all"
                >
                  VER DESGLOSE
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeSubTab === 'base' && (
        <motion.div
          key="pre-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Material Base</h2>
              <p className="text-sm text-gray-500 uppercase font-black tracking-widest mt-1">Carga de guiones, storyboards y referencias</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <FileText size={24} />
                </div>
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">Guion</span>
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-black text-gray-900">Guion Literario</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Versión oficial del guion para el proceso de desglose y consulta del equipo.</p>
                
                {materials.filter(m => m.type === 'script').map(m => (
                  <div key={m.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${activeScriptId === m.id ? 'bg-indigo-50 border-indigo-200 ring-4 ring-indigo-500/5' : 'bg-gray-50 border-gray-100 hover:bg-white'}`}>
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-500">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-gray-900 truncate">{m.file_name}</p>
                        {activeScriptId === m.id && (
                          <span className="text-[8px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Principal</span>
                        )}
                      </div>
                      <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">VERSIÓN {m.version}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {activeScriptId !== m.id ? (
                        <button onClick={() => setActiveScriptId(m.id)} className="p-2 text-indigo-400 hover:text-indigo-600 transition-colors" title="Activar">
                          <Check size={16} />
                        </button>
                      ) : (
                        <div className="p-2 text-indigo-600"><Check size={16} /></div>
                      )}
                      <button onClick={() => handleDeleteMaterial(m.id)} className="p-2 text-gray-400 hover:text-rose-600 transition-colors" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <input 
                type="file" 
                ref={scriptInputRef} 
                className="hidden" 
                onChange={(e) => handleFileUpload(e, 'script')} 
              />
              
              <div className="space-y-3">
                <button 
                  onClick={() => scriptInputRef.current?.click()}
                  className="w-full py-4 bg-gray-50 text-gray-400 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-gray-600 hover:border-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> CARGAR NUEVA VERSIÓN
                </button>

                <button 
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing}
                  className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                    analysisComplete 
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none'
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="text-[8px] opacity-70 animate-pulse">{analyzingPhase}</span>
                    </div>
                  ) : analysisComplete ? (
                    <><Check size={18} /> ANÁLISIS COMPLETADO</>
                  ) : (
                    <><Sparkles size={18} /> ANALIZAR GUION (IA)</>
                  )}
                </button>

                {analysisComplete && (
                  <button
                    onClick={() => setActiveSubTab('desglose')}
                    className="w-full py-3 text-indigo-600 font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:underline"
                  >
                    VER DESGLOSE GENERADO <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <FolderOpen size={24} />
                </div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Visual</span>
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-black text-gray-900">Storyboard</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Secuencia visual del proyecto aprobada para pre-visualización por el crew.</p>
                
                {materials.filter(m => m.type === 'storyboard').map(m => (
                  <div key={m.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-500">
                      <ImageIcon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{m.file_name}</p>
                      <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">AÑADIDO EL {new Date(m.created_at).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => handleDeleteMaterial(m.id)} className="p-2 text-gray-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100" title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <input 
                type="file" 
                ref={storyboardInputRef} 
                className="hidden" 
                onChange={(e) => handleFileUpload(e, 'storyboard')} 
              />
              <button 
                onClick={() => storyboardInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-indigo-300 hover:text-indigo-400 transition-all flex flex-col items-center gap-2 p-8 text-center"
              >
                <Plus size={24} /> ARRASTRAR STORYBOARD
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Link2 size={24} />
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Moodboard</span>
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-black text-gray-900">Referencias</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Vínculos externos a Pinterest, Frame.io o carpetas de Drive con el estilo visual.</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Link2 size={12} /></div>
                    <span className="text-xs font-bold text-gray-900 truncate flex-1">Pinterest Moodboard</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="https://..." className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" />
                <button className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all">
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeSubTab === 'desglose' && (
        <motion.div
          key="pre-desglose"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Desglose de Producción</h2>
              <p className="text-sm text-gray-500 uppercase font-black tracking-widest mt-1">Análisis de elementos por escena (IA Assisted)</p>
            </div>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2">
            {['Todos', 'Personajes', 'Utilería', 'Locaciones', 'Vestuario', 'Equipo Técnico', 'Extras'].map((cat) => (
              <button 
                key={cat} 
                onClick={() => setBreakdownFilter(cat)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  breakdownFilter === cat ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-20">Esc</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoría</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Elemento</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Descripción</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {breakdownItems
                  .filter(item => {
                    if (breakdownFilter === 'Todos') return true;
                    const catMap: Record<string, string> = {
                      'Personajes': 'personaje',
                      'Utilería': 'utileria',
                      'Locaciones': 'locacion',
                      'Vestuario': 'vestuario',
                      'Equipo Técnico': 'equipo',
                      'Extras': 'extras'
                    };
                    return item.category === catMap[breakdownFilter] || item.category === breakdownFilter.toLowerCase() || (breakdownFilter === 'Equipo Técnico' && item.category === 'equipo');
                  })
                  .map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-gray-400">#{item.scene_number}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${
                        item.category === 'personaje' ? 'bg-purple-50 text-purple-600' :
                        item.category === 'utileria' ? 'bg-amber-50 text-amber-600' :
                        item.category === 'locacion' ? 'bg-emerald-50 text-emerald-600' :
                        item.category === 'vestuario' ? 'bg-indigo-50 text-indigo-600' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">{item.name}</span>
                        {item.is_ai_generated && <Sparkles size={12} className="text-indigo-400" />}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-gray-500 italic max-w-xs">{item.description}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'confirmed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {item.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === 'linked' ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                            <Check size={14} className="font-black" />
                            <span className="text-[9px] font-black uppercase tracking-widest">En Scouting</span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => onPromoteToScouting?.(item)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group/btn"
                          >
                            <Plus size={14} className="group-hover/btn:rotate-90 transition-transform" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Promover</span>
                          </button>
                        )}
                        <div className="relative">
                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                            className={`p-2 rounded-lg transition-all ${activeMenuId === item.id ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                          >
                            <MoreVertical size={14} />
                          </button>
                          
                          {activeMenuId === item.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in duration-200">
                              <button 
                                onClick={() => openEditModal(item, 'breakdown')}
                                className="w-full px-6 py-2.5 text-left text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                              >
                                <Sparkles size={14} className="text-indigo-500" /> Editar Item
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm('¿Eliminar este elemento del desglose?')) {
                                    onDeleteBreakdownItem?.(item.id);
                                    setActiveMenuId(null);
                                  }
                                }}
                                className="w-full px-6 py-2.5 text-left text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors"
                              >
                                <Trash2 size={14} /> Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button 
              onClick={() => setIsAddBreakdownModalOpen(true)}
              className="w-full py-6 bg-gray-50/30 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:bg-white hover:text-indigo-700 transition-all border-t border-gray-50 flex items-center justify-center gap-2 group"
            >
              <div className="p-1.5 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                <Plus size={14} />
              </div>
              AGREGAR ELEMENTO MANUALMENTE
            </button>
          </div>
        </motion.div>
      )}

      {activeSubTab === 'scouting' && (
        <motion.div
          key="pre-scouting"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 p-8 rounded-[3rem] border border-gray-100 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-100/50">
                <MapPin size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">Scouting & Sourcing</h2>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em] mt-2">Gestión de activos críticos para la producción</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (scoutingCategory === 'locaciones') setIsLocationTerminalOpen?.(true);
                  else if (scoutingCategory === 'casting') setIsCastingTerminalOpen?.(true);
                  else setIsArtTerminalOpen?.(true);
                }}
                className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-2"
              >
                <Plus size={16} /> AGREGAR {scoutingCategory.toUpperCase()}
              </button>
              
              <div className="flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-3xl border border-gray-100">
              {[
                { id: 'locaciones', label: 'Locaciones', icon: MapPin },
                { id: 'casting', label: 'Talento', icon: Users },
                { id: 'equipos', label: 'Equipos', icon: Camera },
                { id: 'utileria', label: 'Utilería', icon: Package }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setScoutingCategory(cat.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    scoutingCategory === cat.id 
                      ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <cat.icon size={14} /> {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scoutingCategory === 'locaciones' && (locations || []).length > 0 ? (
              (locations || []).map((loc: any) => (
                <div key={loc.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                   <div className="aspect-video bg-gray-100 rounded-[2rem] overflow-hidden mb-6 relative">
                      {loc.main_photo_url ? (
                        <img src={loc.main_photo_url} className="w-full h-full object-cover" alt={loc.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <MapPin size={48} />
                        </div>
                      )}
                   </div>
                   <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{loc.name}</h3>
                   <p className="text-xs text-gray-500 mt-1 uppercase font-bold">{loc.city} • {loc.type}</p>
                   
                   <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEditModal(loc, 'location')}
                          className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          title="Editar detalles"
                        >
                          <Sparkles size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if(confirm('¿Eliminar esta locación?')) onDeleteResource?.(loc.id, 'location');
                          }}
                          className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-rose-600 hover:bg-rose-50 transition-all"
                          title="Eliminar locación"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => onCreateTaskFromResource?.(loc, 'location')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
                      >
                        <CheckSquare size={14} /> Generar Tarea
                      </button>
                   </div>
                </div>
              ))
            ) : scoutingCategory === 'locaciones' && (
              <div className="col-span-full py-20 bg-white rounded-[3rem] border border-gray-100 text-center">
                <MapPin size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">No hay locaciones registradas</p>
              </div>
            )}

            {scoutingCategory === 'casting' && (casting || []).length > 0 ? (
              (casting || []).map((profile: any) => (
                <div key={profile.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                   <div className="aspect-[3/4] bg-gray-100 rounded-[2rem] overflow-hidden mb-6 relative">
                      {profile.photo_url || profile.casting_profiles?.photo_url ? (
                        <img src={profile.photo_url || profile.casting_profiles?.photo_url} className="w-full h-full object-cover" alt={profile.full_name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Users size={48} />
                        </div>
                      )}
                   </div>
                   <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{profile.full_name || profile.casting_profiles?.full_name}</h3>
                   <p className="text-xs text-gray-500 mt-1 uppercase font-bold">{profile.age_range || profile.casting_profiles?.age_range || 'N/A'} • {profile.city || profile.casting_profiles?.city || 'N/A'}</p>
                   
                   <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEditModal(profile.casting_profiles || profile, 'casting')}
                          className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          title="Editar detalles"
                        >
                          <Sparkles size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if(confirm('¿Eliminar este perfil?')) onDeleteResource?.(profile.casting_profile_id || profile.id, 'casting');
                          }}
                          className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-rose-600 hover:bg-rose-50 transition-all"
                          title="Eliminar perfil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => onCreateTaskFromResource?.(profile.casting_profiles || profile, 'talent')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
                      >
                        <CheckSquare size={14} /> Generar Tarea
                      </button>
                   </div>
                </div>
              ))
            ) : scoutingCategory === 'casting' && (
              <div className="col-span-full py-20 bg-white rounded-[3rem] border border-gray-100 text-center">
                <Users size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">No hay talento registrado</p>
              </div>
            )}

            {scoutingCategory === 'equipos' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full col-span-full">
                {artItems.filter(item => item.category === 'Equipos').length > 0 ? (
                  artItems.filter(item => item.category === 'Equipos').map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                       <div className="aspect-video bg-gray-100 rounded-[2rem] overflow-hidden mb-6 relative">
                          {item.art_photos?.[0] ? (
                            <img src={item.art_photos[0].url} className="w-full h-full object-cover" alt={item.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Camera size={48} />
                            </div>
                          )}
                       </div>
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{item.name}</h3>
                       <p className="text-xs text-gray-500 mt-1 uppercase font-bold">{item.description}</p>
                       <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openEditModal(item, 'art')}
                              className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                              title="Editar detalles"
                            >
                              <Sparkles size={14} />
                            </button>
                            <button 
                              onClick={() => {
                                if(confirm('¿Eliminar este item?')) onDeleteResource?.(item.id, 'art');
                              }}
                              className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-rose-600 hover:bg-rose-50 transition-all"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => onCreateTaskFromResource?.(item, 'art')}
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2"
                          >
                            <CheckSquare size={12} /> Tarea
                          </button>
                       </div>
                    </div>
                  ))
                ) : (
                  [
                    { id: 'e1', name: 'ARRI Alexa Mini LF', description: 'Cámara principal, sensor Full Frame 4.5K', status: 'Confirmado', image: 'https://images.unsplash.com/photo-1574717024458-388ee0262143?q=80&w=400' },
                    { id: 'e2', name: 'Cooke S7/i Set', description: 'Set de lentes Full Frame (18mm - 135mm)', status: 'Confirmado', image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400' },
                    { id: 'e3', name: 'Movi Pro Gimbals', description: 'Sistema de estabilización de 3 ejes', status: 'Pendiente', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400' }
                  ].map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                       <div className="aspect-video bg-gray-100 rounded-[2rem] overflow-hidden mb-6 relative">
                          <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                       </div>
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{item.name}</h3>
                       <p className="text-xs text-gray-500 mt-1 uppercase font-bold">{item.description}</p>
                       <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openEditModal(item, 'art')}
                              className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                              title="Editar detalles"
                            >
                              <Sparkles size={14} />
                            </button>
                            <button 
                              onClick={() => {
                                if(confirm('¿Eliminar este item?')) onDeleteResource?.(item.id, 'art');
                              }}
                              className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-rose-600 hover:bg-rose-50 transition-all"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => onCreateTaskFromResource?.(item, 'art')}
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2"
                          >
                            <CheckSquare size={12} /> Tarea
                          </button>
                       </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {scoutingCategory === 'utileria' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full col-span-full">
                {artItems.filter(item => item.category === 'Utilería').length > 0 ? (
                  artItems.filter(item => item.category === 'Utilería').map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                       <div className="aspect-video bg-gray-100 rounded-[2rem] overflow-hidden mb-6 relative">
                          {item.art_photos?.[0] ? (
                            <img src={item.art_photos[0].url} className="w-full h-full object-cover" alt={item.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Package size={48} />
                            </div>
                          )}
                       </div>
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{item.name}</h3>
                       <p className="text-xs text-gray-500 mt-1 uppercase font-bold">{item.description}</p>
                       <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openEditModal(item, 'art')}
                              className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                              title="Editar detalles"
                            >
                              <Sparkles size={14} />
                            </button>
                            <button 
                              onClick={() => {
                                if(confirm('¿Eliminar esta utilería?')) onDeleteResource?.(item.id, 'art');
                              }}
                              className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-rose-600 hover:bg-rose-50 transition-all"
                              title="Eliminar utilería"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => onCreateTaskFromResource?.(item, 'art')}
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2"
                          >
                            <CheckSquare size={12} /> Tarea
                          </button>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 bg-white rounded-[3rem] border border-gray-100 text-center">
                    <Package size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest">No hay utilería registrada</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeSubTab === 'biblia' && (
        <motion.div
          key="pre-biblia"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-10"
        >
           <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Biblia del Proyecto</h2>
              <p className="text-sm text-gray-500 uppercase font-black tracking-widest mt-1">Consolidación y exportación de pre-producción</p>
            </div>
            <button className="px-8 py-4 bg-gray-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl flex items-center gap-3">
              <Download size={20} /> GENERAR & DESCARGAR PDF
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secciones Incluidas</h3>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 space-y-2">
                {[
                  { label: 'Portada & Branding', icon: ImageIcon },
                  { label: 'Guion Literario', icon: FileText },
                  { label: 'Storyboard', icon: FolderOpen },
                  { label: 'Desglose de Escenas', icon: ListChecks },
                  { label: 'Locaciones Aprobadas', icon: MapPin },
                  { label: 'Casting Confirmado', icon: Users },
                  { label: 'Plan de Rodaje', icon: Clock },
                  { label: 'Crew & Contactos', icon: Phone },
                ].map((section, i) => (
                   <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer group">
                     <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                       <section.icon size={14} />
                     </div>
                     <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">{section.label}</span>
                     <div className="ml-auto w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                       <CheckSquare size={10} />
                     </div>
                   </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vista Previa</h3>
              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col group">
                <div className="p-10 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-indigo-600 text-white rounded-2xl">
                       <FileText size={24} />
                     </div>
                     <div>
                       <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Borrador de Biblia</h4>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sincronizado automáticamente</p>
                     </div>
                   </div>
                   <button className="p-4 bg-white text-gray-400 rounded-2xl border border-gray-100 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                     <Maximize2 size={20} />
                   </button>
                </div>
                
                <div className="flex-1 p-10 space-y-12 overflow-y-auto max-h-[700px] scrollbar-hide">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-l-2 border-indigo-600 pl-3">I. Guion Literario</h5>
                    <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                       <p className="text-xs text-gray-600 leading-relaxed italic">"EXT. PARQUE - DÍA. Un sol radiante ilumina el verde del pasto. MANUEL camina pensativo..."</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-l-2 border-indigo-600 pl-3">II. Crew & Contactos</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {crew.length > 0 ? crew.slice(0, 4).map((m: any) => (
                        <div key={m.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 hover:shadow-md transition-all">
                          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
                             {m.profiles?.avatar_url ? (
                               <img src={m.profiles.avatar_url} className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <Users size={18} />
                               </div>
                             )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{m.profiles?.full_name}</p>
                            <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-widest truncate">{m.roles?.name || 'Staff'}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone size={10} className="text-gray-400" />
                              <p className="text-[8px] text-gray-500 font-medium">+51 987 654 321</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail size={10} className="text-gray-400" />
                              <p className="text-[8px] text-gray-500 font-medium truncate">{m.profiles?.email || 'crew@916.studio'}</p>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <p className="text-[10px] text-gray-400 italic">No hay miembros registrados todavía.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-l-2 border-indigo-600 pl-3">III. Plan de Rodaje</h5>
                    <div className="space-y-3">
                      {callSheets.length > 0 ? callSheets.slice(0, 3).map((cs: any) => (
                        <div key={cs.id} className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Calendar size={14} /></div>
                            <div>
                              <p className="text-xs font-black text-gray-900 uppercase tracking-tight">Día de Rodaje: {cs.shoot_date}</p>
                              <p className="text-[9px] text-amber-600 font-bold uppercase tracking-widest">{cs.locations?.name || 'Locación por definir'}</p>
                            </div>
                          </div>
                          <Badge variant="warning" className="text-[8px] border-amber-200 text-amber-600 bg-white shadow-sm">PREPARADO</Badge>
                        </div>
                      )) : (
                        <div className="p-8 bg-gray-50 border border-gray-100 border-dashed rounded-[2rem] text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-black">No hay hojas de llamado creadas</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Edit Detail Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[3rem] w-full max-w-2xl p-10 border border-gray-100 shadow-2xl relative"
          >
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 transition-all"
            >
              <X size={24} />
            </button>
            
            <div className="mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">Editar Detalles</h4>
              <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                {selectedEditItem?.name || selectedEditItem?.full_name}
              </h3>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Nombre / Título</label>
                <input 
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Descripción / Notas</label>
                <textarea 
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all min-h-[120px] resize-none"
                />
              </div>

              {selectedEditItem?._type === 'casting' && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Edad / Rango</label>
                    <input 
                      type="text"
                      value={editForm.age}
                      onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Rasgos Físicos</label>
                    <input 
                      type="text"
                      value={editForm.physical_characteristics}
                      onChange={(e) => setEditForm({ ...editForm, physical_characteristics: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>
              )}

              {selectedEditItem?._type === 'location' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Ciudad / Distrito</label>
                      <input 
                        type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Distancia / Tiempo</label>
                      <input 
                        type="text"
                        value={editForm.distance}
                        onChange={(e) => setEditForm({ ...editForm, distance: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Necesidades Técnicas / Accesos</label>
                    <textarea 
                      value={editForm.needs}
                      onChange={(e) => setEditForm({ ...editForm, needs: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 flex gap-4">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveEdit}
                className="flex-[2] py-5 bg-indigo-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                Guardar Cambios
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Manual Add Breakdown Modal */}
      {isAddBreakdownModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[3.5rem] w-full max-w-xl p-12 border border-gray-100 shadow-2xl relative"
          >
            <button 
              onClick={() => setIsAddBreakdownModalOpen(false)}
              className="absolute top-10 right-10 p-2 text-gray-400 hover:text-gray-900 transition-all"
            >
              <X size={24} />
            </button>
            
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <ListChecks size={20} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Script Breakdown</h4>
              </div>
              <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Nuevo Elemento</h3>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Categoría</label>
                  <div className="relative">
                    <select 
                      value={newBreakdownForm.category}
                      onChange={(e) => setNewBreakdownForm({ ...newBreakdownForm, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none"
                      required
                    >
                      <option value="personaje">Personaje / Casting</option>
                      <option value="locacion">Locación</option>
                      <option value="utileria">Utilería / Arte</option>
                      <option value="vestuario">Vestuario</option>
                      <option value="equipo">Equipo Técnico</option>
                      <option value="extra">Extras</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <Plus size={16} className="rotate-45" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Escena #</label>
                  <input 
                    type="text"
                    value={newBreakdownForm.scene_number}
                    onChange={(e) => setNewBreakdownForm({ ...newBreakdownForm, scene_number: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="Ej: 1A"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Nombre del Elemento</label>
                <input 
                  type="text"
                  value={newBreakdownForm.name}
                  onChange={(e) => setNewBreakdownForm({ ...newBreakdownForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono uppercase"
                  placeholder="Ej: MESA DE ESTUDIO"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Descripción / Requerimientos</label>
                <textarea 
                  value={newBreakdownForm.description}
                  onChange={(e) => setNewBreakdownForm({ ...newBreakdownForm, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[120px] resize-none"
                  placeholder="Detalles técnicos, características o necesidades específicas..."
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <Plus size={18} /> AGREGAR AL DESGLOSE
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
