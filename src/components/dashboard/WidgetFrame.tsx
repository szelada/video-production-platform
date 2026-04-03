import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2, GripVertical } from 'lucide-react';

interface WidgetFrameProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  className?: string;
  isDraggable?: boolean;
}

export default function WidgetFrame({
  children,
  title,
  subtitle,
  icon: Icon,
  className = '',
  isDraggable = true
}: WidgetFrameProps) {
  return (
    <motion.div
      layout
      className={`
        bg-white/90 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)]
        rounded-[32px] overflow-hidden flex flex-col h-full group transition-all duration-300
        hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:border-white animate-in zoom-in-95 duration-500
        ${className}
      `}
    >
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-zinc-100/50">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-900 shadow-sm border border-zinc-100">
              <Icon size={20} strokeWidth={2.5} />
            </div>
          )}
          <div>
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">{title}</h3>
            {subtitle && <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isDraggable && (
            <div className="cursor-grab active:cursor-grabbing p-1.5 text-zinc-300 hover:text-zinc-600 transition-colors">
              <GripVertical size={16} />
            </div>
          )}
          <button className="p-1.5 text-zinc-300 hover:text-zinc-600 transition-colors">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gradient-to-b from-transparent to-zinc-50/30">
        {children}
      </div>
    </motion.div>
  );
}
