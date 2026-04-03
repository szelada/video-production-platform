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
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-xl bg-gray-50 ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{title}</p>
      </div>
      {secondary && (
        <p className="text-[10px] text-gray-500 font-medium">
          {secondary}
        </p>
      )}
    </Card>
  );
};
