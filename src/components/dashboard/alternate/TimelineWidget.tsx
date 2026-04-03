import React from 'react';
import { motion } from 'framer-motion';

interface Phase {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
}

interface TimelineWidgetProps {
  phases: Phase[];
}

const TimelineWidget: React.FC<TimelineWidgetProps> = ({ phases }) => {
  return (
    <div className="relative py-4 pr-4">
      <div className="absolute left-6 top-8 bottom-8 w-px bg-zinc-200/50" />
      
      <div className="space-y-8">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-center pl-10"
          >
            {/* Status Indicator */}
            <div className={`
              absolute left-4 w-4 h-4 rounded-full border-2 
              flex items-center justify-center
              ${phase.status === 'completed' ? 'bg-[#D9FF54] border-[#D9FF54] text-black' : 
                phase.status === 'current' ? 'bg-white border-[#D9FF54] ring-4 ring-[#D9FF54]/20' : 
                'bg-zinc-100 border-zinc-200'}
            `}>
              {phase.status === 'completed' && (
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
              )}
              {phase.status === 'current' && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#D9FF54] animate-pulse" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={`
                  text-sm font-bold tracking-tight
                  ${phase.status === 'pending' ? 'text-zinc-400' : 'text-zinc-800'}
                `}>
                  {phase.name}
                </h4>
                {phase.date && (
                  <span className="text-[0.65rem] font-medium text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full border border-zinc-100">
                    {phase.date}
                  </span>
                )}
              </div>
              <p className="text-[0.7rem] text-zinc-500 mt-0.5 line-clamp-1 opacity-70">
                {phase.status === 'completed' ? 'Fase finalizada con éxito' : 
                 phase.status === 'current' ? 'En ejecución activa' : 
                 'Pendiente de inicio'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimelineWidget;
