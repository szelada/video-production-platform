import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardWidget from './DashboardWidget';
import StatWidget, { MetricsRow } from './StatWidgets';
import TimelineWidget from './TimelineWidget';
import TaskSummaryWidget from './TaskSummaryWidget';
import { LayoutDashboard, Edit3, Check, RotateCcw } from 'lucide-react';

interface AlternateDashboardProps {
  project: any;
  tasks: any[];
  crew?: any[];
  locations?: any[];
}

const DEFAULT_LAYOUT = [
  { id: 'stats', size: 'wide', pos: 0 },
  { id: 'timeline', size: 'medium', pos: 1 },
  { id: 'tasks', size: 'medium', pos: 2 },
  { id: 'team', size: 'small', pos: 3 },
  { id: 'logistics', size: 'small', pos: 4 },
];

const AlternateDashboard: React.FC<AlternateDashboardProps> = ({ 
  project, 
  tasks = [], 
  crew = [], 
  locations = [] 
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [layout, setLayout] = useState(DEFAULT_LAYOUT);

  useEffect(() => {
    const saved = localStorage.getItem(`dashboard_layout_${project?.id || 'default'}`);
    if (saved) {
      setLayout(JSON.parse(saved));
    }
  }, [project?.id]);

  const saveLayout = () => {
    localStorage.setItem(`dashboard_layout_${project?.id || 'default'}`, JSON.stringify(layout));
    setIsEditMode(false);
  };

  const resetLayout = () => {
    setLayout(DEFAULT_LAYOUT);
    localStorage.removeItem(`dashboard_layout_${project?.id || 'default'}`);
  };

  // Mock data/phases for demonstration if not provided
  const phases: any[] = [
    { id: '1', name: 'Pre-producción', status: 'completed', date: '10 Mar' },
    { id: '2', name: 'Casting & Scouting', status: 'current', date: '25 Mar' },
    { id: '3', name: 'Rodaje Principal', status: 'pending', date: '05 Abr' },
    { id: '4', name: 'Post-producción', status: 'pending', date: '20 Abr' },
  ];


  const mainStats = [
    { label: 'Días Restantes', value: 12, trend: 'down', subtext: 'Hasta inicio de rodaje' },
    { label: 'Tareas Críticas', value: tasks.filter(t => t.priority === 'high').length, trend: 'neutral', subtext: 'Requieren atención' },
    { label: 'Presupuesto', value: '$24.5k', trend: 'up', subtext: '65% Ejecutado' },
    { label: 'Equipo', value: crew.length || 8, trend: 'neutral', subtext: 'Miembros activos' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-8 min-h-screen animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#D9FF54] text-black text-[0.6rem] font-black rounded-md uppercase tracking-tighter">
              Admin Alpha
            </span>
            <span className="text-zinc-400 text-[0.6rem] font-bold uppercase tracking-widest">
              Project Dashboard V2
            </span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tightest">
            {project?.name || 'Cargando Proyecto...'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {isEditMode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={resetLayout}
                className="p-3 bg-zinc-100 text-zinc-500 rounded-full hover:bg-zinc-200 transition-colors"
                title="Reset Layout"
              >
                <RotateCcw size={18} />
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={() => isEditMode ? saveLayout() : setIsEditMode(true)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300
              ${isEditMode 
                ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' 
                : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 shadow-sm'}
            `}
          >
            {isEditMode ? (
              <><Check size={18} /> Guardar Cambios</>
            ) : (
              <><Edit3 size={18} /> Personalizar</>
            )}
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[160px]">
        {layout.map((item) => (
          <DashboardWidget
            key={item.id}
            title={
                item.id === 'stats' ? 'Rendimiento' : 
                item.id === 'timeline' ? 'Cronograma' : 
                item.id === 'tasks' ? 'Flujo de Trabajo' : 
                item.id === 'team' ? 'Equipo' : 'Logística'
            }
            size={item.size as any}
            isEditMode={isEditMode}
          >
            {item.id === 'stats' && <MetricsRow stats={mainStats} />}
            {item.id === 'timeline' && <TimelineWidget phases={phases} />}
            {item.id === 'tasks' && <TaskSummaryWidget tasks={tasks as any[]} />}
            
            {item.id === 'team' && (
              <div className="flex flex-col h-full justify-center items-center text-center opacity-40 italic py-4">
                <p className="text-xs font-medium text-zinc-500">
                  Resumen de equipo próximamente
                </p>
              </div>
            )}

            {item.id === 'logistics' && (
              <div className="flex flex-col h-full justify-center items-center text-center opacity-40 italic py-4">
                <p className="text-xs font-medium text-zinc-500">
                  Resumen de locaciones próximamente
                </p>
              </div>
            )}
          </DashboardWidget>
        ))}
      </div>

      {/* Decorative background element */}
      <div className="fixed top-0 right-0 -z-10 w-[50vw] h-[50vh] bg-gradient-to-bl from-[#D9FF54]/10 via-transparent to-transparent blur-3xl rounded-full" />
    </div>
  );
};

export default AlternateDashboard;
