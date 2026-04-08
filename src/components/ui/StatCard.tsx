import React from 'react';
import { Card } from './Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  secondary?: string;
  icon: LucideIcon;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  secondary, 
  icon: Icon, 
  color = 'text-indigo-600' 
}) => {
  return (
    <Card className="glass-bento p-8 flex flex-col gap-6 group hover:scale-[1.02] transition-all hover:border-white/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-all" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center ${color} shadow-inner`}>
          <Icon size={24} />
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-3xl font-black text-white tracking-tighter leading-none mb-2">{value}</p>
        <p className="text-[11px] text-white/40 uppercase font-black tracking-[0.2em]">{title}</p>
      </div>
      
      {secondary && (
        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest relative z-10">
          {secondary}
        </p>
      )}
    </Card>
  );
};
