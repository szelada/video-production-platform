import React from 'react';

interface StatWidgetProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

const StatWidget: React.FC<StatWidgetProps> = ({ label, value, subtext, trend, color = 'primary' }) => {
  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[0.65rem] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">
            {label}
          </p>
          <h4 className="text-3xl font-black text-zinc-800 tracking-tighter">
            {value}
          </h4>
        </div>
        {trend && (
          <div className={`
            p-1.5 rounded-full 
            ${trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 
              trend === 'down' ? 'bg-rose-100 text-rose-600' : 
              'bg-zinc-100 text-zinc-400'}
          `}>
            {trend === 'up' && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
            {trend === 'down' && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 flex items-end justify-between">
        {subtext && (
          <span className="text-[0.7rem] font-medium text-zinc-500 opacity-60 italic">
            {subtext}
          </span>
        )}
        
        {/* Simple Sparkline SVG for visual depth */}
        <div className="w-16 h-8 opacity-20">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
            <path
              d="M0,35 Q20,10 40,30 T80,15 T100,25"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className={trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-primary'}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const MetricsRow = ({ stats }: { stats: any[] }) => {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {stats.map((s, i) => (
        <div key={i} className="p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100">
          <StatWidget {...s} />
        </div>
      ))}
    </div>
  );
};

export default StatWidget;
