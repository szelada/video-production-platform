import React from 'react';
import { motion } from 'framer-motion';

interface DashboardWidgetProps {
  children: React.ReactNode;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'wide';
  className?: string;
  isEditMode?: boolean;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  children,
  title,
  size = 'medium',
  className = '',
  isEditMode = false,
}) => {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-2',
    large: 'col-span-2 row-span-2',
    wide: 'col-span-2 row-span-1',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isEditMode ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`
        ${sizeClasses[size]}
        relative group
        bg-white/70 backdrop-blur-xl
        border border-white/20
        shadow-[0_8px_32px_rgba(0,0,0,0.05)]
        rounded-[2rem]
        overflow-hidden
        transition-all duration-300
        ${isEditMode ? 'ring-2 ring-primary/30 cursor-grab active:cursor-grabbing' : ''}
        ${className}
      `}
    >
      {/* Glossy Header Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
      
      <div className="relative p-6 h-full flex flex-col">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-800 tracking-tight uppercase opacity-60">
              {title}
            </h3>
            {isEditMode && (
              <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
            )}
          </div>
        )}
        
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>

      {/* Edit Mode Overlay */}
      {isEditMode && (
        <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/20 rounded-[2rem] pointer-events-none" />
      )}
    </motion.div>
  );
};

export default DashboardWidget;
