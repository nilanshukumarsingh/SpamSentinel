import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorScheme?: 'rose' | 'emerald' | 'blue' | 'purple' | 'amber' | 'slate';
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = 'slate',
  badge
}) => {
  const schemeStyles = {
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/50',
      badge: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/50',
      badge: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/50',
      badge: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-900/50',
      badge: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/50',
      badge: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
    },
    slate: {
      bg: 'bg-slate-100 dark:bg-zinc-900',
      text: 'text-slate-600 dark:text-zinc-300',
      border: 'border-slate-200 dark:border-zinc-800',
      badge: 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
    }
  }[colorScheme];

  return (
    <div className="bg-white dark:bg-[#09090b] rounded-2xl border border-slate-200 dark:border-zinc-800/80 p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{title}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${schemeStyles.bg} ${schemeStyles.text} border ${schemeStyles.border}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">{value}</h3>
        {badge && (
          <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${schemeStyles.badge}`}>
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{subtitle}</p>}
    </div>
  );
};
